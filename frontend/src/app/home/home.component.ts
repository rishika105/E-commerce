import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIconComponent } from '@ng-icons/core';
import {ToastrService } from 'ngx-toastr';
import { CategoryComponent } from "../category/category.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIconComponent, CategoryComponent], // Import modules directly
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent {

}
