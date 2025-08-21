package com.ecom.models;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // Primary key for each wishlist entry

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;   // Who added to wishlist

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;   // Which product is in wishlist

    // Constructors
    public Wishlist() {}

    public Wishlist(User user, Product product) {
        this.user = user;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
