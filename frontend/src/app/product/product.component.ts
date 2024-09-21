import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styles: ``
})
export class ProductComponent {
  @Input() product: any; // Use any or define a proper type if needed
}
