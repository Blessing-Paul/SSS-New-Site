import { PRODUCTS } from '../../core/products.data';
import { Component } from '@angular/core';

@Component({
  selector: 'app-support-page',
  standalone: true,
  templateUrl: './support-page.html'
})
export class SupportPageComponent {
  readonly siloProducts = PRODUCTS;
}
