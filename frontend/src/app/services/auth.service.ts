import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})

//**********************************************************************/
//*******************API INTEGRATION TO BACKEND*************************/
//**********************************************************************/

export class AuthService {
  private baseUrl = environment.apiUrl;  // Define your API URL in environments file

  constructor(private http: HttpClient) {}

  // Step 1: Send OTP
  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/send-otp`, { email });
  }

  // Step 2: Register user after verifying OTP
  register( name: string, email: string, password: string, confirmPassword: string, role: string, otp: string ): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, {name, email, password, confirmPassword, role, otp});
  }

  // Step 3: Login User and get JWT Token
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

  //Request password reset (send reset link via email)
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password-request`, { email });
  }

  // Reset password with token
  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, { token, password, confirmPassword });
  }
}
