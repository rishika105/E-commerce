
export { Product };

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, first, switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environment';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private store: Store<any>) {}

  private getAuthToken(): Observable<string> {
    return this.store.select('auth').pipe(
      first(),
      map((authData) => authData?.token || localStorage.getItem('token') || '')
    );
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Fetch all products
  getAllProducts(): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.get<Product[]>(`${this.apiUrl}/allProducts`, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Fetched products:', response)),
      catchError(this.handleError)
    );
  }

  // Fetch a product by ID
  getProductById(id: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.get<Product>(`${this.apiUrl}/getById/${id}`, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Fetched product by ID:', response)),
      catchError(this.handleError)
    );
  }

  // Fetch product details including related items
  getProductDetails(productId: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.get<Product>(`${this.apiUrl}/${productId}`, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Fetched product details:', response)),
      catchError(this.handleError)
    );
  }

  // Create a new product
  createProduct(product: FormData): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.post<Product>(`${this.apiUrl}/createProduct`, product, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Created product:', response)),
      catchError(this.handleError)
    );
  }

  // Update a product
  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.put<Product>(`${this.apiUrl}/updateProduct/${id}`, product, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Updated product:', response)),
      catchError(this.handleError)
    );
  }

  // Update stock for a product
  updateStock(id: number, quantity: number): Observable<Product> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.patch<Product>(`${this.apiUrl}/updateStock/${id}?quantity=${quantity}`, {}, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Updated stock:', response)),
      catchError(this.handleError)
    );
  }

  // Delete a product
  deleteProduct(id: number): Observable<void> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.delete<void>(`${this.apiUrl}/deleteProduct/${id}`, { headers: this.getHeaders(token), withCredentials: true })),
      tap(() => console.log(`Deleted product with ID ${id}`)),
      catchError(this.handleError)
    );
  }

  // Search for products by keyword
  searchProducts(keyword: string): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${keyword}`, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Search results:', response)),
      catchError(this.handleError)
    );
  }

  // Fetch products by category
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getAuthToken().pipe(
      switchMap((token) => this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, { headers: this.getHeaders(token), withCredentials: true })),
      tap(response => console.log('Fetched products by category:', response)),
      catchError(this.handleError)
    );
  }
}
