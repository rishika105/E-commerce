import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: ``
})
export class CategoryComponent implements OnInit {
  categoryName: string = 'Smartphones';
  products: any[] = []; // Use any[] to hold products

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch the JSON data
    this.http.get<{ products: any[] }>('../../assets/data/data.json').subscribe((data) => {
      this.products = data.products; // Assign the products array
    });
  }
}
