package com.project.TransactionDetection.controller;

import com.project.TransactionDetection.dto.AdminDashboardMetrics;
import com.project.TransactionDetection.dto.ResolveTransactionRequest;
import com.project.TransactionDetection.entity.FraudAlert;
import com.project.TransactionDetection.entity.Transaction;
import com.project.TransactionDetection.entity.User;
import com.project.TransactionDetection.service.AdminService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<AdminDashboardMetrics> getMetrics() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<FraudAlert>> getAllAlerts() {
        return ResponseEntity.ok(adminService.getAllAlerts());
    }

    @PutMapping("/transactions/{id}/resolve")
    public ResponseEntity<?> resolveTransaction(@PathVariable Long id,
                                                @RequestBody ResolveTransactionRequest request) {
        try {
            Transaction updatedTx = adminService.resolveFlaggedTransaction(id, request.getAction());
            return ResponseEntity.ok(updatedTx);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> freezeOrActivateUser(@PathVariable Long id,
                                                  @RequestParam String status) {
        try {
            User updatedUser = adminService.updateUserStatus(id, status);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users/risk-profiles")
    public ResponseEntity<List<User>> getUserRiskProfiles() {
        return ResponseEntity.ok(adminService.getAllUserRiskProfiles());
    }

    @GetMapping("/rules")
    public ResponseEntity<Map<String, Object>> getFraudRules() {
        return ResponseEntity.ok(adminService.getCurrentFraudRules());
    }

    @PutMapping("/rules")
    public ResponseEntity<?> updateFraudRule(@RequestBody Map<String, Object> updatedRules) {
        try {
            adminService.updateFraudRules(updatedRules);
            return ResponseEntity.ok().body(Map.of("message", "Fraud thresholds successfully updated in memory."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/reports/csv")
    public ResponseEntity<byte[]> downloadFraudReport() {
        byte[] csvData = adminService.generateFraudReportCSV();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=fraud_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}