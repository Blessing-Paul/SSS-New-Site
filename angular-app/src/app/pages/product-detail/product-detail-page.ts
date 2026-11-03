import { Component, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Product,
  ProductCategory,
  ProductIntegration,
  getCategory,
  getProduct,
  integrationsFor,
  productsInCategory
} from '../../core/products.data';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  templateUrl: './product-detail-page.html'
})
export class ProductDetailPageComponent implements OnDestroy {
  product!: Product;
  category!: ProductCategory;
  integrations: ProductIntegration[] = [];
  siblings: Product[] = [];
  related: Product[] = [];
  private readonly subscription: Subscription;

  constructor(route: ActivatedRoute, router: Router, private readonly title: Title, private readonly meta: Meta) {
    this.subscription = route.paramMap.subscribe((params) => {
      const product = getProduct(params.get('slug') ?? '');
      if (!product) {
        void router.navigateByUrl('/products', { replaceUrl: true });
        return;
      }
      this.product = product;
      this.category = getCategory(product.category)!;
      this.integrations = integrationsFor(product.slug);
      this.siblings = productsInCategory(product.category).filter((item) => item.slug !== product.slug);
      this.related = this.siblings.length
        ? this.siblings
        : [...new Set(this.integrations.flatMap((link) => this.partners(link)))];
      this.title.setTitle(`${product.name} | Stable Shield Solutions`);
      this.meta.updateTag({ name: 'description', content: `${product.name}: ${product.summary} Features, who it's for, integrations and how to book a demo.` });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  partners(integration: ProductIntegration): Product[] {
    return integration.products
      .filter((slug) => slug !== this.product.slug)
      .map((slug) => getProduct(slug)!)
      .filter(Boolean);
  }

  demoLink(): string {
    return `/products?product=${encodeURIComponent(this.product.name)}#demo`;
  }
}
