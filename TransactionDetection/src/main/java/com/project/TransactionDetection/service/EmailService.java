package com.project.TransactionDetection.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Verify your transaction");
            helper.setText("""
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                    <h2 style="color:#c0392b;">Suspicious Transaction Detected</h2>
                    <p>We need to verify it's really you. Enter the code below to approve this transaction. It expires in <b>5 minutes</b>.</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background:#f4f4f4; padding: 16px; text-align:center; border-radius:8px;">
                        %s
                    </div>
                    <p style="color:#888; font-size:13px; margin-top:20px;">
                        If you didn't attempt this transaction, do not enter this code and contact support immediately.
                    </p>
                </div>
                """.formatted(otp), true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
