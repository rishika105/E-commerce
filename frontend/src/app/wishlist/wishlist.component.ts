import { Component, OnInit } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',

})

export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(private wishlistService: WishlistService) { }

  ngOnInit() {
    this.wishlistItems = this.wishlistService.getWishlist();
  }

  removeFromWishlist(product: any) {
    this.wishlistService.removeFromWishlist(product);
    this.wishlistItems = this.wishlistService.getWishlist(); // Refresh the list
  }
}
