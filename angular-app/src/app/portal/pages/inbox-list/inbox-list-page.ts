import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { timeAgo } from '../../core/format';
import { INBOXES, INBOX_STATUS_LABELS, InboxKind, InboxStatus } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';

@Component({
  selector: 'app-inbox-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inbox-list-page.html'
})
export class InboxListPageComponent {
  private readonly data = inject(PortalDataService);
  /** Route param bound via withComponentInputBinding. */
  readonly kind = input.required<InboxKind>();

  readonly config = computed(() => INBOXES[this.kind()]);
  readonly statusLabels = INBOX_STATUS_LABELS;
  readonly timeAgo = timeAgo;

  readonly filter = signal<'active' | 'mine' | 'unassigned' | InboxStatus | 'all'>('active');
  readonly query = signal('');

  readonly items = computed(() => {
    const q = this.query().trim().toLowerCase();
    const f = this.filter();
    return this.data.listInbox(this.kind()).filter((item) => {
      if (f === 'active' && ['resolved', 'closed'].includes(item.status)) return false;
      if (f === 'unassigned' && item.assigneeId) return false;
      if (!['active', 'all', 'unassigned', 'mine'].includes(f) && item.status !== f) return false;
      if (!q) return true;
      return [item.reference, item.subject, item.contact.name, item.contact.email, item.contact.organization ?? '']
        .some((value) => value.toLowerCase().includes(q));
    });
  });

  assigneeName(id: string | null): string {
    return id ? this.data.getStaff(id)?.name ?? '—' : 'Unassigned';
  }

  setFilter(event: Event): void {
    this.filter.set((event.target as HTMLSelectElement).value as never);
  }

  setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
