package com.project.TransactionDetection.service;

import com.project.TransactionDetection.entity.TransactionOtp;
import com.project.TransactionDetection.repository.TransactionOtpRepository;
import com.project.TransactionDetection.repository.UserRepository;
import com.project.TransactionDetection.repository.TransactionRepository;
import com.project.TransactionDetection.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private TransactionOtpRepository otpRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public String generateAndSaveOtp(Long transactionId) {

        String otp = String.format("%06d", new Random().nextInt(999999));

        // Delete old OTP if it exists for this transaction to avoid duplicates
        otpRepository.findByTransactionId(transactionId).ifPresent(otpRepository::delete);

        TransactionOtp transactionOtp = TransactionOtp.builder()
                .transactionId(transactionId)
                .otpCode(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5)) // Valid for 5 minutes
                .isUsed(false)
                .build();

        otpRepository.save(transactionOtp);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));

        User sender = userRepository.findById(transaction.getSenderId())
                .orElseThrow(() -> new RuntimeException("User not found for senderId: " + transaction.getSenderId()));

        emailService.sendOtpEmail(sender.getEmail(), otp);

        System.out.println("⚠️ [SECURITY ALERT] OTP for Transaction ID " + transactionId + " is: " + otp);

        return otp;
    }

    public boolean validateOtp(Long transactionId, String userInputOtp) {
        return otpRepository.findByTransactionId(transactionId)
                .map(otp -> {
                    if (otp.isUsed() || otp.getExpiryTime().isBefore(LocalDateTime.now())) {
                        return false;
                    }
                    if (otp.getOtpCode().equals(userInputOtp)) {
                        otp.setUsed(true);
                        otpRepository.save(otp);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }
}
