import { Component } from '@angular/core';
import { Product, SECTOR_ECOSYSTEMS, getProduct } from '../../core/products.data';

@Component({
  selector: 'app-industries-page',
  standalone: true,
  templateUrl: './industries-page.html'
})
export class IndustriesPageComponent {
  readonly ecosystems = SECTOR_ECOSYSTEMS;

  /** Silo products recommended for each sector article, keyed by its anchor id. */
  readonly sectorProducts: Record<string, string[]> = {
    government: ['identity-silo', 'revenue-silo', 'payment-silo', 'office-silo'],
    universities: ['office-silo-campus', 'exam-silo', 'training-silo', 'payment-silo'],
    education: ['school-silo', 'exam-silo', 'training-silo', 'payment-silo'],
    faith: ['membership-silo', 'training-silo', 'payment-silo', 'office-silo'],
    ngos: ['office-silo', 'identity-silo', 'training-silo', 'membership-silo'],
    healthcare: ['health-silo', 'payment-silo', 'identity-silo'],
    agriculture: ['cooperative-silo', 'business-silo', 'payment-silo'],
    enterprise: ['business-silo', 'office-silo', 'training-silo', 'payment-silo'],
    associations: ['membership-silo', 'cooperative-silo', 'identity-silo', 'training-silo', 'exam-silo'],
    property: ['mep-silo', 'revenue-silo', 'payment-silo'],
    transport: ['automobile-silo', 'payment-silo', 'identity-silo']
  };

  productsFor(sector: string): Product[] {
    return this.products(this.sectorProducts[sector] ?? []);
  }

  products(slugs: string[]): Product[] {
    return slugs.map((slug) => getProduct(slug)).filter((product): product is Product => Boolean(product));
  }
}
