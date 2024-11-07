import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Product, ProductService } from '../../../api services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../../api services/profile.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../api services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '../../../common/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmationModalComponent],
  templateUrl: './manage-products.component.html'
})
export class ManageProductsComponent implements OnInit {
  products$: Observable<Product[]> | null = null;
  userId: number | null = null;
  error: string | null = null;
  isLoading: boolean = true;
  entriesPerPage: number = 2;
  category: Category[] = [];
  showConfirmDeleteModal = false; // Controls modal visibility
  productIdToDelete: number | null = null; // Stores the product ID to delete

  constructor(
    private productService: ProductService,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (profileData: any) => {
        this.userId = profileData.user_id;
        if (this.userId) {
          this.loadSellerProducts();
        } else {
          this.error = 'User ID not found.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.error = 'Failed to load user profile.';
        this.isLoading = false;
        console.error('Profile loading error:', error);
      }
    });
  }

  loadSellerProducts(): void {
    if (this.userId) {
      this.isLoading = true;
      this.error = null;
      this.products$ = this.productService.getProductsBySeller(this.userId).pipe(
        map((response: any) => {
          if (response && Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.products)) {
            return response.products;
          }
          throw new Error('Invalid response format');
        }),
        catchError(error => {
          this.error = 'Failed to load products.';
          console.error('Products loading error:', error);
          return of([]);
        })
      );
      this.isLoading = false;
    }
  }

  editProduct(productId: number): void {
    if (productId) {
      this.router.navigate(['/seller-dashboard/edit-product', productId]);
    } else {
      this.toastr.error('Invalid product ID');
    }
  }

  delProduct(productId: number): void {
    // Trigger the modal and pass the product ID
    this.showConfirmDeleteModal = true;
    this.productIdToDelete = productId;
  }

  cancelDelete(): void {
    // Hide the modal
    this.showConfirmDeleteModal = false;
    this.productIdToDelete = null;
  }

  deleteProduct(): void {
    // Hide the modal and proceed with deletion
    if (!this.productIdToDelete) {
      this.toastr.error('Invalid product ID');
      return;
    }

    this.productService.deleteProduct(this.productIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully');
        this.loadSellerProducts(); // Reload the products list after deletion
      },
      error: (error) => {
        this.error = 'Failed to delete product. Please try again.';
        console.error('Product deletion error:', error);
        this.toastr.error('Error deleting the product');
      }
    });

    this.showConfirmDeleteModal = false;
  }
}
