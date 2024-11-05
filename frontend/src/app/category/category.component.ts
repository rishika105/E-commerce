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
  styles: [],
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
    this.wishlistService.loadWishlist();
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      this.loadCategory();
      this.loadProducts();
    });
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (data: Category) => {
        this.category = data;
      },
      (error) => {
        console.error('Error loading category:', error);
        this.category = null;
      }
    );
  }

  loadProducts(): void {
    this.productService.getProductsByCategory(this.categoryId).subscribe(
      (response: any) => {
        if (response && response.products) {
          this.products = response.products;
        } else {
          this.products = [];
          console.error('No products found for this category.');
        }
      },
      (error) => {
        console.error('Error loading products:', error);
        this.products = [];
      }
    );
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  onAddToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
  }

  onRemoveFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id);
  }
}