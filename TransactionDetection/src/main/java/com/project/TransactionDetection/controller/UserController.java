package com.project.TransactionDetection.controller;

import com.project.TransactionDetection.dto.UserSummaryDto;
import com.project.TransactionDetection.entity.User;
import com.project.TransactionDetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/freeze")
    public ResponseEntity<?> freezeMyAccount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        user.setAccountStatus("FROZEN");
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Your account has been frozen instantly. All outbound payments are locked until verified by support."
        ));


    }
    @GetMapping("/all")
    public ResponseEntity<List<UserSummaryDto>> getAllUsers() {

        List<UserSummaryDto> users =
                userRepository.findAll()
                        .stream()
                        .map(user ->
                                new UserSummaryDto(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail()
                                ))
                        .toList();

        return ResponseEntity.ok(users);
    }
}