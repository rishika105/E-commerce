import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: {
    categoryId: number;
    categoryName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/allProducts`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/getById/${id}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/createProduct`, product);
  }

  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/updateProduct/${id}`, product);
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/updateStock/${id}?quantity=${quantity}`, {});
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteProduct/${id}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }
}
