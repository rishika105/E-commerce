import { Component, OnInit } from '@angular/core'; // Import necessary Angular core functionalities
import { CartService } from './cart.service'; // Import CartService
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { Router, RouterLink, RouterOutlet } from '@angular/router'; // Import Router for navigation
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html', // Define the template URL
  standalone: true, // Declare this component as a standalone component
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, RouterOutlet, CheckoutComponent], // Include necessary imports
})

export class CartComponent implements OnInit {
removeProduct(_t17: number) {
throw new Error('Method not implemented.');
}
  cart: any[] = [];
  couponCode: string = '';

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.cart = this.cartService.getCartItems();
  }

  updateCart() {
    this.cartService.saveCartToLocalStorage(); // Update and save cart to localStorage
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.cart = this.cartService.getCartItems(); // Refresh the cart
  }

  applyCoupon() {
    // Implement coupon logic here
    console.log('Applying coupon:', this.couponCode);
  }

  updateSubtotal(index: number) {
    const item = this.cart[index];
    this.cartService.updateItemQuantity(index, item.quantity);
  }

  getTotal() {
    return this.cartService.getTotalPrice();
  }

  getTax() {
    return this.cartService.getTax();
  }

  getGrandTotal() {
    return this.cartService.getGrandTotal();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);  // Navigates to the checkout route
  }
}
