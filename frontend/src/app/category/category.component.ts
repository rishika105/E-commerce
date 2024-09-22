import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: ``,
  standalone:true,
  imports: [CommonModule]
})
export class CategoryComponent implements OnInit {
  products: any[] = [];
  categoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryName = params['name'];
      this.fetchProductsByCategory();
    });
  }

  fetchProductsByCategory(): void {
    this.productService.getProductsByCategory(this.categoryName).subscribe(
      (products) => {
        this.products = products;
        // console.log('Fetched products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }



}
