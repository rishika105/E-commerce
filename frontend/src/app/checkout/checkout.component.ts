import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/cart.service';
 import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule,  RouterLink, RouterOutlet], 
  templateUrl: './checkout.component.html',
 
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCartItems(); // Fetch selected cart items
  }

  getTotal(): number {
    return this.cartService.getTotalPrice(); // Total price of cart items
  }

  getGrandTotal(): number {
    return this.cartService.getGrandTotal(); // Grand total with tax or additional costs
  }
}
