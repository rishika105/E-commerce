import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../../api services/product.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of } from 'rxjs';

interface ProductStock {
  productId: number;
  name: string;
  stock: number;
  imageUrl: string;
  price: number;
  isUpdating: boolean;
}

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StockManagementComponent implements OnInit {
  products: ProductStock[] = [];
  loading: boolean = true;
  selectedProducts: Set<number> = new Set();
  batchStockValue: number = 0;
  userId:number | null = null;
  products$: Observable<Product[]> | null = null;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSellerProducts();
  }


  loadSellerProducts(): void {
    if (this.userId) {
      this.loading = true;
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

        console.error('Products loading error:', error);
          return of([]);
        })
      );
      this.loading = false;
    }
  }

  updateStock(product: ProductStock): void {
    product.isUpdating = true;
    this.productService.updateStock(product.productId, product.stock).subscribe({
      next: () => {
        this.toastr.success(`Stock updated for ${product.name}`);
        product.isUpdating = false;
      },
      error: (error) => {
        this.toastr.error(`Failed to update stock for ${product.name}`);
        product.isUpdating = false;
      }
    });
  }

  toggleProductSelection(productId: number): void {
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
    } else {
      this.selectedProducts.add(productId);
    }
  }

  updateBatchStock(): void {
    if (this.selectedProducts.size === 0) {
      this.toastr.warning('Please select products to update');
      return;
    }

    const updates = Array.from(this.selectedProducts).map(productId => {
      const product = this.products.find(p => p.productId === productId);
      if (product) {
        product.isUpdating = true;
        return this.productService.updateStock(productId, this.batchStockValue).toPromise();
      }
      return Promise.resolve();
    });

    Promise.all(updates).then(() => {
      this.toastr.success('Batch stock update successful');
      this.selectedProducts.clear();
      this.batchStockValue = 0;
      this.loadSellerProducts();
    }).catch(() => {
      this.toastr.error('Error updating some products');
      this.loadSellerProducts();
    });
  }
}
