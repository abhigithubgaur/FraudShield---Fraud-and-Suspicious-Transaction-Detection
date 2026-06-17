package com.project.TransactionDetection.service;


import com.project.TransactionDetection.dto.AuthResponse;
import com.project.TransactionDetection.dto.LoginRequest;
import com.project.TransactionDetection.dto.RegisterRequest;
import com.project.TransactionDetection.entity.User;
import com.project.TransactionDetection.repository.UserRepository;
import com.project.TransactionDetection.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public String registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        String formattedRole = request.getRole().toUpperCase().startsWith("ROLE_")
                ? request.getRole().toUpperCase()
                : "ROLE_" + request.getRole().toUpperCase();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt hashing
                .role(formattedRole)
                .accountStatus("ACTIVE")
                .riskScore(0.0)
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password!"));

        // Compare raw password against hashed database string
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        if ("FROZEN".equalsIgnoreCase(user.getAccountStatus())) {
            throw new RuntimeException("Account is frozen due to suspicious activity. Contact admin.");
        }

        // Generate the token payload
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole());
    }
}
