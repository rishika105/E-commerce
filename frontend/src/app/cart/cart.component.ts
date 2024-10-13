import { CommonModule } from '@angular/common'; // Import CommonModule for common directives
import { Component, OnInit } from '@angular/core'; // Import necessary Angular core functionalities
import { CartService } from './cart.service'; // Import CartService
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { NgIconComponent } from '@ng-icons/core'; // Import NgIconComponent for icons
import { RouterLink, RouterOutlet } from '@angular/router'; // Import RouterLink and RouterOutlet for routing

@Component({
  selector: 'app-cart',
  standalone: true, // Declare this component as a standalone component
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, RouterOutlet], // Include necessary imports
  templateUrl: './cart.component.html', // Define the template URL
})

export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cart = this.cartService.getCartItems();
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

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
    this.cart = this.cartService.getCartItems();
  }
}
