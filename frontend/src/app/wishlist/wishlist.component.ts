import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../api services/wishlist.service';
import { Product } from '../api services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './wishlist.component.html',

})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadWishlistItems();
  }

  loadWishlistItems() {
    this.wishlistItems = this.wishlistService.getWishlistItems();
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  onRemoveFromWishlist(product: Product) {
    this.wishlistService.removeFromWishlist(product.id);
    this.loadWishlistItems();
  }
}
