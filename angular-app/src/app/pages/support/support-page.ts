import { FormSubmitDirective } from '../../shared/form-submit.directive';
import { PRODUCTS } from '../../core/products.data';
import { Component } from '@angular/core';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [FormSubmitDirective],
  templateUrl: './support-page.html'
})
export class SupportPageComponent {
  readonly siloProducts = PRODUCTS;
}
