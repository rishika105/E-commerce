import { ProfileComponent } from './dashboard/profile/profile.component';
import { AddressManagerComponent } from './dashboard/address/address.component';
import { Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './dashboard/seller-dashboard/seller-dashboard.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { RoleGuard } from './guards/role.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { CheckoutComponent } from './checkout/checkout.component';


// Open routes
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },

  // Private routes (only accessible by authenticated users)
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      {path: "", redirectTo: "profile", pathMatch: "full"},
      { path: 'profile', component: ProfileComponent },
    ],
    data: { roles: ['ADMIN'] } // Only ADMIN can access this route
  },
  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      {path: "", redirectTo: "profile", pathMatch: "full"},
      { path: 'profile', component: ProfileComponent },
    ],
    data: { roles: ['SELLER'] } // Only SELLER can access this route
  },
  //NESTED ROUTING
  {
    path: 'user-dashboard',
    component: UserDashboardComponent, // This contains the sidebar
    children: [
      {path: "", redirectTo: "profile", pathMatch: "full"},
      { path: 'profile', component: ProfileComponent },
      { path: 'address', component: AddressManagerComponent},
      // Add more routes here for other dashboard pages
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['USER']}
  },

  // Default route that redirects to 'home'
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // Wildcard route for 404 error page
  {
    path: '**',
    component: ErrorComponent,
  },

  // Lazy-loaded standalone components
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'category',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
  },
  { path: 'checkout',
    component: CheckoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
