import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIconComponent,
    RouterLink,
    RouterOutlet,
    CheckoutComponent
  ],
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  couponCode: string = '';

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.cart = this.cartService.getCartItems();
  }

  returnToShop() {
    this.router.navigate(['/category']);
  }

  updateCart() {
    this.cartService.saveCartToLocalStorage();
    alert("Cart updated successfully!");

    if (this.couponCode) {
      this.applyCoupon();
    }
  }

  removeProduct(index: number) {
    this.cartService.removeFromCart(index);
    this.cart = this.cartService.getCartItems();
  }

  applyCoupon() {
    console.log('Applying coupon:', this.couponCode);
    // Implement coupon logic here
  }

  updateQuantity(index: number, change: number) {
    const item = this.cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity > 0) {
      item.quantity = newQuantity;
      this.cartService.updateItemQuantity(index, newQuantity);
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