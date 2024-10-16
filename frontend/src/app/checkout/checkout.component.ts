import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  userId = 1; // Example userId, replace with actual logged-in user ID
  totalPrice: number = 0;
  grandTotal: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // Fetch cart items for the user
    this.cartService.getCartItems(this.userId).subscribe({
      next: (data) => {
        this.cart = data; // Store the cart items
        this.totalPrice = this.cartService.calculateTotalPrice(this.cart); // Calculate the total price
        this.grandTotal = this.cartService.calculateGrandTotal(this.cart); // Calculate grand total with tax
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      }
    });
  }

  getTotal(): number {
    return this.totalPrice; // Return the total price
  }

  getGrandTotal(): number {
    return this.grandTotal; // Return the grand total (with tax)
  }
}
