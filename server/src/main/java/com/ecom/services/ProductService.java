package com.ecom.services;

import com.ecom.models.Category;
import com.ecom.models.Product;
import com.ecom.models.User;
import com.ecom.repository.CategoryRepository;
import com.ecom.repository.ProductRepository;
import com.ecom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) throws Exception {
        return productRepository.findById(id)
                .orElseThrow(() -> new Exception("Product not found with id: " + id));
    }

    @Transactional
    public Product createProduct(Product product, MultipartFile image) throws IOException {
        if (product.getCategory() == null || product.getCategory().getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }

        // Ensure the category exists and is managed by the persistence context
        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + product.getCategory().getCategoryId()));
        product.setCategory(category);

        // Upload image and set URL
        String imageUrl = cloudinaryService.uploadImage(image);
        product.setImageUrl(imageUrl);

        // Set creation and update times
        LocalDateTime now = LocalDateTime.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        // Ensure stock is not negative
        if (product.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }

        // Save the product
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails, MultipartFile image) throws Exception {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());

        if (productDetails.getCategory() == null || productDetails.getCategory().getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID must not be null");
        }

        Category category = categoryRepository.findById(productDetails.getCategory().getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + productDetails.getCategory().getCategoryId()));
        product.setCategory(category);

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            product.setImageUrl(imageUrl);
        }

        // Update the update time
        product.setUpdatedAt(LocalDateTime.now());

        // Ensure stock is not negative
        if (product.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }

        return productRepository.save(product);
    }

    @Transactional
    public Product updateStock(Long id, int quantity) throws Exception {
        Product product = getProductById(id);
        int newStock = product.getStock() + quantity;
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        product.setStock(newStock);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId);
    }
    public List<Product> getProductsBySeller(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return productRepository.findByUser(user);
    }
}