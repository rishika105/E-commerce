import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.fetchProductDetails();
  }

  async fetchProductDetails() {
    try {
      this.product = await this.productService.fetchProducts();
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }
}
