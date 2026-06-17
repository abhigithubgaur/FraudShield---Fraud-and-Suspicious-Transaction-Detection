package com.project.TransactionDetection.repository;

import com.project.TransactionDetection.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    long countByAccountStatus(String accountStatus);
    List<User> findAllByOrderByAccountStatusAsc();
}
