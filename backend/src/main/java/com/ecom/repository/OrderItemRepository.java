package com.ecom.repository;

import com.ecom.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Find order items by order ID
    OrderItem findByOrderOrderId(Long orderId);
}
