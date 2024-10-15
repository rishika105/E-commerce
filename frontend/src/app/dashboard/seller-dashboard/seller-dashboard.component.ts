import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [SidebarComponent, RouterLink, RouterOutlet],
  templateUrl: './seller-dashboard.component.html',
  styles: ``
})
export class SellerDashboardComponent {

}
