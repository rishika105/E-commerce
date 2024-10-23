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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {
  profileForm!: FormGroup;
  isEditing = false;
  showDeleteModal = false;

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
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.profileService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.isEditing = false; // Stop editing after successful update
          this.toastr.success('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Update profile error:', error);
          const errorMessage = error?.error?.message || 'Failed to update profile';
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  onDel(){
    this.showDeleteModal = true;
  }

  onCancelDel(){
    this.showDeleteModal = false;
  }

  onDelete() : void{
    this.showDeleteModal = false;
    this.profileService.deleteProfile().subscribe({
      next: (response) => {
         this.toastr.success("Deleted User Sucessfully!");
         this.router.navigate(['/register']);
      },
      error: (error) => {
        const errorMessage = error?.error?.message || 'Failed to delete profile';
          this.toastr.error(errorMessage);
        }

    });
  }

}
