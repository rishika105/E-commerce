import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { ProfileService } from './../../api services/profile.service';
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


  userName: string = '';

  constructor(
    private profileService: ProfileService,
    private store: Store<any>,
    private ToastrService: ToastrService ,



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
