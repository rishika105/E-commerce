import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from './wishlist.service';
import { Product } from '../api services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Subscription } from 'rxjs';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, NgIconComponent],
  templateUrl: './wishlist.component.html',
  styles: [`
    .empty-state {
      min-height: 400px;
    }

    .browse-btn {
      transition: all 0.2s ease-in-out;
    }

    .browse-btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: Product[] = [];
  isLoading: boolean = true;
  private wishlistSubscription: Subscription | undefined;

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistSubscription = this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
