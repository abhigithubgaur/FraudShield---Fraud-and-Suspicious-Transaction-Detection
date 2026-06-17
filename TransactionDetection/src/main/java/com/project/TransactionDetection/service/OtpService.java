package com.project.TransactionDetection.service;

import com.project.TransactionDetection.entity.TransactionOtp;
import com.project.TransactionDetection.repository.TransactionOtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private TransactionOtpRepository otpRepository;

    public String generateAndSaveOtp(Long transactionId) {

        String otp = String.format("%06d", new Random().nextInt(999999));

        // Delete old OTP if it exists for this transaction to avoid duplicates
        otpRepository.findByTransactionId(transactionId).ifPresent(otpRepository::delete);

        TransactionOtp transactionOtp = TransactionOtp.builder()
                .transactionId(transactionId)
                .otpCode(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5)) // Valid for 5 minutes
                .isUsed(false)
                .build();

        otpRepository.save(transactionOtp);

        System.out.println("⚠️ [SECURITY ALERT] OTP for Transaction ID " + transactionId + " is: " + otp);

        return otp;
    }

    public boolean validateOtp(Long transactionId, String userInputOtp) {
        return otpRepository.findByTransactionId(transactionId)
                .map(otp -> {
                    if (otp.isUsed() || otp.getExpiryTime().isBefore(LocalDateTime.now())) {
                        return false;
                    }
                    if (otp.getOtpCode().equals(userInputOtp)) {
                        otp.setUsed(true);
                        otpRepository.save(otp);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }
}