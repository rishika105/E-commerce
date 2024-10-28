import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Coupon {
  id?: number;
  couponCode: string;
  discount: number;
  validUntil: string;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  validateCoupon(couponCode: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiService.getApiUrl()}/coupons/${couponCode}`);
  }
}