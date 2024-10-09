package com.ecom.repository;

import com.ecom.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Get payments by user ID
    List<Payment> findByUserUserId(Long userId);
}

