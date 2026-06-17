package com.project.TransactionDetection.repository;

import com.project.TransactionDetection.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {

    List<FraudAlert> findAllByOrderByCreatedAtDesc();
}