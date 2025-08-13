import { NgIconComponent } from '@ng-icons/core';
import { ConfirmationModalComponent } from './../../common/confirmation-modal/confirmation-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { clearToken } from '../../ngrx store/auth/auth.action';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ConfirmationModalComponent, NgIconComponent],
  templateUrl: './sidebar.component.html',
  styles: ``
})

export class SidebarComponent {
  isLoggedIn: boolean = false;
  userRole: string = 'USER'; // default role is USER
  currentPage: string = '/user-dashboard/profile';  // default route for USER
  userDefaultPage: string = '/user-dashboard/profile';
  sellerDefaultPage: string = '/profile';
  showLogoutModal = false;
  @Input() userName: string = '';


  constructor(
    private store: Store<{ auth: any }>, // Inject the store to access the auth state
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,

  ) {
    // Subscribe to the auth state to check if user is logged in
    this.store.select('auth').subscribe(authState => {
      this.isLoggedIn = !!authState.token; // If token exists, user is logged in
      this.userRole = authState.role || 'USER'; // Get the role from the state
      // Set default page based on userRole
      this.currentPage = this.userRole === 'SELLER' ? this.sellerDefaultPage : this.userDefaultPage;
    });
  }

  ngOnInit(): void {
    // Capture route changes and update currentPage
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.url; // Update current page when navigation happens
      }
    });

    // Set default route on page load based on user role
    const defaultRoute = this.userRole === 'SELLER' ? this.sellerDefaultPage : this.userDefaultPage;
    if (this.router.url === '/') {
      this.router.navigate([defaultRoute]); // Navigate to default profile page
    } else {
      this.currentPage = this.router.url; // Update current page with existing URL
    }
  }

  // Method to check if the current route is active
  isActive(route: string): boolean {
    return this.currentPage === route; // Compare the route with currentPage
  }

      // Show the logout confirmation modal
      logout() {
        this.showLogoutModal = true; // Show the confirmation modal for logout
      }

      // Cancel the logout and hide the modal
      cancelLogout() {
        this.showLogoutModal = false;
      }

      // Confirm the logout and proceed
      confirmLogout() {
        this.showLogoutModal = false;
        this.store.dispatch(clearToken()); // Log out the user
        this.router.navigate(['/login']); // Navigate to login page
        this.toastr.success("Logged Out Successfully!")
      }
}
