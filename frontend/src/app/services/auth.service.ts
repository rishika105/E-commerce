import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;  // Define your API URL in environments file

  constructor(private http: HttpClient) {}

  // Step 1: Send OTP
  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/send-otp`, { email });
  }

  // Step 2: Register user after verifying OTP
  registerUser(userData: { name: string; email: string; password: string; confirmPassword: string; otp: string; role: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  // Step 3: Login User and get JWT Token
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }
}
