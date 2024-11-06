import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../api services/product.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Set<number> = new Set();
  private wishlistProducts = new BehaviorSubject<Product[]>([]);
  private products: Product[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWishlist();
    }
  }

  private saveToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('wishlist', JSON.stringify(Array.from(this.wishlistItems)));
      localStorage.setItem('wishlistProducts', JSON.stringify(this.products));
    }
  }

  addToWishlist(product: Product) {
    if (!this.wishlistItems.has(product.id)) {
      this.wishlistItems.add(product.id);
      this.products.push(product);
      this.wishlistProducts.next([...this.products]);
      this.saveToStorage();
    }
  }

  removeFromWishlist(productId: number) {
    if (this.wishlistItems.has(productId)) {
      this.wishlistItems.delete(productId);
      this.products = this.products.filter(p => p.id !== productId);
      this.wishlistProducts.next([...this.products]);
      this.saveToStorage();
    }
  }

  getWishlist(): Product[] {
    return this.products;
  }

  getWishlistObservable() {
    return this.wishlistProducts.asObservable();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.has(productId);
  }

  loadWishlist() {
    if (isPlatformBrowser(this.platformId)) {
      const savedWishlist = localStorage.getItem('wishlist');
      const savedProducts = localStorage.getItem('wishlistProducts');
      if (savedWishlist && savedProducts) {
        this.wishlistItems = new Set(JSON.parse(savedWishlist));
        this.products = JSON.parse(savedProducts);
        this.wishlistProducts.next([...this.products]);
      }
    }
  }
}