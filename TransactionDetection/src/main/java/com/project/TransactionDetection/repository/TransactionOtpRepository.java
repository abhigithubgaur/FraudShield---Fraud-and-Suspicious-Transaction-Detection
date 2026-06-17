package com.project.TransactionDetection.repository;

import com.project.TransactionDetection.entity.TransactionOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TransactionOtpRepository extends JpaRepository<TransactionOtp, Long> {
    Optional<TransactionOtp> findByTransactionId(Long transactionId);
}