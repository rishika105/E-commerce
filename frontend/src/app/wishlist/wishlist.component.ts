import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Product } from '../api services/product.service';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterLink,],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Product[] = [];
  private subscription: Subscription | undefined;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.subscription = this.wishlistService.getWishlistObservable()
      .subscribe(items => {
        this.wishlistItems = items;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId);
    this.toastr.success("Removed From Wishlist");
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastr.success("Added to Cart");
  }
}
