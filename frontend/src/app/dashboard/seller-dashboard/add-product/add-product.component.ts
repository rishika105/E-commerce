import { ToastrService } from 'ngx-toastr';
// add-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../api services/product.service';
import { Category, CategoryService } from '../../../api services/category.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  loading: boolean = true; // Start with loading set to true


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadCategories();
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
    this.loading = true;
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      const productData = {
        ...this.productForm.value,
        category: { categoryId: this.productForm.get('categoryId')?.value }
      };
      formData.append('product', JSON.stringify(productData));

      this.productService.createProduct(formData).subscribe(
        (response) => {
          this.loading = false;
          console.log('Product created successfully', response);
          this.toastr.success("Product added successfully");
          this.productForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
        },
        (error) => {
          this.loading = false;
          console.error('Error creating product', error);
          this.toastr.error("Error adding product");
        }
      );
    }
  }
}
