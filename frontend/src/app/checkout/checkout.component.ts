import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer } from '../services/customer.service';
import { OrderService, Order, OrderItem } from '../services/order.service';
import { CouponService, Coupon } from '../services/coupon.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  cart: OrderItem[] = [];
  paymentMethod: string = '';
  couponCode: string = '';
  discount: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';
  
  billingDetails: Customer = {
    fullName: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
  };

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    // Fetch cart items from a cart service or local storage
    this.cart = [
      { itemName: 'Product 1', itemPrice: 10, quantity: 2 },
      { itemName: 'Product 2', itemPrice: 15, quantity: 1 },
    ];
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  }

  getGrandTotal(): number {
    return this.getTotal() - this.discount;
  }

  applyCoupon(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.couponService.validateCoupon(this.couponCode).subscribe({
      next: (coupon: Coupon) => {
        this.discount = coupon.discount;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Invalid coupon code';
        this.discount = 0;
        this.isLoading = false;
      }
    });
  }

  placeOrder(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // First, create the customer
    this.customerService.createCustomer(this.billingDetails).subscribe({
      next: (customer: Customer) => {
        // Now create the order
        const order: Order = {
          customerId: customer.customerId!,
          subtotal: this.getTotal(),
          grandTotal: this.getGrandTotal(),
          paymentMethod: this.paymentMethod,
          couponCode: this.couponCode,
          orderDate: new Date().toISOString(),
          orderItems: this.cart
        };

        this.orderService.createOrder(order).subscribe({
          next: (createdOrder: Order) => {
            console.log('Order placed successfully:', createdOrder);
            this.isLoading = false;
            // Redirect to a confirmation page or show a success message
          },
          error: (error) => {
            this.errorMessage = 'Failed to place the order. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to create customer. Please try again.';
        this.isLoading = false;
      }
    });
  }
}