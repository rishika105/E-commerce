import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromLocalStorage(); // Load cart from localStorage on service initialization
    }
  }

  // Load cart from localStorage
  private loadCartFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
      }
    }
  }

  // Save cart to localStorage
  private saveCartToLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  getCartItems() {
    return this.cart;
  }

  addToCart(item: any) {
    const existingItemIndex = this.cart.findIndex(
      (cartItem) => cartItem.name === item.name
    );
    if (existingItemIndex !== -1) {
      this.cart[existingItemIndex].quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.saveCartToLocalStorage(); // Save updated cart to localStorage
  }

  updateItemQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = newQuantity;
      this.saveCartToLocalStorage(); // Save updated cart to localStorage
    }
  }

  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.saveCartToLocalStorage(); // Save updated cart to localStorage
    }
  }

  getTotalPrice() {
    return this.cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  getTax() {
    return this.getTotalPrice() * 0.1; // 10% tax
  }

  getGrandTotal() {
    return this.getTotalPrice() + this.getTax();
  }
}