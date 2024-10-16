import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API calls
import { Observable } from 'rxjs'; // Import Observable to handle HTTP responses

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart'; // Base URL of your Spring Boot backend

  constructor(private http: HttpClient) {}

  // 1. Get all cart items for a specific user
  getCartItems(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 2. Add item to the cart
  addToCart(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, productId, quantity });
  }

  // 3. Update item quantity in the cart
  updateItemQuantity(cartId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { cartId, quantity });
  }

  // 4. Remove an item from the cart
  removeFromCart(cartId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${cartId}`);
  }

  // 5. Get total price of the cart for a specific user (from backend)
  getTotalPrice(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${userId}`);
  }

  // 6. Calculate total price on the frontend (if needed)
  calculateTotalPrice(cartItems: any[]): number {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // 7. Calculate grand total (with optional tax or additional costs)
  calculateGrandTotal(cartItems: any[], tax: number = 0.1): number {
    const total = this.calculateTotalPrice(cartItems);
    return total + total * tax; // Adding tax or additional costs
  }
}
