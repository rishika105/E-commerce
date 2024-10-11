import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {
  isLoggedIn: boolean = false;
  userRole = 'USER';

  constructor(
    private store: Store<{ auth: any }>, // Inject the store to access the auth state
    private router: Router,
    private toastr: ToastrService
  ) {
    // Subscribe to the auth state to check if user is logged in
    this.store.select('auth').subscribe(authState => {
      this.isLoggedIn = !!authState.token; // If token exists, user is logged in
      this.userRole = authState.role; // Get the role from the state
    });
  }
  currentPage: string = 'profile';  // default active page

  navigateTo(page: string) {
    this.currentPage = page;
  }


}
