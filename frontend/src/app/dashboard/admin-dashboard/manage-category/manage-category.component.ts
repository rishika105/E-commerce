import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from './../../../services/category.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-category.component.html',
  styles: ``
})

export class ManageCategoryComponent {
  categories: Category[] = [];
  editingCategory: Category | null = null;  // Allow null values
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        this.errorMessage = 'Error loading categories';
        console.error('Error loading categories:', error);
      }
    );
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe(
      () => {
        this.categories = this.categories.filter(category => category.id !== id);
        this.successMessage = 'Category deleted successfully';
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error deleting category';
        this.successMessage = '';
        console.error('Error deleting category:', error);
      }
    );
  }

  startEditing(category: Category): void {
    this.editingCategory = { ...category };  // Make a copy of the selected category for editing
  }

  cancelEditing(): void {
    this.editingCategory = null;  // Reset to null when canceling
  }

  saveCategory(): void {
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory).subscribe(
        (updatedCategory) => {
          const index = this.categories.findIndex(c => c.id === updatedCategory.id);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.editingCategory = null;  // Clear after saving
          this.successMessage = 'Category updated successfully';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Error updating category';
          this.successMessage = '';
          console.error('Error updating category:', error);
        }
      );
    }
  }
}
