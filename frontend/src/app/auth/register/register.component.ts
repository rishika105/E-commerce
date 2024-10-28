import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../api services/auth.service';
import { setOtpSent, setLoading } from '../../ngrx store/auth/auth.action';
import { CommonModule } from '@angular/common';
import { catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './register.component.html',
  styles: ``,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RouterOutlet, RouterLink]
})
export class RegisterComponent {
  signupForm: FormGroup;
  otpForm: FormGroup;
  otpSent = false;
  loading = false;

  roles = [
    { label: 'User', value: 'USER' },
    { label: 'Seller', value: 'SELLER' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ auth: any }>,
    private router: Router,
    private toastr : ToastrService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]  // Role field added with validation
    }, { validators: this.passwordsMatch });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });

    this.store.select('auth').subscribe(authState => {
      this.otpSent = authState.otpSent;
      this.loading = authState.loading;
    });
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Handling OTP sending and showing correct toasts
  onSubmitSignup() {
    if (this.signupForm.valid) {
      this.store.dispatch(setLoading({ loading: true }));
      const { email } = this.signupForm.value;

      this.authService.sendOtp(email).pipe(
        catchError((err) => {
          this.store.dispatch(setLoading({ loading: false }));
          this.store.dispatch(setOtpSent({ otpSent: false }));

          // Show error toast based on specific backend message
          if (err.status === 400) {
            if (err.error === 'Invalid email format') {
              this.toastr.error("Invalid email format!");
            } else if (err.error === 'User already exists with this email.') {
              this.toastr.error("User already exists with this email.");
            } else {
              this.toastr.error("Error sending OTP!");
            }
          } else {
            this.toastr.error("Error sending OTP!");
          }
          return of(null);
        })
      ).subscribe({
        next: (response) => {
          if (response) {
            this.store.dispatch(setOtpSent({ otpSent: true }));
            this.store.dispatch(setLoading({ loading: false }));
            this.toastr.success("OTP sent to your email!");
          }
        }
      });
    }
  }

  // Handling OTP validation and registration
  onSubmitOtp() {
    if (this.otpForm.valid) {
      const { otp } = this.otpForm.value;
      const { name, email, password, confirmPassword, role } = this.signupForm.value;

      this.authService.register(name, email, password, confirmPassword, role, otp).pipe(
        catchError((error) => {
          console.error('Error during registration', error);
          this.store.dispatch(setLoading({ loading: false }));

          // Show toast for specific errors based on backend response
          if (error.status === 400) {
            if (error.error === 'Passwords do not match.') {
              this.toastr.error("Passwords do not match.");
            } else if (error.error === 'OTP has expired.') {
              this.toastr.error("OTP has expired.");
            } else if (error.error === 'Invalid OTP.') {
              this.toastr.error("Invalid OTP.");
            } else {
              this.toastr.error("Registration error.");
            }
          }
          return of(null);
        })
      ).subscribe((response: any) => {
        if (response) {
          this.toastr.success("Registration successful!");
          this.router.navigate(['/login']);  // Navigate to login page after successful registration
        }
      });
    }
  }
}
