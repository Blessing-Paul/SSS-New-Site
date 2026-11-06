import { FormSubmitDirective } from '../form-submit.directive';
import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { ENQUIRY_EXTRAS, ORGANIZATION_TYPES, SERVICE_GROUPS, SERVICES } from '../../core/services.data';

/**
 * The one project-enquiry form used across the site (Home, Contact, ...).
 * Field names are fixed so every submission of "project-enquiry" has the same shape.
 */
@Component({
  selector: 'app-project-enquiry-form',
  standalone: true,
  imports: [FormSubmitDirective],
  templateUrl: './project-enquiry-form.html',
  styleUrl: './project-enquiry-form.css',
  host: { '[class.is-card]': 'card' }
})
export class ProjectEnquiryFormComponent implements OnInit {
  /** Optional heading shown above the fields. */
  @Input() heading = '';
  /** Render inside its own card surface (for sections that don't provide one). */
  @Input({ transform: booleanAttribute }) card = false;

  readonly groups = SERVICE_GROUPS;
  readonly extras = ENQUIRY_EXTRAS;
  readonly organizationTypes = ORGANIZATION_TYPES;
  selectedService = '';

  servicesIn(group: string) {
    return SERVICES.filter((service) => service.group === group);
  }

  ngOnInit(): void {
    const value = new URLSearchParams(location.search).get('service') ?? '';
    const known = SERVICES.some((s) => s.slug === value) || ENQUIRY_EXTRAS.some((s) => s.slug === value);
    this.selectedService = known ? value : '';
  }
}
