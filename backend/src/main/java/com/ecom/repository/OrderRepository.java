package com.ecom.repository;

import com.ecom.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find all orders for a specific user
    List<Order> findByUserUserId(Long userId);
}
