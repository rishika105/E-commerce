package com.ecom.repository;

import com.ecom.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Get the cart items for a specific user
    List<Cart> findByUserUserId(Long userId);
}
