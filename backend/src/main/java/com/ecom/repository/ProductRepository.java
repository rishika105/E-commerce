package com.ecom.repository;

import com.ecom.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Additional custom query methods for products
    List<Product> findByCategoryCategoryId(Long categoryId);
}
