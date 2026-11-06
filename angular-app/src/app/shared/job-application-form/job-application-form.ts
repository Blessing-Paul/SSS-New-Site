import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { JobPosting, JobsService } from '../../core/jobs.service';
import { FormSubmitDirective } from '../form-submit.directive';

/**
 * Staff application form (Careers + /apply).
 *
 * Workflow: a submission creates a *staff application*; the backend sets its stage to "applied".
 * When the backend exists, hiring staff move it through screening → interview → offer;
 * an accepted application is converted into a staff account in the staff portal,
 * reusing the details captured here (name, email, phone, location, role).
 */
@Component({
  selector: 'app-job-application-form',
  standalone: true,
  imports: [FormSubmitDirective],
  templateUrl: './job-application-form.html',
  styleUrl: './job-application-form.css',
  host: { '[class.is-card]': 'card' }
})
export class JobApplicationFormComponent implements OnInit {
  @Input() heading = 'Job application';
  @Input({ transform: booleanAttribute }) card = false;

  static readonly GENERAL = 'General application';
  readonly general = JobApplicationFormComponent.GENERAL;

  jobs: JobPosting[] = [];
  selectedRole = '';
  roleLoadError = false;

  constructor(private readonly jobsService: JobsService) {}

  get selectedJob(): JobPosting | undefined {
    return this.jobs.find((job) => job.title === this.selectedRole);
  }

  ngOnInit(): void {
    this.selectedRole = new URLSearchParams(location.search).get('role') ?? '';
    this.jobsService.getOpenRoles().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        if (this.selectedRole !== this.general && !jobs.some((job) => job.title === this.selectedRole)) {
          this.selectedRole = '';
        }
      },
      error: (error: unknown) => {
        console.error('Open roles could not be loaded for the application form.', error);
        this.roleLoadError = true;
      }
    });
  }

  onRoleChange(event: Event): void {
    if (event.target instanceof HTMLSelectElement) this.selectedRole = event.target.value;
  }

}
