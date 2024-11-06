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
  cartItems: any[] = [];
  showCheckout = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
  }

  updateQuantity(index: number, change: number) {
    const newQuantity = this.cartItems[index].quantity + change;
    if (newQuantity > 0) {
      this.cartItems[index].quantity = newQuantity;
      // Don't update the service yet - wait for Update Cart button
    }
  }

  updateCart() {
    this.cartItems.forEach((item, index) => {
      this.cartService.updateItemQuantity(index, item.quantity);
    });
    this.cartItems = this.cartService.getCartItems(); // Refresh cart items
    this.cartService.saveCartToLocalStorage(); // Save updated cart to localStorage
  }

  returnToShop() {
    this.router.navigate(['/home']);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getGrandTotal(): number {
    return this.cartService.getGrandTotal();
  }

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
    this.cartItems = this.cartService.getCartItems(); // Refresh cart items
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}