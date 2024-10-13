import { ProfileService } from './../../services/profile.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {
  profileForm!: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private store: Store<any>) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      gender: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    });

    // Load current user data
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe((profileData: any) => {
      this.profileForm.patchValue({
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.phone,
        gender: profileData.gender,
      });
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.profileService.updateProfile(this.profileForm.value).subscribe((response) => {
        this.isEditing = false; // Stop editing after successful update
      });
    }
  }
}
