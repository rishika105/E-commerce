import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Product } from '../api services/product.service';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Product[] = [];
  private subscription: Subscription | undefined;

  constructor(private wishlistService: WishlistService) { }

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
  }
}