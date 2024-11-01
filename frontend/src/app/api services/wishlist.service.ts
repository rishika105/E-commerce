import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../api services/product.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist: Product[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWishlistFromLocalStorage();
    }
  }

  private loadWishlistFromLocalStorage() {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
    }
  }

  private saveWishlistToLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
  }

  getWishlistItems(): Product[] {
    return [...this.wishlist];
  }

  addToWishlist(product: Product): boolean {
    const exists = this.wishlist.some(item => item.id === product.id);
    if (!exists) {
      this.wishlist.push({...product});
      this.saveWishlistToLocalStorage();
      return true;
    }
    return false;
  }

  removeFromWishlist(productId: number) {
    const initialLength = this.wishlist.length;
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    if (this.wishlist.length !== initialLength) {
      this.saveWishlistToLocalStorage();
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some(item => item.id === productId);
  }
} 