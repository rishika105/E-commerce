import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { Product } from '../api services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div 
      class="border rounded-lg shadow-xl p-4 relative group cursor-pointer hover:shadow-2xl transition-shadow" 
      [routerLink]="['/product-details', product.id]"
    >
      <img
        [src]="product.imageUrl"
        [alt]="product.name"
        class="w-full h-48 object-cover mb-4 rounded-md"
        onerror="this.src='assets/placeholder.png'"
      />
      <p class="text-xl font-medium mb-2 text-gray-600">{{ product.name }}</p>
      <p class="text-gray-600 mb-2">{{ product.description | slice:0:100 }}...</p>
      <p class="font-medium mb-2">₹{{ product.price.toFixed(2) }}</p>
      <p class="mb-2 font-normal text-sm text-green-600">Free Delivery</p>
    </div>
  `,
  providers: []
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  constructor() {}

  ngOnInit(): void {}

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}