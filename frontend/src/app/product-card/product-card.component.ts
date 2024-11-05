import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { Product } from '../api services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: Product;  // Expecting Product type from parent
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeFromWishlist = new EventEmitter<Product>();

  constructor(private cartService: CartService, private wishlistService: WishlistService) { }

  onAddToCart() {
    this.addToCart.emit(this.product);
    alert(`${this.product.name} has been added to the cart!`);
  }

  onAddToWishlist() {
    this.addToWishlist.emit(this.product);
    alert(`${this.product.name} has been added to the wishlist!`);
  }

  onRemoveFromWishlist() {
    this.removeFromWishlist.emit(this.product);
    alert(`${this.product.name} has been removed from the wishlist!`);
  }
}
