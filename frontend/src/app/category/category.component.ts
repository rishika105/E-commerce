import { CommonModule } from '@angular/common'; // Import CommonModule for pipes
import { Component } from '@angular/core';
import { CartComponent } from '../cart/cart.component'; // Import CartComponent
import { CartService } from '../cart/cart.service'; // Import CartService
import { RouterLink, RouterOutlet } from '@angular/router'; // Import RouterLink and RouterOutlet

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CartComponent, RouterLink, RouterOutlet], // Include necessary imports
  templateUrl: './category.component.html',
  providers: [CartService]  // Provide the service locally for this component
})

export class CategoryComponent {
  products = [
    { name: 'Gaming Mouse', price: 49.99 },
    { name: 'Mechanical Keyboard', price: 89.99 },
    { name: 'Gaming Headset', price: 59.99 },
  ];

  constructor(private cartService: CartService) { }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`); // Corrected syntax
  }
  
}