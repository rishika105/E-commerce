import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store<{ auth: any }>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRoles = ["USER", "ADMIN", "SELLER"];

    return this.store.select('auth').pipe(
      map(authState => {
        const userRole = authState.role;
        console.log('User Role:', userRole); // For debugging
        console.log('Expected Roles:', expectedRoles); // For debugging

        // Allow all roles to pass
        if (!userRole || !expectedRoles.length) {
          return true; // Allow access if no specific role is required
        }

        // If specific roles are required, check if the user has any of them
        if (!expectedRoles.includes(userRole)) {
          this.router.navigate(['/not-authorized']); // Redirect if the role doesn't match
          return false;
        }

        return true; // Allow access if roles match
      })
    );
  }
}
