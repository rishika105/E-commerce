import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  categories: string[] = [
    'Electronics',
    'Clothing',
    'Home Appliances',
    'Books',
    'Toys',
  ];

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Product added:', form.value);
      // Implement logic to handle the form submission, like sending data to a server
    }
  }
}
