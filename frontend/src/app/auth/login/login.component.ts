import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../api services/auth.service';
import { setLoading, setRole, setToken, setUserId } from '../../ngrx store/auth/auth.action'; // Added setRole action
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterOutlet]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ auth: any }>,
    private router: Router, // For navigation after login
    private toastr: ToastrService // To display toast notifications
  ) {
    // Initialize form group with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Subscribe to auth store to get loading state
    this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading;
    });
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      // Set loading to true when login starts
      this.store.dispatch(setLoading({ loading: true }));

      // Extract email and password from form
      const { email, password } = this.loginForm.value;

      // Call AuthService login API
      this.authService.login(email, password).pipe(
        catchError((error) => {
          // Handle unauthorized (401) error
          if (error.status === 401) {
            this.toastr.error('Invalid credentials');
          } else {
            this.toastr.error('Something went wrong');
          }
          this.store.dispatch(setLoading({ loading: false })); // Stop loading state
          return of(null); // Return empty observable to handle the error case
        })
      ).subscribe((response: any) => {
        if (response && response.token) {
          // Token received, store it in the app's state
          this.store.dispatch(setToken({ token: response.token }));
          this.store.dispatch(setUserId({ userId: response.userId }));
          this.store.dispatch(setRole({ role: response.role }));

          this.store.dispatch(setLoading({ loading: false }));
          this.toastr.success('Logged in successfully!');

          // Navigate based on user role
          const userRole = response.role; // Assuming role is part of the login response
          if (userRole === 'SELLER') {
            this.router.navigate(['/seller-dashboard']); // Navigate to seller dashboard
          } else if (userRole === 'USER') {
            this.router.navigate(['/user-dashboard']); // Navigate to user dashboard
          } else if (userRole === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']); // Navigate to admin dashboard
          }
        }
      });
    }
  }
}
