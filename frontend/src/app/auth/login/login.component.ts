// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { setToken, setLoading } from '../../actions/auth.action';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ auth: any }>
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.store.select('auth').subscribe(authState => {
      this.loading = authState.loading;
    });
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      this.store.dispatch(setLoading({ loading: true }));
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(response => {
         // Token is automatically stored in localStorage inside the reducer
        this.store.dispatch(setToken({ token: response.token }));
        this.store.dispatch(setLoading({ loading: false }));
      }, () => {
        this.loginError = true;
        this.store.dispatch(setLoading({ loading: false }));
      });
    }
  }
}
