package com.project.TransactionDetection.fraud;

import com.project.TransactionDetection.entity.Transaction;
import com.project.TransactionDetection.repository.TransactionRepository;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class FraudEngine {

    private final TransactionRepository transactionRepository;

    // REMOVED 'final' so these values can be updated dynamically by the Admin
    private Double highAmountThreshold = 100000.0;
    private int velocityLimitHigh = 5;
    private int velocityLimitMedium = 3;

    public FraudEngine(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // --- Dynamic Getters and Setters for Admin Management ---
    public Double getHighAmountThreshold() { return highAmountThreshold; }
    public void setHighAmountThreshold(Double threshold) { this.highAmountThreshold = threshold; }

    public int getVelocityLimitHigh() { return velocityLimitHigh; }
    public void setVelocityLimitHigh(int limit) { this.velocityLimitHigh = limit; }

    public int getVelocityLimitMedium() { return velocityLimitMedium; }
    public void setVelocityLimitMedium(int limit) { this.velocityLimitMedium = limit; }


    public Double calculateFraudScore(Transaction currentTx) {
        double amountRisk = evaluateAmountRisk(currentTx.getAmount());
        double velocityRisk = evaluateVelocityRisk(currentTx.getSenderId());
        double geoRisk = evaluateGeoRisk(currentTx);

        return (0.6 * amountRisk) + (0.2 * velocityRisk) + (0.2 * geoRisk);
    }

    private double evaluateAmountRisk(Double amount) {
        // Utilizing the dynamic field instead of hardcoded final variable
        if (amount >= highAmountThreshold) return 1.0;
        if (amount > (highAmountThreshold / 2)) return 0.5;
        return 0.0;
    }

    private double evaluateVelocityRisk(Long senderId) {
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        long txCount = transactionRepository.countBySenderIdAndTransactionTimeAfter(senderId, oneMinuteAgo);

        // Utilizing dynamic velocity configurations
        if (txCount >= velocityLimitHigh) return 1.0;
        if (txCount >= velocityLimitMedium) return 0.6;
        return 0.0;
    }

    private double evaluateGeoRisk(Transaction currentTx) {
        List<Transaction> pastTx = transactionRepository.findBySenderIdOrderByTransactionTimeDesc(currentTx.getSenderId());
        if (!pastTx.isEmpty()) {
            Transaction lastTx = pastTx.get(0);
            if (!lastTx.getLocation().equalsIgnoreCase(currentTx.getLocation())) {
                return 0.8;
            }
        }
        return 0.0;
    }
}