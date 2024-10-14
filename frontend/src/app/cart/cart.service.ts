import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = '/api/cart'; // Define the base URL for the cart API
  private userId = 1; // Assuming a static user ID for demonstration purposes

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Get all cart items from the backend API
  getCartItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${this.userId}`);
  }

  // Add an item to the cart via API
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, {
      userId: this.userId,
      productId: productId,
      quantity: quantity,
    });
  }

  // Update item quantity via API
  updateItemQuantity(cartId: number, newQuantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update`, { // Changed to '/update'
      userId: this.userId,
      cartId: cartId,
      quantity: newQuantity,
    });
  }

  // Remove an item from the cart via API
  removeFromCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${cartId}`);
  }

  // Calculate the total price of the items in the cart
  getTotalPrice(cartItems: any[]): number {
    return cartItems.reduce(
      (acc, item) => acc + (item.product.price * item.quantity), // Calculate total price
      0
    );
  }

  // Calculate the tax based on the total price
  getTax(totalPrice: number): number {
    return totalPrice * 0.1; // Assuming a 10% tax rate
  }

  // Calculate the grand total (total price + tax)
  getGrandTotal(totalPrice: number, tax: number): number {
    return totalPrice + tax; // Return the sum of total price and tax
  }
}
