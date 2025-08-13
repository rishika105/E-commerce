import { ProductCardComponent } from '../../products/product-card/product-card.component';
import { Product, ProductService } from './../../api services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { clearToken } from '../../ngrx store/auth/auth.action';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, RouterOutlet, ConfirmationModalComponent, ProductCardComponent],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  auth$: Observable<{ isLoggedIn: boolean; userRole: string }>;
  showProfileMenu = false;
  showLogoutModal = false;
  searchTerm: string = '';
  searchResults: Product[] = [];

  constructor(
    private store: Store<{ auth: any }>,
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService
  ) {
    this.auth$ = this.store.select('auth').pipe(
      map(authState => ({
        isLoggedIn: !!authState.token,
        userRole: authState.role
      }))
    );
  }


  // Function to toggle the dropdown menu
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Function to navigate to the dashboard
  goToDashboard() {
    this.showProfileMenu = false;
    this.router.navigate(['/user-dashboard'])
  }

     // Show the logout confirmation modal
  logout() {
    this.showProfileMenu = false;
    this.showLogoutModal = true; // Show the confirmation modal for logout
  }

  // Cancel the logout and hide the modal
  cancelLogout() {
    this.showLogoutModal = false;
  }

  // Confirm the logout and proceed
  confirmLogout() {
    this.showProfileMenu = false;
    this.showLogoutModal = false;
    this.store.dispatch(clearToken()); // Log out the user
    this.router.navigate(['/login']); // Navigate to login page
    this.toastr.success("Logged Out Successfully!")
  }

  // HostListener to detect click outside the modal
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) { // Adjust based on your container
      this.showProfileMenu = false;
    }
  }

  onWishlist() {
    console.log("Wishlist clicked");
    this.router.navigate(['/wishlist']);
  }

  onCart() {
    console.log("Cart clicked");
    this.router.navigate(['/cart']);
  }


  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe(
        (response: any) => {
          this.searchResults = response.products; // Accessing products inside the response
          console.log('Search products response:', this.searchResults);
        },
        (error) => {
          console.error('Error searching products:', error);
        }
      );
    }
  }
  onSearch(query: string) {
    if (!query.trim()) {
      this.toastr.warning("Please enter something!")
      return;

    }

    // Navigate to the search results page with query as a parameter
    this.router.navigate(['/search'], { queryParams: { search: query } });
  }



}
