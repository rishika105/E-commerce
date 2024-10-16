import { CommonModule } from '@angular/common'; // Import CommonModule for pipes
import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service'; // Import CartService
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartComponent } from "../cart/cart.component"; // Import RouterLink and RouterOutlet

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CartComponent], // Include necessary imports
  templateUrl: './category.component.html',
  providers: [CartService]  // Provide the service locally for this component
})

export class CategoryComponent {
  products = [
    { id: 1, name: 'Gaming Mouse', price: 49.99 }, // Add id property
    { id: 2, name: 'Mechanical Keyboard', price: 89.99 }, // Add id property
    { id: 3, name: 'Gaming Headset', price: 59.99 }, // Add id property
  ];

  userId: number = 1; // Example user ID
  quantity: number = 1; // Default quantity

  constructor(private cartService: CartService) { }

  addToCart(product: any) {
    const productId = product.id; // Extract productId from the product object
    this.cartService.addToCart(this.userId, productId, this.quantity).subscribe({
      next: (response) => {
        alert(`${product.name} has been added to the cart!`);
        console.log('Product added to cart successfully!', response);
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      },
    });
  }
}
