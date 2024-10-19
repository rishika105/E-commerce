import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule

@Component({
  selector: 'app-seller',
  standalone: true, // <-- Mark the component as standalone
  imports: [FormsModule], // <-- Import FormsModule here
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
})
export class SellerComponent {
  // Auto-generated product ID
  productId: string;

  constructor() {
    // Generate a random product ID for demonstration purposes
    this.productId = this.generateProductId();
  }

  // Function to generate a random product ID
  generateProductId(): string {
    return 'PROD-' + Math.floor(Math.random() * 1000000).toString();
  }

  // Placeholder for handling form submission
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted:', form.value);
    }
  }

  // Placeholder for handling file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
    }
  }
}
