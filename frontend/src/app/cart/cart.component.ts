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
  cart: any[] = [];
  couponCode: string = '';

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.cart = this.cartService.getCartItems();
  }

  returnToShop() {
    this.router.navigate(['/category']); // Navigate to category page
  }

  updateCart() {
    this.cartService.saveCartToLocalStorage(); // Save the updated cart
    alert("Cart updated successfully!");

    if (this.couponCode) {
      this.applyCoupon(); // Optionally reapply the coupon
    }
  }

  removeProduct(index: number) {
    this.cartService.removeFromCart(index);
    this.cart = this.cartService.getCartItems(); // Refresh the cart
  }

  applyCoupon() {
    console.log('Applying coupon:', this.couponCode);
    // Add coupon application logic here
  }

  updateQuantity(index: number, change: number) {
    const item = this.cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity > 0) {
      item.quantity = newQuantity;
      this.cartService.updateItemQuantity(index, item.quantity);
    }
  }

  getTotal() {
    return this.cartService.getTotalPrice();
  }

  getGrandTotal() {
    return this.cartService.getGrandTotal();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
