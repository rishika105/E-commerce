import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../api services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styles: []
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];  // Store products directly in an array
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();  // Load products on component initialization
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.productService.getAllProducts().pipe(
      catchError(err => {
        this.error = 'Failed to load products. Please try again later.';
        console.error('Error loading products:', err);
        return of([]);  // Return empty array on error
      }),
      finalize(() => this.loading = false)  // Finalize after loading
    ).subscribe(products => this.products = products);  // Subscribe to the observable
  }

  onAddProduct(): void {
    this.router.navigate(['/dashboard/add-product']);  // Navigate to add product
  }

  onEditProduct(productId: number): void {
    this.router.navigate(['/dashboard/edit-product', productId]);  // Navigate to edit product
  }

  onDeleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.toastr.success('Product deleted successfully');
          this.loadProducts();  // Reload products after deletion
        },
        error => {
          this.toastr.error('Failed to delete product. Please try again.');
          console.error('Error deleting product:', error);
        }
      );
    }
  }
}
