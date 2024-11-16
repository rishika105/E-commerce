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
  imports: [
    CommonModule,
    NgIconComponent,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    ProductCardComponent,
  ],
  templateUrl: 'home.component.html',
  styles: ``,
})
export class HomeComponent {
  categories: Category[] = [];
  loading: boolean = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.countdown(); // Start the countdown when the component is initialized
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

  countdown(): void {
    // Set the target date for the countdown (adjust to your sale end date)
    const targetDate: number = new Date('Nov 20, 2024 00:00:00').getTime();

    // Update the timer every second
    const interval: number = window.setInterval(() => {
      const now: number = new Date().getTime();
      const timeRemaining: number = targetDate - now;

      // Calculate days, hours, minutes, and seconds
      const days: number = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours: number = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes: number = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds: number = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Display the result
      const daysElement = document.getElementById('days');
      const hoursElement = document.getElementById('hours');
      const minutesElement = document.getElementById('minutes');
      const secondsElement = document.getElementById('seconds');

      if (daysElement) daysElement.textContent = `${days} :`;
      if (hoursElement) hoursElement.textContent = `${hours} :`;
      if (minutesElement) minutesElement.textContent = `${minutes} :`;
      if (secondsElement) secondsElement.textContent = `${seconds}`;

      // If the countdown is over, stop the interval
      if (timeRemaining < 0) {
        clearInterval(interval);
        if (daysElement) daysElement.textContent = '00 :';
        if (hoursElement) hoursElement.textContent = '00 :';
        if (minutesElement) minutesElement.textContent = '00 :';
        if (secondsElement) secondsElement.textContent = '00';
        alert('Flash Sale Ended!');
      }
    }, 1000);
  }
}
