import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { setLoading } from '../../actions/auth.action';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private store: Store<{ auth: any }>,
    private toastr: ToastrService
  ) {
    // Initialize the form with email field
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Subscribe to auth store to get loading state
    this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading;
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      // Start loading state
      this.store.dispatch(setLoading({ loading: true }));

      const email = this.forgotPasswordForm.value.email;
      console.log(`Submitting password reset for: ${email}`);

      // Call the requestPasswordReset function from AuthService
      this.authService.requestPasswordReset( email ).subscribe({
        next: (response) => {
          // Reset loading state
          this.store.dispatch(setLoading({ loading: false }));

          // Show success notification
          this.toastr.success('Password reset link has been sent to your email.');
        },
        error: (error) => {
          // Reset loading state
          this.store.dispatch(setLoading({ loading: false }));

          // Display error message from the response
          const errorMessage = error.error?.error || 'Error sending reset link.';
          this.toastr.error(errorMessage);
        },
      });
    }
  }
}
