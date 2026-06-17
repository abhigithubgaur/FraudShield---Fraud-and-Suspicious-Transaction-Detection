package com.project.TransactionDetection.service;

import com.project.TransactionDetection.dto.AdminDashboardMetrics;
import com.project.TransactionDetection.entity.FraudAlert;
import com.project.TransactionDetection.entity.Transaction;
import com.project.TransactionDetection.entity.TransactionStatus;
import com.project.TransactionDetection.entity.User;
import com.project.TransactionDetection.fraud.FraudEngine;
import com.project.TransactionDetection.repository.FraudAlertRepository;
import com.project.TransactionDetection.repository.TransactionRepository;
import com.project.TransactionDetection.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final TransactionRepository transactionRepository;
    private final FraudAlertRepository fraudAlertRepository;
    private final UserRepository userRepository;
    private final FraudEngine fraudEngine;

    public AdminService(TransactionRepository transactionRepository,
                        FraudAlertRepository fraudAlertRepository,
                        UserRepository userRepository,
                        FraudEngine fraudEngine) {
        this.transactionRepository = transactionRepository;
        this.fraudAlertRepository = fraudAlertRepository;
        this.userRepository = userRepository;
        this.fraudEngine = fraudEngine;
    }

    public AdminDashboardMetrics getDashboardMetrics() {
        return AdminDashboardMetrics.builder()
                .totalTransactions(transactionRepository.count())
                .flaggedTransactionsCount(transactionRepository.countByStatus(TransactionStatus.FLAGGED))
                .activeAlertsCount(fraudAlertRepository.count())
                .totalVolumeProcessed(transactionRepository.sumApprovedTransactionVolume())
                // Safe lookup matching your exact database schema
                .highRiskUsersCount(userRepository.countByAccountStatus("FROZEN"))
                .build();
    }

    public List<FraudAlert> getAllAlerts() {
        return fraudAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Transaction resolveFlaggedTransaction(Long transactionId, String action) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction lookup failed. Target ID not found."));

        if (tx.getStatus() != TransactionStatus.FLAGGED) {
            throw new IllegalStateException("Transaction is not in FLAGGED state and cannot be modified.");
        }

        if ("APPROVE".equalsIgnoreCase(action)) {
            tx.setStatus(TransactionStatus.APPROVED);
        } else if ("REJECT".equalsIgnoreCase(action)) {
            tx.setStatus(TransactionStatus.REJECTED);
        } else {
            throw new IllegalArgumentException("Invalid action parameter. Must be APPROVE or REJECT.");
        }

        return transactionRepository.save(tx);
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Target user account entry not found."));

        if (!"ACTIVE".equalsIgnoreCase(status) && !"FROZEN".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Invalid state transition parameter. Must be ACTIVE or FROZEN.");
        }

        user.setAccountStatus(status.toUpperCase());
        return userRepository.save(user);
    }

    public List<User> getAllUserRiskProfiles() {
        // Pulls all users, sorting FROZEN (High Risk) flags to the top of the grid
        return userRepository.findAllByOrderByAccountStatusAsc();
    }

    public Map<String, Object> getCurrentFraudRules() {
        Map<String, Object> rules = new HashMap<>();
        rules.put("highAmountThreshold", fraudEngine.getHighAmountThreshold());
        rules.put("velocityLimitHigh", fraudEngine.getVelocityLimitHigh());
        rules.put("velocityLimitMedium", fraudEngine.getVelocityLimitMedium());
        return rules;
    }

    public void updateFraudRules(Map<String, Object> updatedRules) {
        if (updatedRules.containsKey("highAmountThreshold")) {
            fraudEngine.setHighAmountThreshold(Double.valueOf(updatedRules.get("highAmountThreshold").toString()));
        }
        if (updatedRules.containsKey("velocityLimitHigh")) {
            fraudEngine.setVelocityLimitHigh(Integer.parseInt(updatedRules.get("velocityLimitHigh").toString()));
        }
        if (updatedRules.containsKey("velocityLimitMedium")) {
            fraudEngine.setVelocityLimitMedium(Integer.parseInt(updatedRules.get("velocityLimitMedium").toString()));
        }
    }

    public byte[] generateFraudReportCSV() {
        List<FraudAlert> alerts = fraudAlertRepository.findAll();
        StringBuilder csvBuilder = new StringBuilder();

        csvBuilder.append("Alert ID,Transaction ID,Reason,Risk Score,Created At\n");

        for (FraudAlert alert : alerts) {
            csvBuilder.append(alert.getId()).append(",")
                    .append(alert.getTransaction().getId()).append(",")
                    .append(alert.getReason().replace(",", ";")).append(",")
                    .append(alert.getCreatedAt()).append("\n");
        }

        return csvBuilder.toString().getBytes(StandardCharsets.UTF_8);
    }
}