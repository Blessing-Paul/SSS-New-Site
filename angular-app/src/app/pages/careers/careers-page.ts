import { Component, OnInit } from '@angular/core';
import { JobPosting, JobsService } from '../../core/jobs.service';

@Component({
  selector: 'app-careers-page',
  standalone: true,
  templateUrl: './careers-page.html'
})
export class CareersPageComponent implements OnInit {
  jobs: JobPosting[] = [];
  departments: string[] = ['All'];
  selectedDepartment = 'All';
  selectedRole = '';
  loadFailed = false;

  constructor(private readonly jobsService: JobsService) {}

  ngOnInit(): void {
    this.jobsService.getOpenRoles().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.departments = ['All', ...new Set(jobs.map((job) => job.department))];
      },
      error: (error: unknown) => {
        console.error('Open roles could not be loaded.', error);
        this.loadFailed = true;
      }
    });
  }

  get visibleJobs(): JobPosting[] {
    return this.selectedDepartment === 'All'
      ? this.jobs
      : this.jobs.filter((job) => job.department === this.selectedDepartment);
  }

  onRoleChange(event: Event): void {
    if (event.target instanceof HTMLSelectElement) this.selectedRole = event.target.value;
  }

  applicationUrl(role: string): string {
    return `/apply?role=${encodeURIComponent(role)}`;
  }
}
