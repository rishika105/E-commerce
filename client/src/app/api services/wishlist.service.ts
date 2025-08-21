import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, first, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /** ✅ Get token from store or localStorage */
  private getAuthToken(): Observable<string> {
    return this.store.select('auth').pipe(
      first(),
      map((authData: any) => {
        return (
          authData?.token ||
          (isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null) ||
          ''
        );
      })
    );
  }

  /** ✅ Toggle wishlist (add/remove) */
  toggleWishlist(productId: number): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<any>(`${this.baseUrl}/wishlist`, { productId }, { headers });
      })
    );
  }

  /** ✅ Get all wishlist items for logged-in user */
  getWishlist(): Observable<any[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<any[]>(`${this.baseUrl}/wishlist`, { headers });  //headers mai backend mai jayega AUTHENTICATION PRINCIPAL
      })
    );
  }
}
