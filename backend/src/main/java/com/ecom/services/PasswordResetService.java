package com.ecom.services;

import com.ecom.models.User.PasswordResetToken;
import com.ecom.models.User;
import com.ecom.repository.PasswordResetTokenRepository;
import com.ecom.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    public ResponseEntity<Map<String, String>> requestPasswordReset(Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        Map<String, String> response = new HashMap<>();

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Check if a reset token already exists for this user
            PasswordResetToken existingToken = tokenRepository.findByUser(user);
            if (existingToken != null) {
                // Delete the existing token if it exists
                tokenRepository.delete(existingToken);
            }

            // Generate a new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(new Date(System.currentTimeMillis() + 3600000)); // 1 hour expiry
            tokenRepository.save(resetToken);

            // Send the email with the new token
            sendEmail(user.getEmail(), token);

            // Send a JSON response
            response.put("message", "Password reset email sent successfully to " + email);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Email id not registered");
            return ResponseEntity.badRequest().body(response);
        }
    }

    private void sendEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link: " +
                "http://localhost:4200/reset-password?token=" + token);
        mailSender.send(message);
    }

    public ResponseEntity<Map<String, String>> resetPassword(Map<String, String> request) {

        Map<String, String> response = new HashMap<>();
        String token = request.get("token");
        String password = request.get("password");
        String confirmPassword = request.get("confirmPassword");

        // Password confirmation check
        if (!confirmPassword.equals(password)) {
            response.put("message", "Passwords do not match");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate the token
        Optional<PasswordResetToken> resetTokenOptional = tokenRepository.findByToken(token);
        if (resetTokenOptional.isPresent()) {
            PasswordResetToken resetToken = resetTokenOptional.get();

            // Check if the token is expired
            if (isTokenExpired(resetToken)) {
                response.put("message", "Token expired");
                return ResponseEntity.badRequest().body(response);
            }

            // Update the user's password
            User user = resetToken.getUser();
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
            user.setPassword(hashedPassword);
            userRepository.save(user);

            // Delete the token
            tokenRepository.delete(resetToken);

            // Success response
            response.put("message", "Password successfully reset");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Token invalid");
            return ResponseEntity.badRequest().body(response);
        }
    }

    private boolean isTokenExpired(PasswordResetToken token) {
        Date now = new Date();
        return token.getExpiryDate().before(now);
    }
}
