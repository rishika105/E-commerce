import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-details',
  template: `
    <div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Image Gallery -->
      <div class="space-y-4">
        <img [src]="product.imageUrl" alt="Product Image" class="w-full h-96 object-cover rounded-lg shadow-md" />
        <div class="flex space-x-4">
          <img *ngFor="let image of product.images" [src]="image" alt="Product Thumbnail" 
               class="w-20 h-20 object-cover rounded-md cursor-pointer" />
        </div>
      </div>

      <!-- Product Details -->
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">{{ product.name }}</h2>
        <div class="flex items-center space-x-2 text-gray-500">
          <span>★★★★★</span>
          <span>150 Reviews</span>
          <span class="text-green-600">In Stock</span>
        </div>
        <p class="text-3xl font-bold text-gray-800">{{ product.price | currency: 'USD':'symbol' }}</p>
        <p class="text-gray-600">{{ product.description }}</p>

        <!-- Color Options -->
        <div class="flex items-center space-x-2">
          <span>Colour:</span>
          <div *ngFor="let color of product.colors" [style.background]="color" class="w-6 h-6 rounded-full cursor-pointer"></div>
        </div>

        <!-- Size Options -->
        <div class="flex items-center space-x-2">
          <span>Size:</span>
          <button *ngFor="let size of sizes"
                  class="px-3 py-1 border rounded hover:bg-gray-100"
                  (click)="selectSize(size)">
            {{ size }}
          </button>
        </div>

        <!-- Quantity Selector and Buy Button -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center border rounded">
            <button class="px-2" (click)="decrementQuantity()">-</button>
            <span class="px-4">{{ quantity }}</span>
            <button class="px-2" (click)="incrementQuantity()">+</button>
          </div>
          <button class="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600" (click)="buyNow()">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailsComponent implements OnInit {
  @Input() product!: Product;
  quantity: number = 1;
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];

  ngOnInit(): void {
    // Initialization logic if needed
  }

  selectSize(size: string): void {
    // Handle size selection
    console.log('Selected size:', size);
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    console.log('Buying product:', this.product.name);
  }
}
