package com.project.TransactionDetection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardMetrics {
    private long totalTransactions;
    private long flaggedTransactionsCount;
    private long activeAlertsCount;
    private Double totalVolumeProcessed;
    private long highRiskUsersCount;
}