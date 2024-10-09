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
    const expectedRoles = route.data['roles'] as Array<string>;

    return this.store.select('auth').pipe(
      map(authState => {
        const userRole = authState.role; // Assuming you store user role in auth state
        if (!expectedRoles.includes(userRole)) {
          this.router.navigate(['/not-authorized']);
          return false;
        }
        return true; // User has the required role
      })
    );
  }
}
