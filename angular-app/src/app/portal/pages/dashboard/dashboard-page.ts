import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { timeAgo } from '../../core/format';
import { INBOXES, INBOX_STATUS_LABELS, InboxKind, STAGE_LABELS } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.html'
})
export class DashboardPageComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(PortalDataService);
  readonly user = this.auth.user;
  readonly timeAgo = timeAgo;
  readonly statusLabels = INBOX_STATUS_LABELS;
  readonly stageLabels = STAGE_LABELS;
  readonly inboxes = INBOXES;

  readonly greeting = (() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  })();

  readonly tiles = computed(() => {
    const counts = this.data.counts();
    const tiles = (Object.values(INBOXES))
      .filter((box) => this.auth.hasAnyRole(box.roles))
      .map((box) => ({
        label: box.title,
        icon: box.icon,
        link: `/portal/inbox/${box.kind}`,
        open: counts[box.kind].open,
        fresh: counts[box.kind].new,
        description: `Open ${box.singular}${counts[box.kind].open === 1 ? '' : 's'} to review`,
        action: `View ${box.title.toLowerCase()}`
      }));
    if (this.auth.hasAnyRole(['hr'])) {
      tiles.push({
        label: 'Staff applications',
        icon: 'bi-person-plus',
        link: '/portal/applications',
        open: counts.applications.open,
        fresh: counts.applications.new,
        description: 'Candidates moving through hiring',
        action: 'View applications'
      });
    }
    tiles.push({
      label: 'Active staff',
      icon: 'bi-people',
      link: '/portal/staff',
      open: counts.staff.open,
      fresh: 0,
      description: 'Active people in the staff directory',
      action: 'View staff'
    });
    return tiles;
  });

  readonly workTiles = computed(() => this.tiles().filter((tile) => tile.link.includes('/inbox/')));
  readonly peopleTiles = computed(() => this.tiles().filter((tile) => !tile.link.includes('/inbox/')));

  readonly myQueue = computed(() => {
    const me = this.user();
    return this.data.allInbox()
      .filter((item) => item.assigneeId === me?.id && !['resolved', 'closed'].includes(item.status))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  });

  readonly unassigned = computed(() => this.data.allInbox()
    .filter((item) => !item.assigneeId && this.auth.hasAnyRole(INBOXES[item.kind as InboxKind].roles))
    .sort((a, b) => (b.priority === 'critical' ? 1 : 0) - (a.priority === 'critical' ? 1 : 0) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6));

  readonly canSeeHiring = computed(() => { this.user(); return this.auth.hasAnyRole(['hr']); });
  readonly pipeline = computed(() => this.data.listApplications().filter((a) => !['accepted', 'rejected', 'withdrawn'].includes(a.stage)).slice(0, 5));
}
