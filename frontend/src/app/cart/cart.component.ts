import { CommonModule } from '@angular/common'; // Import CommonModule for common directives
import { Component, OnInit } from '@angular/core'; // Import necessary Angular core functionalities
import { CartService } from './cart.service'; // Import CartService
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { NgIconComponent } from '@ng-icons/core'; // Import NgIconComponent for icons
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CheckoutComponent } from "../checkout/checkout.component"; // Import RouterLink and RouterOutlet for routing

@Component({
  selector: 'app-cart',
  standalone: true, // Declare this component as a standalone component
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, RouterOutlet, CheckoutComponent], // Include necessary imports
  templateUrl: './cart.component.html', // Define the template URL
})

export class CartComponent implements OnInit {
getGrandTotal: any;
getTax(): string|number {
throw new Error('Method not implemented.');
}
getTotal(): string|number {
throw new Error('Method not implemented.');
}
  cart: any[] = [];
  totalPrice: number = 0;
  grandTotal: number = 0;
  tax: number = 0;

  constructor(
    private cartService: CartService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  // Load cart items from the backend API
  loadCartItems() {
    this.cartService.getCartItems().subscribe(
      (items) => {
        this.cart = items; // Assign the loaded items to the cart
        this.calculateTotals(); // Calculate totals after loading items
      },
      (error) => {
        console.error('Error loading cart items', error);
      }
    );
  }

  // Update subtotal (quantity) for a cart item
  updateSubtotal(index: number) {
    const item = this.cart[index];
    if (item.quantity > 0) {
      this.cartService.updateItemQuantity(item.cartId, item.quantity).subscribe(() => {
        this.loadCartItems();  // Reload cart after updating
      });
    }
  }

  // Remove an item from the cart
  removeFromCart(index: number) {
    const cartItemId = this.cart[index].cartId;
    this.cartService.removeFromCart(cartItemId).subscribe(() => {
      this.loadCartItems();  // Reload cart after removing
    });
  }

  // Calculate the totals
  calculateTotals(): void {
    this.totalPrice = this.cartService.getTotalPrice(this.cart); // Pass the cart to get the total price
    this.tax = this.cartService.getTax(this.totalPrice); // Pass totalPrice to get the tax
    this.grandTotal = this.cartService.getGrandTotal(this.totalPrice, this.tax); // Pass totalPrice and tax to get the grand total
  }

  // Navigate to the checkout page
  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
