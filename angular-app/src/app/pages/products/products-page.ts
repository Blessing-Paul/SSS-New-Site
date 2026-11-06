import { FormSubmitDirective } from '../../shared/form-submit.directive';
import { Component } from '@angular/core';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_INTEGRATIONS,
  PRODUCTS,
  Product,
  getProduct,
  integrationsFor,
  productsInCategory
} from '../../core/products.data';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [FormSubmitDirective],
  templateUrl: './products-page.html'
})
export class ProductsPageComponent {
  readonly products = PRODUCTS;
  readonly categories = PRODUCT_CATEGORIES;
  readonly integrations = PRODUCT_INTEGRATIONS;

  productsIn(category: string): Product[] {
    return productsInCategory(category);
  }

  connections(slug: string): number {
    return integrationsFor(slug).length;
  }

  product(slug: string): Product | undefined {
    return getProduct(slug);
  }
}
