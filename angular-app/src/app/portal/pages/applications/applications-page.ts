import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { timeAgo } from '../../core/format';
import { ApplicationStage, PIPELINE, STAGE_LABELS } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';

@Component({
  selector: 'app-portal-applications',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './applications-page.html'
})
export class ApplicationsPageComponent {
  private readonly data = inject(PortalDataService);
  readonly stageLabels = STAGE_LABELS;
  readonly stages: ApplicationStage[] = [...PIPELINE, 'rejected'];
  readonly timeAgo = timeAgo;

  readonly stage = signal<ApplicationStage | 'active' | 'all'>('active');
  readonly query = signal('');

  readonly stageCounts = computed(() => {
    const counts: Partial<Record<ApplicationStage, number>> = {};
    for (const app of this.data.allApplications()) counts[app.stage] = (counts[app.stage] ?? 0) + 1;
    return counts;
  });

  readonly items = computed(() => {
    const q = this.query().trim().toLowerCase();
    const stage = this.stage();
    return this.data.listApplications().filter((app) => {
      if (stage === 'active' && ['accepted', 'rejected', 'withdrawn'].includes(app.stage)) return false;
      if (stage !== 'active' && stage !== 'all' && app.stage !== stage) return false;
      return !q || [app.name, app.email, app.role, app.reference, app.location].some((v) => v.toLowerCase().includes(q));
    });
  });

  setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  stars(rating: number | null): string {
    return rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';
  }
}
