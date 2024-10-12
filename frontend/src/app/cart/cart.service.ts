import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() { }

  // Method to get all cart items
  getCartItems() {
    return this.cart;
  }

  // Method to add a product to the cart
  addToCart(item: any) {
    if (item && item.price > 0) {
      // Check if the item already exists in the cart
      const existingItemIndex = this.cart.findIndex(cartItem => cartItem.name === item.name);
      if (existingItemIndex !== -1) {
        // If it exists, increase the quantity
        this.cart[existingItemIndex].quantity += 1;
      } else {
        // If not, add a new item with quantity set to 1
        this.cart.push({ ...item, quantity: 1 });
      }
    } else {
      console.error(`Invalid item: ${JSON.stringify(item)}`);
    }
  }

  // New method to update item quantity
  updateItemQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0 && index >= 0 && index < this.cart.length) {
      this.cart[index].quantity = newQuantity;
    } else {
      console.error(`Invalid quantity or index: Quantity=${newQuantity}, Index=${index}`);
    }
  }

  // Method to remove an item from the cart by index
  removeFromCart(index: number) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
    } else {
      console.error(`Invalid index: ${index}`);
    }
  }

  // Method to calculate the total price of the cart
  getTotalPrice() {
    return this.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}
