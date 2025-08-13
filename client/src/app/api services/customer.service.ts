import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Customer {
  customerId?: number;
  fullName: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiService.getApiUrl()}/customers`, customer);
  }
}