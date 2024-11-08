import { SidebarComponent } from './../sidebar/sidebar.component';
import { ConfirmationModalComponent } from './../../common/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../api services/profile.service';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  isModalOpen = false;
  userName: string = '';
  termsChecked = false;
  balanceChecked = false;
  serviceChecked = false;
  feedback = '';

  loading : boolean = false;


  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private store: Store<any>,
    private toastr: ToastrService ,
    private router: Router// Injecting toast service
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      gender: [''],
    });

    // Load current user data
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe((profileData: any) => {
      this.profileForm.patchValue({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender,
      });
      this.userName = profileData.name;
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    this.loading = true;
    if (this.isEditing) {
      this.profileService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.isEditing = false; // Stop editing after successful update
          this.userName = this.profileForm.get('name')?.value; // Update userName
          this.toastr.success('Profile updated successfully!');

        },
        error: (error) => {
          this.loading = false;
          console.error('Update profile error:', error);
          const errorMessage = error?.error?.message || 'Failed to update profile';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.termsChecked = false;
    this.balanceChecked = false;
    this.serviceChecked = false;
    this.feedback = '';
  }

  canDelete(): boolean {
    return this.termsChecked && this.balanceChecked && this.serviceChecked;
  }

  confirmDelete() {
    if (this.canDelete()) {
      this.onDelete(); // Call the actual delete method
    } else {
      this.toastr.error("Please agree to all terms before proceeding.");
    }
  }

  onDelete(): void {
    this.isModalOpen = false;
    this.profileService.deleteProfile().subscribe({
      next: () => {
        this.toastr.success("Deleted User Successfully!");
        this.router.navigate(['/register']);
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Failed to delete profile';
        this.toastr.error(errorMessage);
      }
    });
  }
}
