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
  saveCartToLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  // Get all cart items
  getCartItems() {
    return this.cart;
  }

  // Add an item to the cart
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

  // Update item quantity in the cart
  updateItemQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = newQuantity;
      this.saveCartToLocalStorage(); // Save updated cart to localStorage
    }
  }

  // Remove item from the cart
  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.saveCartToLocalStorage(); // Save updated cart to localStorage
    }
  }

  // Get the total price of the cart items
  getTotalPrice(): number {
    return this.cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }

  // Get the tax amount (example 10% tax rate)
  getTax(): number {
    const totalPrice = this.getTotalPrice();
    return totalPrice * 0.1; // Assuming a 10% tax
  }

  // Get the grand total (total price + tax)
  getGrandTotal(): number {
    const totalPrice = this.getTotalPrice();
    const tax = this.getTax();
    return totalPrice + tax;
  }
}
