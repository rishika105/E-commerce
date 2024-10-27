import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../api services/product.service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-details.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product | null> = of(null);
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');
        if (!productId) {
          throw new Error('Product ID is missing');
        }
        return this.productService.getProductById(+productId);
      }),
      catchError(error => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product. Please try again later.';
        return of(null);
      })
    );
  }
}
