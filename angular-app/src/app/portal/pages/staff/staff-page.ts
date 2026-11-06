import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { initials } from '../../core/format';
import { DEPARTMENTS, DISCIPLINE_LABELS, ROLE_LABELS } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';

@Component({
  selector: 'app-portal-staff',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './staff-page.html'
})
export class StaffPageComponent {
  private readonly data = inject(PortalDataService);
  private readonly auth = inject(AuthService);
  readonly disciplineLabels = DISCIPLINE_LABELS;
  readonly roleLabels = ROLE_LABELS;
  readonly departments = DEPARTMENTS;
  readonly initials = initials;
  readonly canManage = computed(() => { this.auth.user(); return this.auth.hasAnyRole(['hr']); });

  readonly query = signal('');
  readonly department = signal('');
  readonly showInactive = signal(false);

  readonly members = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.data.allStaff()
      .filter((m) => (this.showInactive() && this.canManage()) || m.active)
      .filter((m) => !this.department() || m.department === this.department())
      .filter((m) => !q || [m.name, m.email, m.jobTitle, DISCIPLINE_LABELS[m.discipline]].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  setQuery(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
  setDepartment(event: Event): void { this.department.set((event.target as HTMLSelectElement).value); }
  setInactive(event: Event): void { this.showInactive.set((event.target as HTMLInputElement).checked); }
}
