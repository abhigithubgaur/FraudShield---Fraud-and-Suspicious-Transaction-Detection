package com.project.TransactionDetection.service;

import com.project.TransactionDetection.controller.NotificationController;
import com.project.TransactionDetection.entity.FraudAlert;
import com.project.TransactionDetection.entity.Transaction;
import com.project.TransactionDetection.entity.TransactionStatus;
import com.project.TransactionDetection.entity.User;
import com.project.TransactionDetection.fraud.FraudEngine;
import com.project.TransactionDetection.repository.FraudAlertRepository;
import com.project.TransactionDetection.repository.TransactionRepository;
import com.project.TransactionDetection.repository.UserRepository; // 1. Import your UserRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;// 2. Inject UserRepository

    @Autowired
    private FraudEngine fraudEngine;

    @Autowired
    private OtpService otpService;


    @Autowired
    private FraudAlertRepository fraudAlertRepository;

    @Transactional
    public Transaction evaluateAndProcess(Transaction transaction) {

        User sender = userRepository.findById(transaction.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender profile not found"));

        if ("FROZEN".equalsIgnoreCase(sender.getAccountStatus())) {

            throw new RuntimeException("Transaction denied. Your account is currently frozen due to security constraints.");
        }

        transaction.setTransactionTime(LocalDateTime.now());

        double computedScore = fraudEngine.calculateFraudScore(transaction);
        transaction.setFraudScore(computedScore);


        if (computedScore >= 0.75) {

            transaction.setStatus(TransactionStatus.REJECTED);

            Transaction saved =
                    transactionRepository.save(transaction);

            User sendr = userRepository.findById(saved.getSenderId())
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

            sendr.setRiskScore(
                    Math.min(1.0,
                            sendr.getRiskScore() + 0.40)
            );

            sendr.setAccountStatus("FROZEN");

            userRepository.save(sendr);

            FraudAlert alert = FraudAlert.builder()
                    .transaction(saved)
                    .reason("High fraud score detected")
                    .severity("HIGH")
                    .createdAt(LocalDateTime.now())
                    .build();

            fraudAlertRepository.save(alert);

            NotificationController.sendAlert(
                    saved.getSenderId(),
                    "CRITICAL_ALERT",
                    "Security Alert: A high-risk transaction of $" +
                            saved.getAmount() +
                            " was blocked automatically."
            );

            return saved;
        } else if (computedScore >= 0.50) {

            transaction.setStatus(TransactionStatus.FLAGGED);

            Transaction savedTransaction =
                    transactionRepository.save(transaction);

            User sendr = userRepository.findById(savedTransaction.getSenderId())
                    .orElseThrow();

            sendr.setRiskScore(
                    Math.min(
                            1.0,
                            sendr.getRiskScore() + 0.20
                    )
            );

            userRepository.save(sendr);

            otpService.generateAndSaveOtp(
                    savedTransaction.getId()
            );

            FraudAlert alert = FraudAlert.builder()
                    .transaction(savedTransaction)
                    .reason("Suspicious activity detected")
                    .severity("MEDIUM")
                    .createdAt(LocalDateTime.now())
                    .build();

            fraudAlertRepository.save(alert);

            NotificationController.sendAlert(
                    savedTransaction.getSenderId(),
                    "SUSPICIOUS_ACTIVITY",
                    "Suspicious transaction detected! An OTP has been generated to verify your identity."
            );

            return savedTransaction;
        } else {
            transaction.setStatus(TransactionStatus.APPROVED);
            transactionRepository.save(transaction);

            User sendr = userRepository.findById(transaction.getSenderId())
                    .orElseThrow();

            sendr.setRiskScore(
                    Math.max(
                            0.0,
                            sendr.getRiskScore() - 0.05
                    )
            );

            userRepository.save(sendr);
        }

        return transaction;
    }

}
