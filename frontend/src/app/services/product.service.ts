import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = '../../assets/data/data.json';

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((data) => {
        return data.products.filter((product: any) =>
          product.category.toLowerCase() === category.toLowerCase() && !product.deleted
        );
      })
    );
  }
}
