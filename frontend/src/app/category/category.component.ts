import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, CategoryService } from '../api services/category.service';
import { Product, ProductService } from '../api services/product.service';
import { CartService } from '../cart/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../wishlist/wishlist.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class CategoryComponent implements OnInit {
  categoryId: number = 0;
  products: Product[] = [];
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters and fetch category and products data
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      console.log('Category ID from route:', this.categoryId);  // Log for debugging
      this.loadCategory();  // Load category first
      this.loadProducts();   // Then load products
    });
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (data: Category) => {
        this.category = data;
        console.log('Loaded category:', this.category);  // Log loaded category
      },
      (error) => {
        console.error('Error loading category:', error);
        this.category = null;  // Set to null on error
      }
    );
  }

  loadProducts(): void {
    this.productService.getProductsByCategory(this.categoryId).subscribe(
      (products: Product[]) => {
        this.products = products;
        if (this.products.length === 0) {
          console.warn('No products found for this category.');
        }
      },
      (error) => {
        console.error('Error loading products:', error);
        this.products = []; // Clear products on error
      }
    );
  }
  
  

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log('Product added to cart:', product);
  }

  onAddToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
    console.log('Product added to wishlist:', product);
  }

  onRemoveFromWishlist(product: Product): void {
    // Directly remove from wishlist by ID and log result
    this.wishlistService.removeFromWishlist(product.id);
    console.log('Product removed from wishlist:', product);
  }
}
