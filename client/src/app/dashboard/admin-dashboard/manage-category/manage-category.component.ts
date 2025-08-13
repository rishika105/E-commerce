import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../../api services/category.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../../../common/confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './manage-category.component.html',
  styles: ``
})

export class ManageCategoryComponent {
  categories: Category[] = [];
  editingCategory: Category | null = null; // Allow null values
  loading = false;
  showDeleteModal = false;
  categoryId: number | null = null;


  constructor(private categoryService: CategoryService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  delCategory(id: number){
    this.categoryId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(){
    this.showDeleteModal = false;
  }

  deleteCategory(): void {
    if (!this.categoryId) {
      this.toastr.error('Invalid category ID');
      return;
    }

    this.loading = true;
    this.showDeleteModal = false;
    this.categoryService.deleteCategory(this.categoryId).subscribe(
      () => {
        this.loading = false;
        this.toastr.success("Category deleted Sucessfully!")
        this.categories = this.categories.filter(category => category.id !== this.categoryId);
      },
      (error) => {
        this.loading = false;
        this.toastr.error("Error deleting Category")
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
    this.loading = true;
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory).subscribe(
        (updatedCategory) => {
          const index = this.categories.findIndex(c => c.id === updatedCategory.id);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.loading = false;
          this.editingCategory = null;  // Clear after saving
          this.toastr.success("Category updated successfully!");

        },
        (error) => {
          this.loading = false;
           this.toastr.error("Error updating category");
          console.error('Error updating category:', error);
        }
      );
    }
  }
}
