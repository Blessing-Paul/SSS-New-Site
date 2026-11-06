import { FormSubmitDirective } from '../../shared/form-submit.directive';
import { ProjectEnquiryFormComponent } from '../../shared/project-enquiry-form/project-enquiry-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [FormSubmitDirective, ProjectEnquiryFormComponent],
  templateUrl: './contact-page.html'
})
export class ContactPageComponent {}
