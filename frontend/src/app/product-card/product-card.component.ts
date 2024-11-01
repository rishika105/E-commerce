import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../api services/product.service';
import { WishlistService } from '../api services/wishlist.service';
import { ToastService } from '../api services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="border rounded-lg shadow-xl p-4 relative group cursor-pointer hover:shadow-2xl transition-shadow">
      <!-- Wishlist Heart Icon -->
      <button 
        (click)="toggleWishlist($event)"
        class="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          [class.text-red-500]="isInWishlist"
          [class.text-gray-400]="!isInWishlist"
          class="h-6 w-6 transition-colors duration-200"
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>

      <div [routerLink]="['/product-details', product.id]">
        <img
          [src]="product.imageUrl"
          [alt]="product.name"
          class="w-full h-48 object-cover mb-4 rounded-md"
          onerror="this.src='assets/placeholder.png'"
        />
        <p class="text-xl font-medium mb-2 text-gray-600">{{ product.name }}</p>
        <p class="text-gray-600 mb-2">{{ product.description | slice:0:100 }}...</p>
        <p class="font-medium mb-2">₹{{ product.price.toFixed(2) }}</p>
        <p class="mb-2 font-normal text-sm text-green-600">Free Delivery</p>
      </div>
      
      <button 
        (click)="onAddToCart($event)"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        [disabled]="product.stock <= 0"
      >
        {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
      </button>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeFromWishlist = new EventEmitter<Product>();

  isInWishlist: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
  }

  toggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
      this.removeFromWishlist.emit(this.product);
      this.toastService.show('Removed from wishlist');
    } else {
      const added = this.wishlistService.addToWishlist(this.product);
      if (added) {
        this.addToWishlist.emit(this.product);
        this.toastService.show('Added to wishlist');
      }
    }
    this.isInWishlist = !this.isInWishlist;
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}