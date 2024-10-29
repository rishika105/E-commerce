import { Input, Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { Product } from '../api services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: Product;

  isInWishlist = false;

  toggleWishlist(){

  }
}
