package com.ecom.services;

import com.ecom.models.Product;
import com.ecom.models.User;
import com.ecom.models.Wishlist;
import com.ecom.repository.ProductRepository;
import com.ecom.repository.WishlistRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    public String toggleWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product with id: " + productId + " not found"));

        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUserAndProduct(user, product);

        if (wishlistOpt.isPresent()) {
            wishlistRepository.deleteByUserAndProduct(user, product);
            return "removed";
        } else {
            wishlistRepository.save(new Wishlist(user, product));
            return "added";
        }
    }

    public List<Product> getUserWishlist(User user) {
        return wishlistRepository.findAll().stream()
                .filter(w -> w.getUser().equals(user))
                .map(Wishlist::getProduct)
                .toList();
    }
}
