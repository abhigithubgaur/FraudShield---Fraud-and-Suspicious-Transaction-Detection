package com.project.TransactionDetection.repository;

import com.project.TransactionDetection.entity.Transaction;
import com.project.TransactionDetection.entity.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    long countBySenderIdAndTransactionTimeAfter(Long senderId, LocalDateTime time);
    List<Transaction> findBySenderIdOrderByTransactionTimeDesc(Long senderId);

    // Admin metrics helpers
    long countByStatus(TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.status = 'APPROVED'")
    double sumApprovedTransactionVolume();
}