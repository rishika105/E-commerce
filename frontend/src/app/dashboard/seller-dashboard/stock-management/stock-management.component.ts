// import { Component, OnInit } from '@angular/core';
// import { Product, ProductService } from '../../../api services/product.service';

// @Component({
//   selector: 'app-stock-management',
//   templateUrl: './stock-management.component.html',
//   styles: ``
// })
// export class StockManagementComponent implements OnInit {
//   products: Product[] = [];

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadSellerProducts();
//   }

//   loadSellerProducts() {
//     this.productService.getAllProducts().subscribe({
//       next: (response) => {
//         this.products = response.filter(product => product.sellerId === this.getLoggedInSellerId());
//       },
//       error: (err) => {
//         console.error('Error loading products', err);
//       }
//     });
//   }

//   updateStock(id: number, newStock: number) {
//     this.productService.updateStock(id, newStock).subscribe({
//       next: () => {
//         alert('Stock updated successfully');
//       },
//       error: (err) => {
//         console.error('Error updating stock', err);
//       }
//     });
//   }

//   getLoggedInSellerId(): number {
//     // Fetch the logged-in seller's ID (from token or local storage)
//     return 123;  // Replace with actual logic
//   }
// }
