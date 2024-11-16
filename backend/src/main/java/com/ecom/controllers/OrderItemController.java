package com.ecom.controllers;

import com.ecom.models.OrderItem;
import com.ecom.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    // Get all Order Items
    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        return ResponseEntity.ok(orderItemService.getAllOrderItems());
    }

    // Get an Order Item by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Long id) {
        return ResponseEntity.ok(orderItemService.getOrderItemById(id));
    }

    // Create a new Order Item
    @PostMapping
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderItem) {
        return ResponseEntity.ok(orderItemService.saveOrderItem(orderItem));
    }

    // Update an existing Order Item
    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> updateOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItemDetails) {
        OrderItem updatedOrderItem = orderItemService.getOrderItemById(id);
        updatedOrderItem.setItemName(orderItemDetails.getItemName());
        updatedOrderItem.setItemPrice(orderItemDetails.getItemPrice());
        updatedOrderItem.setQuantity(orderItemDetails.getQuantity());
        updatedOrderItem.setOrder(orderItemDetails.getOrder());
        return ResponseEntity.ok(orderItemService.saveOrderItem(updatedOrderItem));
    }

    // Delete an Order Item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}