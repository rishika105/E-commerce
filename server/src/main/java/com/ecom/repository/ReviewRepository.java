package com.ecom.repository;

import com.ecom.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Get all reviews for a specific product
    List<Review> findByProductProductId(Long productId);
}
