package com.project.TransactionDetection.controller;

import com.project.TransactionDetection.entity.Transaction;
import com.project.TransactionDetection.entity.TransactionStatus;
import com.project.TransactionDetection.repository.TransactionRepository;
import com.project.TransactionDetection.service.OtpService;
import com.project.TransactionDetection.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/{txId}/verify-otp")
    public ResponseEntity<?> verifyTransactionOtp(@PathVariable Long txId, @RequestBody Map<String, String> request) {
        String code = request.get("otpCode");

        Transaction transaction = transactionRepository.findById(txId)
                .orElseThrow(() -> new RuntimeException("Transaction records not found"));

        if (transaction.getStatus() != TransactionStatus.FLAGGED) {
            return ResponseEntity.badRequest().body(Map.of("message", "This transaction does not require verification."));
        }

        boolean isValid = otpService.validateOtp(txId, code);

        if (isValid) {
            transaction.setStatus(TransactionStatus.APPROVED);
            transactionRepository.save(transaction);
            return ResponseEntity.ok(Map.of(
                    "status", "APPROVED",
                    "message", "Security challenge passed. Transaction processed successfully!"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "status", "FAILED",
                    "message", "Invalid or expired authorization code."
            ));
        }
    }

    @GetMapping("/my-history/{userId}")
    public ResponseEntity<?> getUserTransactionHistory(@PathVariable Long userId) {
        // Note: In production, validate that the authenticated JWT user matches this userId
        List<Transaction> history = transactionRepository.findBySenderIdOrderByTransactionTimeDesc(userId);

        if (history.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No transactions found for this account."));
        }

        return ResponseEntity.ok(history);
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateTransaction(
            @RequestBody Transaction transaction) {

        try {

            Transaction processed =
                    transactionService.evaluateAndProcess(transaction);

            if (processed.getStatus() == TransactionStatus.FLAGGED) {

                return ResponseEntity.ok(Map.of(
                        "status", "FLAGGED",
                        "transactionId", processed.getId(),
                        "message", "Suspicious transaction detected. OTP verification required."
                ));
            }

            if (processed.getStatus() == TransactionStatus.REJECTED) {

                return ResponseEntity.ok(Map.of(
                        "status", "REJECTED",
                        "message", "Transaction blocked due to high fraud risk."
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "status", "APPROVED",
                    "message", "Transaction completed successfully."
            ));

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", ex.getMessage())
            );
        }
    }
}