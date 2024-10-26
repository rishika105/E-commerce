import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { Product } from '../api services/product.service';
import { WishlistService } from '../wishlist/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent],
  templateUrl: './product-card.component.html',
  styles: ``,
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  isInWishlist: boolean = false;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.checkWishlistStatus();
  }

  checkWishlistStatus(): void {
    this.isInWishlist = this.wishlistService.isInWishlist(this.product.id);
  }

  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
    this.isInWishlist = !this.isInWishlist;
  }
}
