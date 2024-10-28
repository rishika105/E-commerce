import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../api services/product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Product[] = [];
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    // Load wishlist from localStorage on service initialization
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlistItems);
    }
  }

  getWishlist(): Observable<Product[]> {
    return this.wishlistSubject.asObservable();
  }

  addToWishlist(product: Product): void {
    if (!this.wishlistItems.some(item => item.id === product.id)) {
      this.wishlistItems = [...this.wishlistItems, product];
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
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }
}