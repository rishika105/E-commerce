import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styles: []
})
export class AddCategoryComponent {
  category: { categoryName: string; description: string } = { categoryName: '', description: '' };
  loading: boolean = false;


  constructor(private categoryService: CategoryService, private toastr: ToastrService) {}


  addCategory(): void {
    this.category.categoryName = this.category.categoryName.trim();
    this.category.description = this.category.description.trim();

    if (this.category.categoryName && this.category.description) {
      this.loading = true;
      this.categoryService.createCategory(this.category).subscribe({
        next: (response) => {
          console.log('Category added successfully:', response);
          this.resetForm();
          this.toastr.success('Category added successfully!');
          this.loading = false;
        },
        error: (error: Error) => {
          this.loading = false;
          console.error('Error adding category:', error);
          this.toastr.error(error.message);
        }
      });
    } else {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  private resetForm(): void {
    this.category = { categoryName: '', description: '' };
  }
}
