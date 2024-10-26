import { Store } from '@ngrx/store';
import { ProfileService } from './../../api services/profile.service';
import { RouterOutlet } from '@angular/router';
import { ProfileComponent } from './../profile/profile.component';
import { SidebarComponent } from './../sidebar/sidebar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent, ProfileComponent, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styles: ``
})
export class AdminDashboardComponent {


  userName: string = '';

  constructor(
    private profileService: ProfileService,
    private store: Store<any>,
  ) {}

  ngOnInit(): void {
    // Load current user data
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe((profileData: any) => {

      this.userName = profileData.name;
    });

  }
}
