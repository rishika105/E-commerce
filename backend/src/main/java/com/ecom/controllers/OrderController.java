package com.ecom.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecom.models.Customer;
import com.ecom.models.Order;
import com.ecom.models.OrderItem;
import com.ecom.services.CustomerService;
import com.ecom.services.OrderService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        orderService.saveOrder(order);
        return ResponseEntity.ok("Order created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Order existingOrder = orderService.getOrderById(id);
        existingOrder.setPaymentMethod(order.getPaymentMethod());
        existingOrder.setSubtotal(order.getSubtotal());
        existingOrder.setGrandTotal(order.getGrandTotal());
        orderService.saveOrder(existingOrder);
        return ResponseEntity.ok(existingOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> checkoutData) {
        try {
            // Extract billing details
            Map<String, String> billingDetails = (Map<String, String>) checkoutData.get("billingDetails");

            // Create or update customer
            Customer customer = new Customer();
            customer.setFullName(billingDetails.get("firstName"));
            customer.setCompany(billingDetails.get("company"));
            customer.setStreetAddress(billingDetails.get("streetAddress"));
            customer.setApartment(billingDetails.get("apartment"));
            customer.setCity(billingDetails.get("city"));
            customer.setPhone(billingDetails.get("phone"));
            customer.setEmail(billingDetails.get("email"));
            customer = customerService.saveCustomer(customer);

            // Create order
            Order order = new Order();
            order.setCustomer(customer);
            order.setPaymentMethod((String) checkoutData.get("paymentMethod"));
            order.setSubtotal(new BigDecimal(checkoutData.get("totalPrice").toString()));
            order.setGrandTotal(new BigDecimal(checkoutData.get("totalPrice").toString()));
            order.setOrderDate(LocalDateTime.now());

            // Add order items
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) checkoutData.get("cart");
            for (Map<String, Object> item : cartItems) {
                OrderItem orderItem = new OrderItem();
                orderItem.setItemName((String) item.get("name"));
                orderItem.setItemPrice(new BigDecimal(item.get("price").toString()));
                orderItem.setQuantity((Integer) item.get("quantity"));
                order.addOrderItem(orderItem);
            }

            orderService.saveOrder(order);

            return ResponseEntity.ok("Order placed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing order: " + e.getMessage());
        }
    }
}
