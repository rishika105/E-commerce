package com.ecom.repository;

import com.ecom.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Custom query methods if needed
    Category findByCategoryName(String categoryName);
}
