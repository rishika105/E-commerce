import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { WishlistService } from '../api services/wishlist.service';
import { Product } from '../api services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    
  `
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe(items => {
      this.wishlistItems = items;
    });
  }
}
