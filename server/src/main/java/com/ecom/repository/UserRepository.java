package com.ecom.repository;

import com.ecom.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); // Add this method
    boolean existsByEmail(String email);
}

