import { PRODUCTS } from '../../core/products.data';
import { SERVICES, SERVICE_GROUPS } from '../../core/services.data';
import { FormSubmitDirective } from '../../shared/form-submit.directive';
import { SubmissionResult } from '../../core/form-submission.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface ReviewRow {
  name: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-partners-page',
  standalone: true,
  imports: [FormSubmitDirective],
  templateUrl: './partners-page.html'
})
export class PartnersPageComponent implements OnInit {
  readonly siloProducts = PRODUCTS;
  readonly serviceGroups = SERVICE_GROUPS.map((name) => {
    const items = SERVICES.filter((service) => service.group === name);
    return { name, icon: items[0].icon, examples: items.map((item) => item.shortName).join(', ') };
  });
  partnershipKey = '';
  prefillProduct = '';
  @ViewChild('partnerForm', { static: true }) private form!: ElementRef<HTMLFormElement>;

  currentStep = 0;
  isCoDevelopment = false;
  status = '';
  reviewRows: ReviewRow[] = [];

  ngOnInit(): void {
    const params = new URLSearchParams(location.search);
    const partnershipType = [...this.form.nativeElement.querySelectorAll<HTMLInputElement>(
      '[name="partnership_type"]'
    )].find((input) => input.dataset['key'] === params.get('type'));
    if (partnershipType) partnershipType.checked = true;

    const product = params.get('product') ||
      (params.get('type') === 'co-development' ? 'My in-house project' : '');
    this.prefillProduct = product;
    this.form.nativeElement.querySelectorAll<HTMLInputElement>('[name="products[]"]')
      .forEach((input) => { input.checked = input.value === product; });

    this.syncCoDevelopment();
    this.updateReview();
  }

  onPartnershipTypeChange(): void {
    this.syncCoDevelopment();
  }

  nextStep(): void {
    const panel = this.getPanel(this.currentStep);
    if (!panel || !this.validate(panel)) return;
    this.currentStep += 1;
    this.status = '';
    if (this.currentStep === 4) this.updateReview();
    this.form.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  previousStep(): void {
    if (this.currentStep === 0) return;
    this.currentStep -= 1;
    this.status = '';
  }

  /** Enter on an earlier step moves forward instead of submitting; the final step is sent by FormSubmitDirective. */
  onSubmit(event: SubmitEvent): void {
    if (this.currentStep < 4) {
      event.preventDefault();
      this.nextStep();
      return;
    }
    const panel = this.getPanel(this.currentStep);
    if (!panel || !this.validate(panel)) event.preventDefault();
  }

  onSubmitted(result: SubmissionResult): void {
    if (result.ok && !result.viaEmail) {
      this.currentStep = 0;
      this.syncCoDevelopment();
    }
  }

  private syncCoDevelopment(): void {
    this.partnershipKey = this.form.nativeElement.querySelector<HTMLInputElement>(
      '[name="partnership_type"]:checked'
    )?.dataset['key'] ?? '';
    this.isCoDevelopment = this.partnershipKey === 'co-development';
  }

  private getPanel(index: number): HTMLElement | null {
    return this.form.nativeElement.querySelector<HTMLElement>(`.step-panel[data-step="${index + 1}"]`);
  }

  private validate(panel: HTMLElement): boolean {
    let firstInvalid: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null = null;
    for (const field of panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea'
    )) {
      if (field.closest('[hidden]') && field.closest('[hidden]') !== panel) continue;
      const valid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    }

    if (panel.dataset['step'] === '1' && !firstInvalid &&
      !panel.querySelector<HTMLInputElement>('[name="products[]"]:checked')) {
      this.status = 'Please choose at least one product or service.';
      return false;
    }
    if (firstInvalid) {
      this.status = 'Please complete the highlighted fields.';
      firstInvalid.focus();
      return false;
    }
    this.status = '';
    return true;
  }

  private updateReview(): void {
    const form = this.form.nativeElement;
    const data = new FormData(form);
    const rows: ReviewRow[] = [];
    const panels = [...form.querySelectorAll<HTMLElement>('.step-panel')];
    panels.slice(0, -1).forEach((panel) => {
      panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input, select, textarea'
      ).forEach((field) => {
        if (!field.name || (field.closest('[hidden]') && field.closest('[hidden]') !== panel) ||
          rows.some((row) => row.name === field.name)) return;
        const value = data.getAll(field.name).filter(Boolean).join(', ');
        if (!value) return;
        const label = field.name === 'products[]'
          ? 'Products / services'
          : field.name === 'partnership_type'
            ? 'Partnership type'
            : (field.closest('label')?.childNodes[0]?.textContent || field.name).replace('*', '').trim();
        rows.push({ name: field.name, label, value });
      });
    });
    this.reviewRows = rows;
  }
}
