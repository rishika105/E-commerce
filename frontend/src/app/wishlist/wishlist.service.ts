import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../api services/product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlist';
  private wishlistItems: Product[] = [];
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    this.loadWishlistFromLocalStorage();
  }

  private loadWishlistFromLocalStorage(): void {
    try {
      const storedWishlist = localStorage.getItem(this.STORAGE_KEY);
      if (storedWishlist) {
        this.wishlistItems = JSON.parse(storedWishlist);
        this.wishlistSubject.next([...this.wishlistItems]);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      this.wishlistItems = [];
      this.wishlistSubject.next([]);
    }
  }

  private saveWishlistToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }

  getWishlist(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(product: Product): void {
    if (!this.isInWishlist(product.id)) {
      this.wishlistItems = [...this.wishlistItems, { ...product }];
      this.updateWishlist();
    }
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.updateWishlist();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  private updateWishlist(): void {
    this.wishlistSubject.next([...this.wishlistItems]);
    this.saveWishlistToLocalStorage();
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.updateWishlist();
  }
}
