import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../environment';
import { map, first, switchMap, tap, catchError } from 'rxjs/operators';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    categoryId: number;
    categoryName: string;
  };
  imageUrl: string;
  user:{
    userId: number;
  } // Add this line to represent the seller
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

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

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.error || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllProducts(): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.get<Product[]>(`${this.apiUrl}/allProducts`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Get all products response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.get<Product>(`${this.apiUrl}/getById/${id}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Get product by ID response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  createProduct(product: FormData): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        // Log the FormData contents for debugging
        console.log('FormData contents:');
        product.forEach((value, key) => {
          console.log(key, value);
        });

        return this.http.post<Product>(`${this.apiUrl}/createProduct`, product, {
          headers,
          withCredentials: true
        }).pipe(
          tap(response => console.log('Create product response:', response)),
          catchError(this.handleError)
        );
      })
    );
  }

  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.put<Product>(`${this.apiUrl}/updateProduct/${id}`, product, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Update product response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.patch<Product>(`${this.apiUrl}/updateStock/${id}?quantity=${quantity}`, {}, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Update stock response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.delete<void>(`${this.apiUrl}/deleteProduct/${id}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Delete product response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${keyword}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Search products response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Get products by category response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }

  getProductsBySeller(userId: number): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = this.getHeaders(token);
        console.log("user id at service: " , userId);
        return this.http.get<Product[]>(`${this.apiUrl}/seller/${userId}`, { headers, withCredentials: true })
          .pipe(
            tap(response => console.log('Get products by seller response:', response)),
            catchError(this.handleError)
          );
      })
    );
  }
}
