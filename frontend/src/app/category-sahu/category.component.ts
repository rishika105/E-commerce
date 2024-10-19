import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  // Sample categories array with image sources and alt text
  categories = [
    { name: 'Phones', imgSrc: 'img/Category-CellPhone.png', altText: 'Phones' },
    {
      name: 'Computers',
      imgSrc: 'img/Category-Computer.png',
      altText: 'Computers',
    },
    {
      name: 'SmartWatch',
      imgSrc: 'img/Category-SmartWatch.png',
      altText: 'SmartWatch',
    },
    { name: 'Camera', imgSrc: 'img/Category-Camera.png', altText: 'Camera' },
    {
      name: 'HeadPhones',
      imgSrc: 'img/Category-Headphone.png',
      altText: 'Headphones',
    },
    { name: 'Gaming', imgSrc: 'img/Category-Gamepad.png', altText: 'Gaming' },
  ];

  // Sample products array to be filtered based on category selection
  products = [
    { id: 1, name: 'iPhone 13', category: 'Phones' },
    { id: 2, name: 'MacBook Pro', category: 'Computers' },
    { id: 3, name: 'Apple Watch', category: 'SmartWatch' },
    { id: 4, name: 'Canon DSLR', category: 'Camera' },
    { id: 5, name: 'Sony Headphones', category: 'HeadPhones' },
    { id: 6, name: 'PlayStation 5', category: 'Gaming' },
    { id: 7, name: 'Samsung Galaxy S21', category: 'Phones' },
    { id: 8, name: 'Dell XPS', category: 'Computers' },
  ];

  // Selected category and filtered products
  selectedCategory: string | null = null;
  filteredProducts: any[] = [];

  // Function to handle category selection and filter products
  onCategorySelect(category: string) {
    this.selectedCategory = category;

    // Filtering products based on the selected category
    this.filteredProducts = this.products.filter(
      (product) => product.category === category
    );

    console.log(`Selected category: ${category}`);
    console.log('Filtered Products:', this.filteredProducts);
  }

  // Function to handle left/right arrow clicks (currently logs the action)
  onArrowClick(direction: string) {
    console.log(`Arrow clicked: ${direction}`);
  }
}
