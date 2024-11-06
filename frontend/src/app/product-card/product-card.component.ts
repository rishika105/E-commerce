<<<<<<< HEAD
import { Input, Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { Product } from '../api services/product.service';
=======
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { Product } from '../api services/product.service';
import { NgIconComponent } from '@ng-icons/core';
>>>>>>> a80e418bbfc9b1934f833a379ec2df98098d8f45

@Component({
  selector: 'app-product-card',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, NgIconComponent],
=======
  imports: [NgIconComponent, CommonModule, RouterLink],
>>>>>>> a80e418bbfc9b1934f833a379ec2df98098d8f45
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeFromWishlist = new EventEmitter<Product>();
  
  isWishlisted: boolean = false;

<<<<<<< HEAD
  isInWishlist = false;

  toggleWishlist(){

=======
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
>>>>>>> a80e418bbfc9b1934f833a379ec2df98098d8f45
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}