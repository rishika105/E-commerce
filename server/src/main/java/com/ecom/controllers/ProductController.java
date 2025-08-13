package com.ecom.controllers;

import com.ecom.models.Product;
import com.ecom.models.User;
import com.ecom.services.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/allProducts")

    public ResponseEntity<Map<String, Object>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Products retrieved successfully");
            response.put("products", products);  // Returning actual product list
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving products");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product retrieved successfully");
            response.put("product", product);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving product");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping(value = "/createProduct", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE})
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> createProduct(
            @RequestPart(value = "product") String productJson,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            // Add debug logging
            System.out.println("Authentication Principal: " + user);
            if (user != null) {
                System.out.println("User ID: " + user.getId());
                System.out.println("User Email: " + user.getEmail());
                System.out.println("User Roles: " + user.getAuthorities());
            } else {
                System.out.println("User is null!");
                // Get the current authentication object for debugging
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                System.out.println("Current Authentication: " + auth);
                if (auth != null) {
                    System.out.println("Auth Principal: " + auth.getPrincipal());
                    System.out.println("Auth Authorities: " + auth.getAuthorities());
                }
            }
            if (user == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Error creating product");
                response.put("error", "No authenticated user found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            Product product = objectMapper.readValue(productJson, Product.class);
            product.setUser(user);  // Make sure user is set here
            Product newProduct = productService.createProduct(product, image);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product created successfully");
            response.put("product", newProduct);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error creating product");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping(value = "/updateProduct/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE})
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id,
                                                             @RequestPart("product") String productJson,
                                                             @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Product productDetails = objectMapper.readValue(productJson, Product.class);

            // Validate category and stock
            if (productDetails.getCategory() == null || productDetails.getCategory().getCategoryId() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Category ID must not be null");
                return ResponseEntity.badRequest().body(response);
            }
            if (productDetails.getStock() < 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Stock cannot be negative");
                return ResponseEntity.badRequest().body(response);
            }

            Product updatedProduct = productService.updateProduct(id, productDetails, image);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product updated successfully");
            response.put("product", updatedProduct);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error updating product");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PatchMapping("/updateStock/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> updateStock(@PathVariable Long id, @RequestParam int quantity) {
        try {
            Product updatedProduct = productService.updateStock(id, quantity);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stock updated successfully");
            response.put("product", updatedProduct);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error updating stock");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/deleteProduct/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();  // No content needed for delete
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error deleting product");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Search completed successfully");
        response.put("products", products);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(@PathVariable Long categoryId) {
        try {
            List<Product> products = productService.getProductsByCategory(categoryId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Products retrieved successfully");
            response.put("products", products);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving products");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/seller/{userId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> getProductsBySeller(@PathVariable Long userId) {
        try {
            List<Product> products = productService.getProductsBySeller(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Products retrieved successfully");
            response.put("products", products);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Error retrieving products");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

}
