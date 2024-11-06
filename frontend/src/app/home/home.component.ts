import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIconComponent } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { Category, CategoryService } from '../api services/category.service';
import { Product, ProductService } from '../api services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ReactiveFormsModule, RouterLink, FormsModule, ProductCardComponent], // Import modules directly
  templateUrl: 'home.component.html',
  styles: ``,
})
export class HomeComponent {
  categories: Category[] = [];
  loading : boolean = false;

  constructor(
    private categoryService: CategoryService,
  ) {}

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

<<<<<<< HEAD


}
=======
  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe(
        (data) => {
          this.searchResults = data;
        },
        (error) => {
          console.error('Error searching products:', error);
        }
      );
    }
  }
}
>>>>>>> a80e418bbfc9b1934f833a379ec2df98098d8f45
