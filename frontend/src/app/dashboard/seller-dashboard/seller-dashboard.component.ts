import { Store } from '@ngrx/store';
import { ProfileService } from './../../api services/profile.service';
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
