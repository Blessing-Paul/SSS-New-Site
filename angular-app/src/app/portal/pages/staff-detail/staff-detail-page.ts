import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { initials } from '../../core/format';
import { DEPARTMENTS, DISCIPLINE_LABELS, Discipline, ROLE_LABELS, Role, StaffMember } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';
import { signal } from '@angular/core';

/** Used for /portal/staff/:id, /portal/staff/new and /portal/profile (data.self). */
@Component({
  selector: 'app-staff-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './staff-detail-page.html'
})
export class StaffDetailPageComponent {
  private readonly data = inject(PortalDataService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id = input<string>();
  readonly self = !!this.route.snapshot.data['self'];
  readonly isNew = computed(() => this.id() === 'new');
  readonly welcome = !!this.route.snapshot.queryParamMap.get('welcome');

  readonly member = computed<StaffMember | undefined>(() => {
    if (this.self) return this.data.getStaff(this.auth.user()?.id ?? '');
    if (this.isNew()) return undefined;
    return this.data.getStaff(this.id() ?? '');
  });
  readonly application = computed(() => { const m = this.member(); return m?.applicationId ? this.data.getApplication(m.applicationId) : undefined; });

  readonly canManage = computed(() => { this.auth.user(); return this.auth.hasAnyRole(['hr']); });
  readonly isMe = computed(() => this.member()?.id === this.auth.user()?.id);
  /** HR/admin edit everything; staff edit their own contact details only. */
  readonly editable = computed(() => this.canManage() || this.isMe());

  readonly roles = Object.keys(ROLE_LABELS) as Role[];
  readonly roleLabels = ROLE_LABELS;
  readonly disciplines = Object.entries(DISCIPLINE_LABELS) as [Discipline, string][];
  readonly disciplineLabels = DISCIPLINE_LABELS;
  readonly departments = DEPARTMENTS;
  readonly initials = initials;
  readonly flash = signal('');
  readonly today = new Date().toISOString().slice(0, 10);

  roleList(roles: Role[]): string {
    return roles.map((role) => ROLE_LABELS[role]).join(', ');
  }

  save(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? '').trim();
    const contact = { phone: text('phone'), location: text('location') };
    const work = this.canManage() ? {
      name: text('name'), email: text('email'), jobTitle: text('job_title'), department: text('department'),
      discipline: text('discipline') as Discipline, startedAt: text('start_date'),
      roles: (data.getAll('roles[]').map(String) as Role[])
    } : {};
    if (this.canManage() && !(work as { roles: Role[] }).roles.length) (work as { roles: Role[] }).roles = ['staff'];

    if (this.isNew()) {
      const created = this.data.createStaff({ ...(work as Omit<StaffMember, 'id'>), ...contact, active: true });
      void this.router.navigate(['/portal/staff', created.id]);
      return;
    }
    const member = this.member();
    if (!member) return;
    const updated = this.data.updateStaff(member.id, { ...work, ...contact });
    if (updated && this.isMe()) this.auth.setUser(updated);
    this.notify('Changes saved');
  }

  toggleActive(): void {
    const member = this.member();
    if (!member || this.isMe()) return;
    this.data.updateStaff(member.id, { active: !member.active });
    this.notify(member.active ? 'Account deactivated. They can no longer sign in.' : 'Account reactivated');
  }

  private notify(message: string): void {
    this.flash.set(message);
    setTimeout(() => this.flash.set(''), 3500);
  }
}
