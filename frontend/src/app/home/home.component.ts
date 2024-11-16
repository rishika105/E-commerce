import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NgIconComponent } from '@ng-icons/core';
import { Category, CategoryService } from '../api services/category.service';
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
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent implements OnInit, AfterViewInit {
  categories: Category[] = [];
  loading: boolean = false;
  private sliderIndex: number = 0;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.countdown(); // Start the countdown
  }

  ngAfterViewInit(): void {
    this.startSlider(); // Initialize slider after the view is loaded
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
    const targetDate: number = new Date('Nov 20, 2024 00:00:00').getTime();

    const interval: number = window.setInterval(() => {
      const now: number = new Date().getTime();
      const timeRemaining: number = targetDate - now;

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const daysElement = document.getElementById('days');
      const hoursElement = document.getElementById('hours');
      const minutesElement = document.getElementById('minutes');
      const secondsElement = document.getElementById('seconds');

      if (daysElement) daysElement.textContent = `${days} :`;
      if (hoursElement) hoursElement.textContent = `${hours} :`;
      if (minutesElement) minutesElement.textContent = `${minutes} :`;
      if (secondsElement) secondsElement.textContent = `${seconds}`;

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

  startSlider(): void {
    const slides = document.querySelectorAll<HTMLElement>('.slides');
    const dots = document.querySelectorAll<HTMLElement>('.dot');

    const changeSlide = () => {
      slides.forEach((slide, i) => {
        slide.classList.add('hidden');
        dots[i]?.classList.remove('bg-black');
        dots[i]?.classList.add('bg-gray-400');
      });

      this.sliderIndex = (this.sliderIndex + 1) % slides.length;
      slides[this.sliderIndex]?.classList.remove('hidden');
      dots[this.sliderIndex]?.classList.remove('bg-gray-400');
      dots[this.sliderIndex]?.classList.add('bg-black');

      setTimeout(changeSlide, 2000); // Change slide every 2 seconds
    };

    changeSlide();
  }
}
