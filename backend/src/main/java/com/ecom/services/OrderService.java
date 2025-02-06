package com.ecom.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecom.models.Order;
import com.ecom.repository.CustomerRepository;
import com.ecom.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public void saveOrder(Order order) {
        // If order already has a customer set, no need to fetch again
        if (order.getCustomer() != null) {
            order.setOrderDate(LocalDateTime.now());  // Set current date and time
            orderRepository.save(order);  // Save or update the order
        } else {
            throw new RuntimeException("Customer not found for the order");
        }
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
