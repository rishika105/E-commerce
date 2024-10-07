import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIconComponent } from '@ng-icons/core';
import {ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIconComponent, MatCard, MatCardContent], // Import modules directly
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {

  constructor(private toastr: ToastrService) {}

  showSuccess() {
    console.log('Toastr should show now');
    this.toastr.success('Success');
  }


  showError() {
    this.toastr.error('Error');
  }

}
