import { ProductService, Product } from '../../api services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../wishlist/wishlist.service';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-listing.component.html',
  styles: ``
})
export class ProductListingComponent implements OnInit {
  searchResults: Product[] = [];
  isSearchMode: boolean = false;
  searchTerm: string = '';
  loading: boolean = false; // Start with loading set to true

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Subscribing to query parameters to handle search
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.isSearchMode = !!this.searchTerm; // Check if searchTerm exists

      if (this.isSearchMode) {
        // If search term exists, search for products
        this.searchProducts(this.searchTerm);
      } else {
        // No search term, display all products
        this.getAllProducts();
      }
    });
  }

  // Search products based on searchTerm
  searchProducts(searchTerm: string): void {
    this.loading = true; // Set loading true while fetching
    if (searchTerm.trim()) {
      this.productService.searchProducts(searchTerm).subscribe(
        (response: any) => {
          this.searchResults = response.products;
          this.loading = false; // Set loading false after data is fetched
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.loading = false; // Set loading false even on error
        }
      );
    } else {
      this.loading = false; // If searchTerm is empty, set loading false
    }
  }

  // Get all products if no search term is provided
  getAllProducts(): void {
    this.loading = true; // Set loading true while fetching
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.searchResults = response.products;
        this.loading = false; // Set loading false after data is fetched
      },
      (error) => {
        console.error('Error fetching all products:', error);
        this.loading = false; // Set loading false even on error
      }
    );
  }

  onAddToWishlist(product: Product): void {
    this.wishlistService.addToWishlist(product);
    this.toastr.success("Added to Wishlist");
  }

  onRemoveFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.productId);
    this.toastr.success("Removed from Wishlist");
  }
}
