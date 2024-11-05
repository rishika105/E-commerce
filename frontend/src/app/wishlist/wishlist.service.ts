import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: any[] = [];

  addToWishlist(product: any) {
    this.wishlist.push(product);
  }

  getWishlist() {
    return this.wishlist;
  }

  removeFromWishlist(productId: number) {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some(item => item.id === productId);
  }
}
