import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core'; // Add EventEmitter here
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHeart } from '@ng-icons/heroicons/outline';
import { heroHeartSolid } from '@ng-icons/heroicons/solid';
import { Product } from '../api services/product.service';
import { WishlistService } from '../api services/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  template: `
    <div class="border rounded-lg shadow-xl p-4 relative group">
      <button
        (click)="toggleWishlist($event)"
        class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
        [attr.data-product-id]="product.id"
      >
        <ng-icon
          [name]="inWishlist ? 'heroHeartSolid' : 'heroHeart'"
          [class]="inWishlist ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'"
          class="w-6 h-6 transition-colors duration-200"
        >
        </ng-icon>
      </button>

      <img
        [src]="product.imageUrl"
        [alt]="product.name"
        class="w-full h-48 object-cover mb-4 rounded-md"
        onerror="this.src='assets/placeholder.png'"
      />

      <p class="text-xl font-medium mb-2 text-gray-600">{{ product.name }}</p>
      <p class="text-gray-600 mb-2">{{ product.description | slice:0:100 }}...</p>
      <p class="font-medium mb-2">₹ {{ product.price.toFixed(2) }}</p>
      <p class="mb-2 font-normal text-sm text-green-600">Free Delivery</p>

      <!-- Add to Cart Button -->
      <button (click)="onAddToCart()">Add to Cart</button>
    </div>
  `,
  providers: [
    provideIcons({ heroHeart, heroHeartSolid })
  ]
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>(); // Ensure EventEmitter is properly imported
  inWishlist: boolean = false;
  private wishlistSubscription?: Subscription;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    // Initialize the wishlist state for this specific product
    this.inWishlist = this.wishlistService.isInWishlist(this.product.id);
    
    // Subscribe to wishlist changes to update this product's state
    this.wishlistSubscription = this.wishlistService.getWishlist().subscribe(items => {
      this.inWishlist = items.some(item => item.id === this.product.id);
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.inWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist({ ...this.product });
    }
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}