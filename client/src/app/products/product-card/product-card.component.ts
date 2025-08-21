import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../api services/product.service';
import { NgIconComponent } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../api services/auth.service';
import { Store } from '@ngrx/store';
import { WishlistService } from '../../api services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIconComponent, CommonModule, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  isLoggedIn: boolean = false;
  userRole: string = 'USER'; // default role is USER
  isWishlisted = false; // Fixed variable name to match template

  constructor(
    private store: Store<{ auth: any }>, // Inject the store to access the auth state
    private toastr: ToastrService,
    private wishlistService: WishlistService,
  ) {
    // Subscribe to the auth state to check if user is logged in
    this.store.select('auth').subscribe(authState => {
      this.isLoggedIn = !!authState.token; // If token exists, user is logged in
      this.userRole = authState.role || 'USER'; // Get the role from the state

      // Check wishlist status when auth state changes
      if (this.isLoggedIn && this.product) {
        this.checkWishlistStatus();
      }
    });
  }

  ngOnInit() {
    // Check wishlist status when component initializes
    if (this.isLoggedIn && this.product) {
      this.checkWishlistStatus();
    }
  }

  checkWishlistStatus() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlistProducts: Product[]) => {
        this.isWishlisted = wishlistProducts.some(
          (p: Product) => p.productId === this.product.productId
        );
      },
      error: (err) => {
        console.error("Error checking wishlist status", err);
      }
    });
  }

  toggleWishlist(event: Event) {
    // Prevent the routerLink navigation when clicking the wishlist button
    event.stopPropagation();

    if (this.userRole === 'SELLER' || this.userRole === 'ADMIN') {
      this.toastr.warning("Seller/Admin cannot add to wishlist");
      return;
    }

    if (!this.isLoggedIn) {
      this.toastr.warning("Please login to add to wishlist");
      return;
    }

    this.wishlistService.toggleWishlist(this.product.productId).subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.isWishlisted = !this.isWishlisted; // Toggle UI

        // Show appropriate toast message
        if (this.isWishlisted) {
          this.toastr.success("Added to wishlist");
        } else {
          this.toastr.info("Removed from wishlist");
        }
      },
      error: (err) => {
        console.error("Wishlist error", err);
        this.toastr.error("Failed to update wishlist");
      }
    });
  }
}
