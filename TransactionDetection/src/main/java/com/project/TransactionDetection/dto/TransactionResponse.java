package com.project.TransactionDetection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long transactionId;
    private Long senderId;
    private Long receiverId;
    private Double amount;
    private String status;       // APPROVED, FLAGGED, REJECTED
    private Double fraudScore;
    private LocalDateTime transactionTime;
    private String alertMessage;
}