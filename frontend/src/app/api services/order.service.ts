import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Order {
  orderId?: number;
  customerId: number;
  subtotal: number;
  grandTotal: number;
  paymentMethod: string;
  couponCode?: string;
  orderDate: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  orderItemId?: number;
  itemName: string;
  itemPrice: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiService.getApiUrl()}/orders`, order);
  }
}