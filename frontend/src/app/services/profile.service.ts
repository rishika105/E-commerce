import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileUrl = '/api/profile';

  constructor(private http: HttpClient, private store: Store<any>) {}

  // Get user profile details
  getProfile(): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.profileUrl}/getUserDetails`, { headers });
  }

  // Update user profile
  updateProfile(profileData: any): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.profileUrl}/updateUserDetails`, profileData, { headers });
  }

  // Retrieve JWT token from store or localStorage
  private getAuthToken(): string {
    let token: string = '';

    // Either retrieve from store or localStorage
    this.store.select('auth').subscribe((authData) => {
      token = authData?.token || '';
    });

    if (!token) {
      token = localStorage.getItem('token') || '';
    }

    return token;
  }
}
