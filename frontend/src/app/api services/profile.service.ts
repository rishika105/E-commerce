import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../environment';
import { map, first, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store<any>) {}

  private getAuthToken(): Observable<string> {
    return this.store.select('auth').pipe(
      first(),
      map((authData) => {
        const token = authData?.token || localStorage.getItem('token') || '';
        console.log('Token from store/localStorage:', token);
        return token;
      })
    );
  }

  getProfile(): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        console.log('Authorization Header:', headers.get('Authorization'));
        return this.http.get<any>(`${this.baseUrl}/profile/getUserDetails`, { headers, withCredentials: true })
          .pipe(
            tap(
              response => console.log('Profile response:', response),
              error => console.error('Profile error:', error)
            )
          );
      })
    );
  }

  updateProfile(profileData: any): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        return this.http.put<any>(`${this.baseUrl}/profile/updateUserDetails`, profileData, { headers, withCredentials: true })
          .pipe(
            tap(
              response => console.log('Update profile response:', response),
              error => console.error('Update profile error:', error)
            )
          );
      })
    );
  }



  deleteProfile(): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
        console.log('Authorization Header:', headers.get('Authorization'));
        return this.http.delete<any>(`${this.baseUrl}/profile/deleteUser`, { headers, withCredentials: true })
          .pipe(
            tap(
              response => console.log('Profile response:', response),
              error => console.error('Profile error:', error)
            )
          );
      })
    );
  }
}
