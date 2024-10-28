import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule], 
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  paymentMethod: string = '';
  couponCode: string = '';
  discount: number = 0;
  
  billingDetails = {
    firstName: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
    saveInfo: false
  };

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCartItems(); // Fetch selected cart items
  }

  getTotal(): number {
    return this.cartService.getTotalPrice(); // Total price of cart items
  }

  getGrandTotal(): number {
    const total = this.getTotal();
    return total - this.discount; // Grand total with discount applied
  }

  applyCoupon(): void {
    if (this.couponCode === 'DISCOUNT10') {
      this.discount = this.getTotal() * 0.1; // Apply a 10% discount
    } else {
      this.discount = 0; // No discount
    }
  }

  placeOrder(): void {
    const orderDetails = {
      billingDetails: this.billingDetails,
      cart: this.cart,
      paymentMethod: this.paymentMethod,
      totalPrice: this.getGrandTotal(),
    };

    console.log('Order Placed:', orderDetails);
    // Send order details to the server here using a service (e.g., orderService.placeOrder(orderDetails))
  }
}