import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, RouterOutlet],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  userId: number = 1; // Example user ID
  taxRate: number = 0.1; // 10% tax
  loading: boolean = false; // Loading state
  errorMessage: string = ''; // Error message
  total: any;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.loadCartItems();
  }

  // Load cart items from API
  loadCartItems() {
    this.loading = true;
    this.cartService.getCartItems(this.userId).subscribe({
      next: (items) => {
        this.cart = items;
        this.calculateTotals();
        this.loading = false; // End loading
      },
      error: (err) => {
        console.error('Error loading cart items:', err);
        this.errorMessage = 'Failed to load cart items. Please try again later.';
        this.loading = false; // End loading
      },
    });
  }

  // Increment quantity
  incrementQuantity(index: number) {
    this.cart[index].quantity++;
    this.updateSubtotal(index);
  }

  // Decrement quantity
  decrementQuantity(index: number) {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
      this.updateSubtotal(index);
    }
  }

  // Update subtotal and recalculate totals
  updateSubtotal(index: number) {
    const item = this.cart[index];
    this.cartService.updateItemQuantity(item.cartId, item.quantity).subscribe({
      next: () => {
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Error updating item quantity:', err);
        this.errorMessage = 'Failed to update item quantity. Please try again.';
      },
    });
  }

  // Calculate subtotal and total
  calculateTotals() {
    const total = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.total = total;
  }

  // Get total price
  getTotal() {
    return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  // Calculate tax
  getTax() {
    return this.getTotal() * this.taxRate;
  }

  // Get grand total (subtotal + tax)
  getGrandTotal() {
    return this.getTotal() + this.getTax();
  }

  // Navigate to checkout
  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
