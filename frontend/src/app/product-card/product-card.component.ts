import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHeart } from '@ng-icons/heroicons/outline';
import { heroHeartSolid } from '@ng-icons/heroicons/solid';
import { Product } from '../api services/product.service';
import { WishlistService } from '../wishlist/wishlist.service';

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
          [name]="isProductInWishlist(product.id) ? 'heroHeartSolid' : 'heroHeart'"
          [class]="isProductInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'"
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
    </div>
  `,
  providers: [
    provideIcons({ heroHeart, heroHeartSolid })
  ]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    // No need to subscribe here anymore
  }

  isProductInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const productId = this.product.id;

    if (this.isProductInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId);
    } else {
      this.wishlistService.addToWishlist({ ...this.product });
    }
  }
}
