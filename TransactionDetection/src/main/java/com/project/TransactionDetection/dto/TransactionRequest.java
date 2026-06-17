package com.project.TransactionDetection.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private Long receiverId;
    private Double amount;
    private String location;
    private String ipAddress;
}
