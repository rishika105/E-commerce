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
    this.cart = this.cartService.getCartItems();
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
  }

  getGrandTotal(): number {
    const total = this.getTotal();
    return total - this.discount;
  }


  placeOrder(): void {
    if (!this.billingDetails.firstName || !this.billingDetails.streetAddress || 
        !this.billingDetails.city || !this.billingDetails.phone || !this.billingDetails.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const orderDetails = {
      billingDetails: this.billingDetails,
      cart: this.cart,
      paymentMethod: this.paymentMethod,
      totalPrice: this.getGrandTotal(),
      discount: this.discount
    };

    console.log('Order Placed:', orderDetails);
    // Here you would typically send the order to your backend
    alert('Order placed successfully!');
  }
}