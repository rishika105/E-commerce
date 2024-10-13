import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() { }

  getCartItems() {
    return this.cart;
  }

  addToCart(item: any) {
    const existingItemIndex = this.cart.findIndex(cartItem => cartItem.name === item.name);
    if (existingItemIndex !== -1) {
      this.cart[existingItemIndex].quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
  }

  updateItemQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = newQuantity;
    }
  }

  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
    }
  }

  getTotalPrice() {
    return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  getTax() {
    return this.getTotalPrice() * 0.1;  // 10% tax
  }

  getGrandTotal() {
    return this.getTotalPrice() + this.getTax();
  }
}
