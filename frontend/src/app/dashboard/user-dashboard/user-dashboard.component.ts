import { RouterOutlet } from '@angular/router';
import { ProfileComponent } from './../profile/profile.component';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SidebarComponent, ProfileComponent, RouterOutlet],
  templateUrl: './user-dashboard.component.html',
  styles: ``
})
export class UserDashboardComponent {

}
