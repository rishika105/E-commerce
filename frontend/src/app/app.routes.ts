import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component.spec';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "contact",
    component: ContactComponent
  },
  {
    path: "home",
    component: HomeComponent
  },


//private routes only can access
  {
    path: 'product',
    canActivate: [AuthGuard],
    component: ProductDetailsComponent
  },

     // Default route that redirects to 'home'
     {
      path: "",
      redirectTo: "home",
      pathMatch: "full"
    },
    // Wildcard route for 404 error page
    {
      path: "**",
      component: ErrorComponent
    },
];
