import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobPosting, JobsService } from '../../core/jobs.service';

@Component({
  selector: 'app-application-page',
  standalone: true,
  templateUrl: './application-page.html'
})
export class ApplicationPageComponent implements OnInit {
  jobs: JobPosting[] = [];
  selectedRole = '';
  roleLoadError = false;
  status = '';

  constructor(
    private readonly jobsService: JobsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedRole = this.route.snapshot.queryParamMap.get('role') ?? '';
    this.jobsService.getOpenRoles().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        if (this.selectedRole !== 'General application' &&
          !jobs.some((job) => job.title === this.selectedRole)) {
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

  onSubmit(event: SubmitEvent): void {
    if (location.protocol !== 'file:' && !['localhost', '127.0.0.1'].includes(location.hostname)) return;
    event.preventDefault();
    this.status = 'Preview mode: your application is ready, but submissions are delivered only after form handling is configured on the deployed site.';
  }
}
