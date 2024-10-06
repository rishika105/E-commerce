import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { setOtpSent, setLoading, setToken } from '../../actions/auth.action';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import {RouterLink, RouterModule, RouterOutlet } from '@angular/router';

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
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
    { label: 'Seller', value: 'SELLER' }
  ];




  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ auth: any }>,
    private router: Router
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

    { }
  }




  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitSignup() {
    if (this.signupForm.valid) {
      this.store.dispatch(setLoading({ loading: true }));
      const { email } = this.signupForm.value;

      this.authService.sendOtp(email).subscribe({
        next: () => {
          this.store.dispatch(setOtpSent({ otpSent: true }));
          this.store.dispatch(setLoading({ loading: false }));
        },
        error: (err) => {
          this.store.dispatch(setLoading({ loading: false }));
          console.error('Error sending OTP', err);
          // Optionally display an error message to the user here
        }
     });

    }
  }

  onSubmitOtp() {
    if (this.otpForm.valid) {
      const { otp } = this.otpForm.value;
      const { name, email, password, confirmPassword, role } = this.signupForm.value;


      this.authService.register(name, email, password, confirmPassword, role, otp).pipe(
        catchError((error) => {
          console.error('Error during registration', error);
          // Optionally handle the error and display a message to the user
          return of(null); // Handle error
        })
      ).subscribe((response: any) => {
        // Registration is successful, navigate to login or show success message
        console.log('Registration successful, please log in to continue.');
        this.router.navigate(['/login']);
      });

    }
  }
}
