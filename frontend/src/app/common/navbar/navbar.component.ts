import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { clearToken } from '../../actions/auth.action';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, RouterLink, RouterOutlet, ConfirmationModalComponent],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  userRole = 'USER';
  showProfileMenu = false;
  showLogoutModal = false;

  constructor(
    private store: Store<{ auth: any }>, // Inject the store to access the auth state
    private router: Router
  ) {
    // Subscribe to the auth state to check if user is logged in
    this.store.select('auth').subscribe(authState => {
      this.isLoggedIn = !!authState.token; // If token exists, user is logged in
      this.userRole = authState.role; // Get the role from the state
    });
  }

   // Placeholder search functionality
   onSearch(query: string) {
    if (!query) {
      alert("Please enter a search term");
      return;
    }

    // Simulate product search by redirecting to a placeholder page
    const noProducts = true;  // Simulate no results found
    if (noProducts) {
      window.location.href = '/no-results';
    } else {
      // Implement real search logic later
      console.log("Search for products:", query);
    }
  }

  // Function to toggle the dropdown menu
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // Function to navigate to the dashboard
  goToDashboard() {
    this.showProfileMenu = false;
    // Your logic to navigate to the dashboard
    this.router.navigate(['/user-dashboard'])
  }

    // Logout method
    logout() {
      this.showProfileMenu = false;


      // Dispatch clearToken to log out the user
      this.store.dispatch(clearToken());

      // Optionally navigate to the login page after logout
      this.router.navigate(['/login']);
    }

    confirmLogout() {
      this.showLogoutModal = false;
      this.store.dispatch(clearToken()); // Log out the user
      this.router.navigate(['/login']); // Navigate to login page
    }


  // HostListener to detect click outside the modal
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) { // Adjust based on your container
      this.showProfileMenu = false;
    }
  }

}
