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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    private ResponseEntity<Map<String, Object>> createResponse(String message, Object data, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return new ResponseEntity<>(response, status);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, String error, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("error", error);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping(value = "/createProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return createErrorResponse("Error creating product", "No authenticated user found", HttpStatus.UNAUTHORIZED);
            }

            Product product = objectMapper.readValue(productJson, Product.class);
            product.setUser(user);
            Product newProduct = productService.createProduct(product, image);

            return createResponse("Product created successfully", newProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return createErrorResponse("Error creating product", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/allProducts")
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return createResponse("Products retrieved successfully", products, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Error retrieving products", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return createResponse("Product retrieved successfully", product, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Error retrieving product", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/updateProduct/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable Long id,
                                                             @RequestPart("product") String productJson,
                                                             @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Product productDetails = objectMapper.readValue(productJson, Product.class);

            // Validate category and stock
            if (productDetails.getCategory() == null || productDetails.getCategory().getCategoryId() == null) {
                return createErrorResponse("Category ID must not be null", null, HttpStatus.BAD_REQUEST);
            }
            if (productDetails.getStock() < 0) {
                return createErrorResponse("Stock cannot be negative", null, HttpStatus.BAD_REQUEST);
            }

            Product updatedProduct = productService.updateProduct(id, productDetails, image);
            return createResponse("Product updated successfully", updatedProduct, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Error updating product", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/updateStock/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> updateStock(@PathVariable Long id, @RequestParam int quantity) {
        try {
            Product updatedProduct = productService.updateStock(id, quantity);
            return createResponse("Stock updated successfully", updatedProduct, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return createErrorResponse(e.getMessage(), null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return createErrorResponse("Error updating stock", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteProduct/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return createErrorResponse("Error deleting product", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(@RequestParam String keyword) {
        try {
            List<Product> products = productService.searchProducts(keyword);
            return createResponse("Search completed successfully", products, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Error searching products", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(@PathVariable Long categoryId) {
        try {
            List<Product> products = productService.getProductsByCategory(categoryId);
            return createResponse("Products retrieved successfully", products, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Error retrieving products", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/seller/{userId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Map<String, Object>> getProductsBySeller(@PathVariable Long userId) {
        try {
            List<Product> products = productService.getProductsBySeller(userId);
            return createResponse("Products retrieved successfully", products, HttpStatus.OK);
        } catch (Exception e) {
            return createErrorResponse("Error retrieving products", e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}