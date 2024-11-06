import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environment';

export interface Product {
  images: any;
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: {
    categoryId: number;
    name: string;
  };
  imageUrl: string;
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
      map(authData => authData?.token || localStorage.getItem('token') || ''),
      tap(token => console.log('Token from store/localStorage:', token))
    );
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Error Code: ${error.status}\nMessage: ${error.error?.error || error.message}`;
      
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllProducts(): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.get<Product[]>(`${this.apiUrl}/allProducts`, {
        headers: this.getHeaders(token),
        withCredentials: true
      }).pipe(
        tap(response => console.log('Get all products response:', response)),
        catchError(this.handleError)
      ))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.get<Product>(`${this.apiUrl}/getById/${id}`, {
        headers: this.getHeaders(token),
        withCredentials: true
      }).pipe(
        tap(response => console.log('Get product by ID response:', response)),
        catchError(this.handleError)
      ))
    );
  }

  createProduct(product: FormData): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.post<Product>(`${this.apiUrl}/createProduct`, product, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        withCredentials: true
      }).pipe(
        tap(response => console.log('Create product response:', response)),
        catchError(this.handleError)
      ))
    );
  }

  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.put<Product>(`${this.apiUrl}/updateProduct/${id}`, product, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        withCredentials: true
      }).pipe(
        tap(response => console.log('Update product response:', response)),
        catchError(this.handleError)
      ))
    );
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.patch<Product>(`${this.apiUrl}/updateStock/${id}`, {}, {
        headers: this.getHeaders(token),
        params: { quantity: quantity.toString() },
        withCredentials: true
      }).pipe(
        tap(response => console.log('Update stock response:', response)),
        catchError(this.handleError)
      ))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.delete<void>(`${this.apiUrl}/deleteProduct/${id}`, {
        headers: this.getHeaders(token),
        withCredentials: true
      }).pipe(
        tap(() => console.log('Deleted product with ID:', id)),
        catchError(this.handleError)
      ))
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.get<Product[]>(`${this.apiUrl}/search`, {
        headers: this.getHeaders(token),
        params: { keyword },
        withCredentials: true
      }).pipe(
        tap(response => console.log('Search products response:', response)),
        catchError(this.handleError)
      ))
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap(token => this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, {
        headers: this.getHeaders(token),
        withCredentials: true
      }).pipe(
        tap(response => console.log('Get products by category response:', response)),
        catchError(this.handleError)
      ))
    );
  }
}
