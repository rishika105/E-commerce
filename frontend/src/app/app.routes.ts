import { ManageCategoryComponent } from './dashboard/admin-dashboard/manage-category/manage-category.component';
import { Component } from '@angular/core';
import { AddCategoryComponent } from './dashboard/admin-dashboard/add-category/add-category.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { AddressManagerComponent } from './dashboard/user-dashboard/address/address.component';
import { Routes, CanActivate } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AboutComponent } from './common/about/about.component';
import { ContactComponent } from './common/contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './common/error/error.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './dashboard/seller-dashboard/seller-dashboard.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { RoleGuard } from './guards/role.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AddProductComponent } from './dashboard/seller-dashboard/add-product/add-product.component';
import { ManageProductsComponent } from './dashboard/seller-dashboard/manage-products/manage-products.component';
import { CategoryComponent } from './category/category.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';

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
    component: ResetPasswordComponent 
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      {path: "", redirectTo: "profile", pathMatch: "full"},
      { path: 'profile', component: ProfileComponent },
      {path: 'addCategory', component: AddCategoryComponent},
      {path: 'manageCategory', component: ManageCategoryComponent}
    ],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      {path: "", redirectTo: "profile", pathMatch: "full"},
      { path: 'profile', component: ProfileComponent },
      { path: 'add-product', component: AddProductComponent},
      { path: 'manage-products', component: ManageProductsComponent},
    ],
    data: { roles: ['SELLER'] }
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    children: [
      {path: "", redirectTo: "profile", pathMatch: "full"},
      { path: 'profile', component: ProfileComponent },
      { path: 'address', component: AddressManagerComponent},
    ],
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['USER']}
  },
  {
    path: 'category/:id',
    component: CategoryComponent,
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];