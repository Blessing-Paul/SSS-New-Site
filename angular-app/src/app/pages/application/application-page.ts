import { Component } from '@angular/core';
import { JobApplicationFormComponent } from '../../shared/job-application-form/job-application-form';

@Component({
  selector: 'app-application-page',
  standalone: true,
  imports: [JobApplicationFormComponent],
  templateUrl: './application-page.html'
})
export class ApplicationPageComponent {}
