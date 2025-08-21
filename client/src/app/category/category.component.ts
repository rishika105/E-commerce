import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category, CategoryService } from '../api services/category.service';
import { Product, ProductService } from '../api services/product.service';
import { ProductCardComponent } from '../products/product-card/product-card.component';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: [],
  standalone: true,
  imports: [CommonModule, ProductCardComponent]
})
export class CategoryComponent implements OnInit {
  categoryId: number = 0;
  products: Product[] = [];
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      this.loadCategory();
      this.loadProducts();
    });
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (data: Category) => {
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
      next: (response: any) => { // Change type to 'any' if response is wrapped in an object
        this.products = response.data; // Extracting the array
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
      }
    });
  }
}
