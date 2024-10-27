import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../api services/product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly WISHLIST_KEY = 'wishlist';
  private wishlistItems: Map<number, Product> = new Map();
  private wishlistSubject = new BehaviorSubject<Map<number, Product>>(new Map());
  wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    try {
      const savedWishlist = localStorage.getItem(this.WISHLIST_KEY);
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        this.wishlistItems = new Map(parsedWishlist.map((item: Product) => [item.id, item]));
        this.wishlistSubject.next(new Map(this.wishlistItems));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      this.wishlistItems = new Map();
      this.wishlistSubject.next(new Map());
    }
  }

  private saveWishlist(): void {
    try {
      const wishlistArray = Array.from(this.wishlistItems.values());
      localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlistArray));
      this.wishlistSubject.next(new Map(this.wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }

  addToWishlist(product: Product): void {
    if (!this.wishlistItems.has(product.id)) {
      this.wishlistItems.set(product.id, { ...product });
      this.saveWishlist();
    }
  }

  removeFromWishlist(productId: number): void {
    if (this.wishlistItems.has(productId)) {
      this.wishlistItems.delete(productId);
      this.saveWishlist();
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.has(productId);
  }

  getWishlist(): Product[] {
    return Array.from(this.wishlistItems.values());
  }

  clearWishlist(): void {
    this.wishlistItems.clear();
    this.saveWishlist();
  }
}
