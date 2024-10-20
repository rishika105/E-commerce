import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {CategoryService} from "../../../services/category.service"

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styles: ``
})

export class AddCategoryComponent {
  categoryName: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private categoryService: CategoryService) {}

  addCategory(): void {
    if (this.categoryName.trim()) {
      this.categoryService.createCategory({ name: this.categoryName }).subscribe(
        (newCategory) => {
          this.categoryName = '';
          this.successMessage = 'Category added successfully';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error adding category';
          this.successMessage = '';
          console.error('Error adding category:', error);
        }
      );
    }
  }
}
