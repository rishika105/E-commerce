package com.ecom.repository;

import com.ecom.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<User.PasswordResetToken, Long> {
    Optional<User.PasswordResetToken> findByToken(String token);
    User.PasswordResetToken findByUser(User user);
}
