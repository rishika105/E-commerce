import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../api services/product.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CategoryService, Category } from '../api services/category.service';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-category',
  template: `
    <div class="container mx-auto p-4">
      <p class="text-3xl font-medium mb-2" *ngIf="category">Browse {{category.categoryName}}</p>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <app-product-card 
          *ngFor="let product of products; trackBy: trackByProductId" 
          [product]="product"
          (addToCart)="addToCart(product)">
        </app-product-card>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoryId: number = 0;
  products: Product[] = [];
  category: Category | null = null;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      this.loadCategory();
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (data) => {
        this.category = data;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.category = null;
      }
    });
  }

  loadProducts(): void {
    this.productService.getProductsByCategory(this.categoryId).subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.products)) {
          this.products = response.products;
        } else {
          console.error('Invalid products response format:', response);
          this.products = [];
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
      }
    });
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
