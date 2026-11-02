import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

@Injectable({ providedIn: 'root' })
export class JobsService {
  constructor(private readonly http: HttpClient) {}

  getOpenRoles(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>('/data/jobs.json');
  }
}
