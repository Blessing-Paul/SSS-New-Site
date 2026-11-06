import { ProjectEnquiryFormComponent } from '../../shared/project-enquiry-form/project-enquiry-form';
import { Component } from '@angular/core';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [ProjectEnquiryFormComponent],
  templateUrl: './index-page.html'
})
export class IndexPageComponent {}
