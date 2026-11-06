import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { initials, timeAgo } from '../../core/format';
import { DEPARTMENTS, DISCIPLINE_LABELS, Discipline, PIPELINE, ROLE_LABELS, Role, STAGE_LABELS } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';

type Panel = 'none' | 'message' | 'note' | 'interview' | 'reject' | 'hire';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './application-detail-page.html'
})
export class ApplicationDetailPageComponent {
  private readonly data = inject(PortalDataService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  readonly app = computed(() => this.data.getApplication(this.id()));
  readonly hiredStaff = computed(() => { const a = this.app(); return a?.staffId ? this.data.getStaff(a.staffId) : undefined; });

  readonly pipeline = PIPELINE;
  readonly stageLabels = STAGE_LABELS;
  readonly roleLabels = ROLE_LABELS;
  readonly roles = Object.keys(ROLE_LABELS) as Role[];
  readonly disciplines = Object.entries(DISCIPLINE_LABELS) as [Discipline, string][];
  readonly departments = DEPARTMENTS;
  readonly timeAgo = timeAgo;
  readonly initials = initials;

  readonly panel = signal<Panel>('none');
  readonly flash = signal('');
  readonly today = new Date().toISOString().slice(0, 10);

  readonly closed = computed(() => ['accepted', 'rejected', 'withdrawn'].includes(this.app()?.stage ?? ''));
  readonly stageIndex = computed(() => this.pipeline.indexOf(this.app()?.stage as never));
  readonly nextStage = computed(() => {
    const i = this.stageIndex();
    return i >= 0 && i < this.pipeline.length - 2 ? this.pipeline[i + 1] : null;
  });

  /** Suggested company email for a new hire: firstname@stableshield.com */
  readonly suggestedEmail = computed(() => `${(this.app()?.name.split(' ')[0] ?? 'new').toLowerCase().replace(/[^a-z]/g, '')}@stableshield.com`);

  private get me(): string {
    return this.auth.user()?.name ?? 'HR';
  }

  open(panel: Panel): void {
    this.panel.set(this.panel() === panel ? 'none' : panel);
  }

  advance(): void {
    const next = this.nextStage();
    const app = this.app();
    if (next && app) this.data.setStage(app.id, this.me, next);
  }

  rate(value: number): void {
    const app = this.app();
    if (app) this.data.rate(app.id, value);
  }

  submitText(event: SubmitEvent, kind: 'message' | 'note' | 'reject'): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const body = String(new FormData(form).get('body') ?? '').trim();
    const app = this.app();
    if (!app) return;
    if (kind === 'message' && body) { this.data.messageCandidate(app.id, this.me, body); this.notify(`Email sent to ${app.email}`); }
    if (kind === 'note' && body) { this.data.addApplicationNote(app.id, this.me, body); this.notify('Note added'); }
    if (kind === 'reject') { this.data.reject(app.id, this.me, body); this.notify('Application rejected'); }
    form.reset();
    this.panel.set('none');
  }

  submitInterview(event: SubmitEvent): void {
    event.preventDefault();
    const app = this.app();
    const when = String(new FormData(event.target as HTMLFormElement).get('when') ?? '');
    if (!app || !when) return;
    this.data.scheduleInterview(app.id, this.me, when);
    this.notify('Interview scheduled');
    this.panel.set('none');
  }

  submitHire(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const app = this.app();
    if (!app) return;
    const member = this.data.accept(app.id, this.me, {
      email: String(data.get('email')),
      jobTitle: String(data.get('job_title')),
      department: String(data.get('department')),
      discipline: String(data.get('discipline')) as Discipline,
      roles: data.getAll('roles[]').map(String) as Role[],
      startedAt: String(data.get('start_date'))
    });
    if (member) void this.router.navigate(['/portal/staff', member.id], { queryParams: { welcome: 1 } });
  }

  private notify(message: string): void {
    this.flash.set(message);
    setTimeout(() => this.flash.set(''), 3500);
  }
}
