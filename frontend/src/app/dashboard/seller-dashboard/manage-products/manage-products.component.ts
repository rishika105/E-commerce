import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../api services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styles: []
})
export class ManageProductsComponent {

}
