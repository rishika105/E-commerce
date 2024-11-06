import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { Product } from '../api services/product.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIconComponent, CommonModule, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeFromWishlist = new EventEmitter<Product>();
  
  isWishlisted: boolean = false;

  constructor(
    private cartService: CartService, 
    private wishlistService: WishlistService
  ) { }

  ngOnInit() {
    this.isWishlisted = this.wishlistService.isInWishlist(this.product.id);
    this.wishlistService.getWishlistObservable().subscribe(() => {
      this.isWishlisted = this.wishlistService.isInWishlist(this.product.id);
    });
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product.id);
      this.removeFromWishlist.emit(this.product);
    } else {
      this.wishlistService.addToWishlist(this.product);
      this.addToWishlist.emit(this.product);
    }
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}