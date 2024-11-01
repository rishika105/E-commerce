import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../api services/product.service';
import { Product } from '../api services/product.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CategoryService, Category } from '../api services/category.service';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../api services/wishlist.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class CategoryComponent implements OnInit {
  categoryId: number;
  products: Product[] = [];
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    this.categoryId = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      console.log('Category ID from route:', this.categoryId);  // Add this line
      this.loadCategory();
      this.loadProducts();
    });
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (data) => {
        this.category = data;
        console.log('Loaded category:', this.category);  // Add this line
      },
      (error) => {
        console.error('Error loading category:', error);
        this.category = null;  // Add this line
      }
    );
  }

  // Load products by category
  loadProducts(): void {
    this.productService.getProductsByCategory(this.categoryId).subscribe(
      (response: any) => {
        // Extract the 'products' array from the API response
        if (response && response.products) {
          this.products = response.products;
        } else {
          this.products = [];
          console.error('No products found for this category.');
        }
      },
      (error) => {
        // Handle error and display in the console
        console.error('Error loading products:', error);
        this.products = []; // Ensure products array is empty in case of an error
      }
    );
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    // Optional: Add a notification or feedback to user
    console.log('Product added to cart:', product);
  }

  onAddToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
    console.log('Product added to wishlist:', product);
  }

  onRemoveFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id);
    console.log('Product removed from wishlist:', product);
  }
}