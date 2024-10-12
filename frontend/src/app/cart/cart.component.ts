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
  cart: any[] = []; // Initialize the cart array

  constructor(private cartService: CartService) { }

  ngOnInit() {
    // Fetch the cart items from the service when the component initializes
    this.cart = this.cartService.getCartItems();
  }

  // Update the subtotal based on the updated quantity
  updateSubtotal(index: number) {
    const item = this.cart[index];
    this.cartService.updateItemQuantity(index, item.quantity);
  }

  // Calculate and return the total price
  getTotal() {
    return this.cartService.getTotalPrice();
  }

  // Remove an item from the cart
  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
    this.cart = this.cartService.getCartItems(); // Update the cart array after removal
  }
}
