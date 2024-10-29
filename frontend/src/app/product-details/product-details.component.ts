// product-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  
})
export class ProductDetailsComponent implements OnInit {
  product: any;

  private products = [
    {
      id: 1,
      name: 'Sample Product',
      description: 'This is a sample product description.',
      specifications: ['Feature 1', 'Feature 2', 'Feature 3'],
      price: 29.99,
      imageUrl: 'https://via.placeholder.com/300'
    },
    // Add more products as needed
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.products.find((p) => p.id === productId);
  }
}
