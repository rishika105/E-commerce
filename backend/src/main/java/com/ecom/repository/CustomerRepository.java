package com.ecom.repository;
import com.ecom.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Additional query methods if needed
}
