import { Component, HostListener, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { DISCIPLINE_LABELS, INBOXES, ROLE_LABELS, Role } from '../core/models';
import { PortalDataService } from '../core/portal-data.service';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  roles?: Role[];
  badge?: () => number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgbCollapseModule, NgbDropdownModule, NgbTooltipModule],
  templateUrl: './portal-layout.html',
  /** Global (unencapsulated) so child pages share it; loaded only with the portal chunk. */
  styleUrl: './portal.css',
  encapsulation: ViewEncapsulation.None
})
export class PortalLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly data = inject(PortalDataService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly menuOpen = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly roleLabels = ROLE_LABELS;
  readonly disciplineLabels = DISCIPLINE_LABELS;

  private readonly sections: NavSection[] = [
    { title: 'Overview', items: [{ label: 'Dashboard', icon: 'bi-grid-1x2', link: '/portal' }] },
    {
      title: 'Inboxes',
      items: (Object.values(INBOXES)).map((box) => ({
        label: box.title, icon: box.icon, link: `/portal/inbox/${box.kind}`, roles: box.roles,
        badge: () => this.data.counts()[box.kind].new
      }))
    },
    {
      title: 'People',
      items: [
        { label: 'Staff applications', icon: 'bi-person-plus', link: '/portal/applications', roles: ['hr'], badge: () => this.data.counts().applications.new },
        { label: 'Staff directory', icon: 'bi-people', link: '/portal/staff' }
      ]
    },
    { title: 'Account', items: [{ label: 'My profile', icon: 'bi-person-circle', link: '/portal/profile' }] }
  ];

  readonly nav = computed(() => {
    this.user();
    return this.sections
      .map((section) => ({ ...section, items: section.items.filter((item) => this.auth.hasAnyRole(item.roles)) }))
      .filter((section) => section.items.length);
  });

  readonly searchResults = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (query.length < 2) return [];

    const inboxResults = this.data.allInbox()
      .filter((item) => this.auth.hasAnyRole(INBOXES[item.kind].roles))
      .filter((item) => [item.reference, item.subject, item.contact.name, item.contact.email,
        item.contact.organization ?? '', ...Object.values(item.fields),
        ...item.thread.map((message) => message.body)]
        .some((value) => value.toLowerCase().includes(query)))
      .map((item) => ({
        label: item.subject,
        detail: `${INBOXES[item.kind].title} · ${item.reference} · ${item.contact.name}`,
        icon: INBOXES[item.kind].icon,
        link: `/portal/inbox/${item.kind}/${item.id}`
      }));

    const applicationResults = this.auth.hasAnyRole(['hr'])
      ? this.data.allApplications()
        .filter((app) => [app.reference, app.name, app.email, app.role, app.location]
          .some((value) => value.toLowerCase().includes(query)))
        .map((app) => ({
          label: app.name,
          detail: `Staff application · ${app.reference} · ${app.role}`,
          icon: 'bi-person-plus',
          link: `/portal/applications/${app.id}`
        }))
      : [];

    const staffResults = this.data.allStaff()
      .filter((member) => member.active || this.auth.hasAnyRole(['hr']))
      .filter((member) => [member.name, member.email, member.jobTitle, member.department]
        .some((value) => value.toLowerCase().includes(query)))
      .map((member) => ({
        label: member.name,
        detail: `Staff · ${member.jobTitle} · ${member.email}`,
        icon: 'bi-people',
        link: `/portal/staff/${member.id}`
      }));

    return [...inboxResults, ...applicationResults, ...staffResults].slice(0, 8);
  });

  readonly initials = computed(() => (this.user()?.name ?? '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase());

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.menuOpen.set(false);
    });
  }

  toggleTheme(): void {
    const dark = document.documentElement.dataset['theme'] !== 'dark';
    document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  setSearchQuery(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.searchOpen.set(true);
  }

  closeSearch(): void {
    this.searchOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeSearchOutside(event: MouseEvent): void {
    if (!(event.target instanceof Element) || !event.target.closest('.pt-global-search')) {
      this.searchOpen.set(false);
    }
  }
}
