import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { CheckoutComponent } from '../checkout/checkout.component';
import { CartService } from './cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  isCartEmpty = true;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.updateCartState();
  }

  updateCartState() {
    this.cartItems = this.cartService.getCartItems();
    this.isCartEmpty = this.cartItems.length === 0;
  }

  updateQuantity(index: number, change: number) {
    const newQuantity = this.cartItems[index].quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateItemQuantity(index, newQuantity);
      this.updateCartState();
    }
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
    this.toastr.success("Removed from cart");
    this.cartService.removeFromCart(index);
    this.updateCartState();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
