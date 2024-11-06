import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromLocalStorage();
    }
  }

  private loadCartFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
      }
    }
  }

  private saveCartToLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  getCartItems() {
    return [...this.cart]; // Return a copy of the cart array
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
    this.saveCartToLocalStorage();
  }

  updateItemQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = newQuantity;
      this.saveCartToLocalStorage();
    }
  }

  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.saveCartToLocalStorage();
    }
  }

  getTotalPrice(): number {
    return this.cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  getTax(): number {
    const totalPrice = this.getTotalPrice();
    return totalPrice * 0.1;
  }

  getGrandTotal(): number {
    const totalPrice = this.getTotalPrice();
    const tax = this.getTax();
    return totalPrice + tax;
  }
}
