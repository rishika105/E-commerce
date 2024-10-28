import { setToken } from '../ngrx store/auth/auth.action';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';  // Ensure this import is correct
import { environment } from '../../../environment'; // Your environment configuration

@Injectable({
  providedIn: 'root'
})

//**********************************************************************/
//*******************API INTEGRATION TO BACKEND*************************/
//**********************************************************************/

export class AuthService {
  private baseUrl = environment.apiUrl;  // Define your API URL in environments file

  constructor(
    private http: HttpClient,
    private store: Store  // Injecting Store to dispatch actions
  ) {}

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
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Store the token in localStorage
            localStorage.setItem('token', response.token);
            // Dispatch an action to update the store
            this.store.dispatch(setToken({ token: response.token }));  // Dispatch the setToken action
          }
        })
      );
  }

  // Step 4: Request password reset (send reset link via email)
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password-request`, { email });
  }

  // Step 5: Reset password with token
  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/reset-password`, { token, password, confirmPassword });
  }
}
