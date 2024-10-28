import { WishlistService } from './wishlist.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../api services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-medium">My Wishlist</h2>
        <button
          *ngIf="wishlistItems.length > 0"
          (click)="clearWishlist()"
          class="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div *ngIf="wishlistItems.length === 0" class="text-center py-8">
        <p class="text-xl text-gray-600">Your wishlist is empty</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <app-product-card
          *ngFor="let product of wishlistItems"
          [product]="product"
        >
        </app-product-card>
      </div>
    </div>
  `
})
export class WishlistComponent {
  wishlistItems: Product[] = [];

  constructor(private wishlistService: WishlistService) {
    this.wishlistService.wishlist$.subscribe(items => {
      // Convert Map to array of products
      this.wishlistItems = Array.from(items.values());
    });
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
  }
}

