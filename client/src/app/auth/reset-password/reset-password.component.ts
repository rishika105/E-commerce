import { AuthState } from '../../ngrx store/auth/auth.reducer';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../api services/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { setLoading } from '../../ngrx store/auth/auth.action';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  message: string = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<{ auth: any }>,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
    // Subscribe to auth store to get loading state
    this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading;
    });
  }

  ngOnInit(): void {
    // Retrieve the token from the URL
    this.token = this.route.snapshot.queryParams['token'];
  }

  onSubmit() {

    const password = this.resetPasswordForm.value.password;
    const confirmPassword = this.resetPasswordForm.value.confirmPassword;

    // Start loading state
    this.store.dispatch(setLoading({ loading: true }));


    this.authService.resetPassword(this.token, password, confirmPassword).subscribe({
      next: (response) => {
        // Reset loading state
        this.store.dispatch(setLoading({ loading: false }));


        //navigate
        this.router.navigate(['/login']);

        // Show success notification
        this.toastr.success('Password reset successfully.');

      },
      error: (error) => {
        // Reset loading state
        this.store.dispatch(setLoading({ loading: false }));

        const errorMessage = error.error?.error || 'Error resetting password';
        this.toastr.error(errorMessage);
      },
    });
  }
}
