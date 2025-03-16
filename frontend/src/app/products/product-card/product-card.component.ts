import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { WishlistService } from '../../wishlist/wishlist.service';
import { Product } from '../../api services/product.service';
import { NgIconComponent } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../api services/auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIconComponent, CommonModule, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeFromWishlist = new EventEmitter<Product>();

  isWishlisted: boolean = false;
  isLoggedIn: boolean = false;
  userRole: string = 'USER'; // default role is USER

  constructor(
    private store: Store<{ auth: any }>, // Inject the store to access the auth state
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService,

  ) {
     // Subscribe to the auth state to check if user is logged in
     this.store.select('auth').subscribe(authState => {
      this.isLoggedIn = !!authState.token; // If token exists, user is logged in
      this.userRole = authState.role || 'USER'; // Get the role from the state
    });
  }

  ngOnInit() {
    this.isWishlisted = this.wishlistService.isInWishlist(this.product.productId);
    this.wishlistService.getWishlistObservable().subscribe(() => {
      this.isWishlisted = this.wishlistService.isInWishlist(this.product.productId);
    });
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if(this.userRole === 'SELLER' || this.userRole === 'ADMIN'){
      this.toastr.warning("Seller/Admin cannot add to wishlist");
      return;
    }
    if(!this.isLoggedIn){
      this.toastr.warning("Please login to add to wishlist");
      return;
    }

    if (this.isWishlisted) {
      this.removeFromWishlist.emit(this.product);
    } else {
      this.addToWishlist.emit(this.product);
    }
  }

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

     if(this.userRole === 'SELLER' || this.userRole === 'ADMIN'){
      this.toastr.warning("Seller/Admin cannot add to cart");
      return;
    }

    if(!this.isLoggedIn){
      this.toastr.warning("Please login to add to cart");
      return;
    }
    
    this.cartService.addToCart(this.product);
    this.toastr.success("Added to Cart");
  }
}
