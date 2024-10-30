import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartService } from './cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [
    NgIconComponent,
    RouterLink,
    RouterOutlet,
    CheckoutComponent,
    FormsModule,
    CommonModule,
  ],
})
export class CartComponent implements OnInit {
updateQuantity(_t16: number,arg1: number) {
throw new Error('Method not implemented.');
}
updateCart() {
throw new Error('Method not implemented.');
}
  cartItems: any[] = [];
  couponCode: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getGrandTotal(): number {
    return this.cartService.getGrandTotal();
  }

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
  }

  returnToShop() {
    this.router.navigate(['/category']); // Adjust this route as needed
  }

  applyCoupon() {
    // Implement coupon logic
  }

  goToCheckout() {
    this.router.navigate(['/checkout']); // Adjust this route as needed
  }
}