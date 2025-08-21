import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../api services/product.service';
import { Category, CategoryService } from '../../../api services/category.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../api services/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  loading: boolean = true;
  userId: number | null = null;
  isEditMode: boolean = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      brandName: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserProfile();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.productId = Number(id);
        this.loadProductDetails(Number(id));
      }
    });
  }

  loadProductDetails(productId: number): void {
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (response: any) => {
        // Access the product from the response
        const product = response.product;

        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            brandName: product.brandName,
            categoryId: product.category?.categoryId
          });

          if (product.imageUrl) {
            this.imagePreview = product.imageUrl;
          }
        }

        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading product details');
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadUserProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (profileData: any) => {
        this.userId = profileData.user_id;
      },
      error: (error) => {
        this.loading = false;
        console.error('Profile loading error:', error);
      }
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      this.selectedFile = event.dataTransfer.files[0];
      this.previewImage();
    }
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (!this.productForm.valid || !this.userId) {
      this.toastr.error("Please fill all required fields");
      return;
    }

    this.loading = true;
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const productData = {
      ...this.productForm.value,
      category: {
        categoryId: this.productForm.get('categoryId')?.value
      },
      user: {
        userId: this.userId
      }
    };

    formData.append('product', JSON.stringify(productData));

    if (this.isEditMode && this.productId !== null) {
      // Update existing product
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success("Product updated successfully");
          this.router.navigate(['/seller-dashboard/manage-products']); // Navigate back to products list
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating product:', error);
          this.toastr.error(error.message || "Error updating product");
        }
      });
    } else {
      // Create new product
      if (!this.selectedFile) {
        this.toastr.error("Please select an image");
        this.loading = false;
        return;
      }

      this.productService.createProduct(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success("Product added successfully");
          this.productForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating product:', error);
          this.toastr.error(error.message || "Error adding product");
        }
      });
    }
  }
}
