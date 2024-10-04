import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthState } from './reducers/auth.reducer';  // Import the AuthState interface

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private store: Store<{ auth: AuthState }>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select('auth').pipe(
      take(1),  // Complete the observable after the first value is emitted
      map(authState => {
        const token = authState.token;
        if (token) {
          // Allow access if the token exists
          return true;
        } else {
          // Redirect to login if there's no token
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
