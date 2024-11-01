import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Product, ProductService } from '../api services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product | null>;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    // Initialize the product$ observable in the constructor
    this.product$ = this.route.params.pipe(
      switchMap(params => {
        const id = +params['id']; // Convert id to number
        return this.productService.getProductById(id).pipe(
          catchError(error => {
            this.error = error.message;
            return of(null);
          })
        );
      })
    );
  }

  ngOnInit(): void {
    // The product loading is handled by the product$ observable
  }

  addToCart(product: Product): void {
    // Implement cart functionality here
    console.log('Adding to cart:', product);
  }
}