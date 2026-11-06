import { Injectable, computed, signal } from '@angular/core';
import { MOCK_APPLICATIONS, MOCK_INBOX, MOCK_STAFF } from './mock-data';
import {
  ApplicationStage,
  Discipline,
  INBOX_STATUS_LABELS,
  InboxItem,
  InboxKind,
  InboxStatus,
  Priority,
  Role,
  STAGE_LABELS,
  StaffApplication,
  StaffMember,
  ThreadMessage,
} from './models';

export interface AcceptApplicationInput {
  roles: Role[];
  discipline: Discipline;
  department: string;
  jobTitle: string;
  startedAt: string;
  email: string;
}

/**
 * In-memory store for the portal while the Laravel API is not connected.
 * Every public method maps 1:1 to an endpoint in docs/backend-api-spec.md;
 * swap the bodies for HttpClient calls when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class PortalDataService {
  private readonly inbox = signal<InboxItem[]>(structuredClone(MOCK_INBOX));
  private readonly applications = signal<StaffApplication[]>(structuredClone(MOCK_APPLICATIONS));
  private readonly staff = signal<StaffMember[]>(structuredClone(MOCK_STAFF));

  readonly allInbox = this.inbox.asReadonly();
  readonly allApplications = this.applications.asReadonly();
  readonly allStaff = this.staff.asReadonly();

  readonly counts = computed(() => {
    const open = (kind: InboxKind) =>
      this.inbox().filter(
        (item) => item.kind === kind && !['resolved', 'closed'].includes(item.status),
      ).length;
    const fresh = (kind: InboxKind) =>
      this.inbox().filter((item) => item.kind === kind && item.status === 'new').length;
    return {
      enquiries: { open: open('enquiries'), new: fresh('enquiries') },
      meetings: { open: open('meetings'), new: fresh('meetings') },
      demos: { open: open('demos'), new: fresh('demos') },
      support: { open: open('support'), new: fresh('support') },
      partners: { open: open('partners'), new: fresh('partners') },
      applications: {
        open: this.applications().filter(
          (a) => !['accepted', 'rejected', 'withdrawn'].includes(a.stage),
        ).length,
        new: this.applications().filter((a) => a.stage === 'applied').length,
      },
      staff: { open: this.staff().filter((s) => s.active).length, new: 0 },
    };
  });

  /* ---------- Inbox ---------- */

  listInbox(kind: InboxKind): InboxItem[] {
    return this.inbox()
      .filter((item) => item.kind === kind)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getInbox(id: string): InboxItem | undefined {
    return this.inbox().find((item) => item.id === id);
  }

  /** POST /api/inbox/{id}/replies — emails the contact and logs it on the thread. */
  reply(
    id: string,
    author: string,
    body: string,
    nextStatus: InboxStatus = 'awaiting_customer',
  ): void {
    this.updateInbox(id, (item) => {
      item.thread.push(this.message('outbound', author, body));
      if (item.status !== nextStatus) {
        item.thread.push(
          this.message('event', author, `Status changed to ${INBOX_STATUS_LABELS[nextStatus]}`),
        );
        item.status = nextStatus;
      }
    });
  }

  /** POST /api/inbox/{id}/notes — internal, never emailed. */
  addInboxNote(id: string, author: string, body: string): void {
    this.updateInbox(id, (item) => item.thread.push(this.message('note', author, body)));
  }

  /** PATCH /api/inbox/{id} { status } */
  setInboxStatus(id: string, author: string, status: InboxStatus): void {
    this.updateInbox(id, (item) => {
      if (item.status === status) return;
      item.status = status;
      item.thread.push(
        this.message('event', author, `Status changed to ${INBOX_STATUS_LABELS[status]}`),
      );
    });
  }

  /** PATCH /api/inbox/{id} { priority } */
  setPriority(id: string, author: string, priority: Priority): void {
    this.updateInbox(id, (item) => {
      if (item.priority === priority) return;
      item.priority = priority;
      item.thread.push(this.message('event', author, `Priority set to ${priority}`));
    });
  }

  /** PATCH /api/inbox/{id} { assignee_id } */
  assign(id: string, author: string, assigneeId: string | null): void {
    const name = assigneeId ? (this.getStaff(assigneeId)?.name ?? 'someone') : null;
    this.updateInbox(id, (item) => {
      if (item.assigneeId === assigneeId) return;
      item.assigneeId = assigneeId;
      if (assigneeId && item.status === 'new') item.status = 'open';
      item.thread.push(this.message('event', author, name ? `Assigned to ${name}` : 'Unassigned'));
    });
  }

  /* ---------- Staff applications ---------- */

  listApplications(): StaffApplication[] {
    return [...this.applications()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getApplication(id: string): StaffApplication | undefined {
    return this.applications().find((app) => app.id === id);
  }

  /** PATCH /api/staff-applications/{id} { stage } */
  setStage(id: string, author: string, stage: ApplicationStage): void {
    this.updateApplication(id, (app) => {
      if (app.stage === stage) return;
      app.stage = stage;
      app.thread.push(this.message('event', author, `Moved to ${STAGE_LABELS[stage]}`));
    });
  }

  /** PATCH /api/staff-applications/{id} { rating } */
  rate(id: string, rating: number): void {
    this.updateApplication(id, (app) => {
      app.rating = rating;
    });
  }

  /** PATCH /api/staff-applications/{id} { interview_at } */
  scheduleInterview(id: string, author: string, when: string): void {
    this.updateApplication(id, (app) => {
      app.interviewAt = new Date(when).toISOString();
      if (['applied', 'screening'].includes(app.stage)) app.stage = 'interview';
      app.thread.push(
        this.message('event', author, `Interview scheduled for ${new Date(when).toLocaleString()}`),
      );
    });
  }

  addApplicationNote(id: string, author: string, body: string): void {
    this.updateApplication(id, (app) => app.thread.push(this.message('note', author, body)));
  }

  /** POST /api/staff-applications/{id}/messages — emails the candidate. */
  messageCandidate(id: string, author: string, body: string): void {
    this.updateApplication(id, (app) => app.thread.push(this.message('outbound', author, body)));
  }

  /** POST /api/staff-applications/{id}/reject */
  reject(id: string, author: string, message: string): void {
    this.updateApplication(id, (app) => {
      if (message.trim()) app.thread.push(this.message('outbound', author, message));
      app.stage = 'rejected';
      app.thread.push(this.message('event', author, 'Application rejected'));
    });
  }

  /**
   * POST /api/staff-applications/{id}/accept
   * Creates the staff account from the application and links them.
   */
  accept(id: string, author: string, input: AcceptApplicationInput): StaffMember | undefined {
    const app = this.getApplication(id);
    if (!app || app.staffId) return undefined;
    const member: StaffMember = {
      id: `s${Date.now()}`,
      name: app.name,
      email: input.email,
      phone: app.phone,
      roles: input.roles.length ? input.roles : ['staff'],
      discipline: input.discipline,
      department: input.department,
      jobTitle: input.jobTitle,
      location: app.location,
      active: true,
      startedAt: input.startedAt,
      applicationId: app.id,
    };
    this.staff.update((list) => [...list, member]);
    this.updateApplication(id, (draft) => {
      draft.stage = 'accepted';
      draft.staffId = member.id;
      draft.thread.push(
        this.message('event', author, `Hired. Staff account created for ${member.email}`),
      );
    });
    return member;
  }

  /* ---------- Staff ---------- */

  getStaff(id: string): StaffMember | undefined {
    return this.staff().find((member) => member.id === id);
  }

  /** PATCH /api/staff/{id} */
  updateStaff(id: string, changes: Partial<StaffMember>): StaffMember | undefined {
    let updated: StaffMember | undefined;
    this.staff.update((list) =>
      list.map((member) => {
        if (member.id !== id) return member;
        updated = { ...member, ...changes, id };
        return updated;
      }),
    );
    return updated;
  }

  /** POST /api/staff (direct creation by admin/HR, e.g. existing employees) */
  createStaff(member: Omit<StaffMember, 'id'>): StaffMember {
    const created = { ...member, id: `s${Date.now()}` };
    this.staff.update((list) => [...list, created]);
    return created;
  }

  /* ---------- helpers ---------- */

  private message(type: ThreadMessage['type'], authorName: string, body: string): ThreadMessage {
    return {
      id: `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
      type,
      authorName,
      body,
      createdAt: new Date().toISOString(),
    };
  }

  private updateInbox(id: string, change: (item: InboxItem) => void): void {
    this.inbox.update((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        const draft = structuredClone(item);
        change(draft);
        draft.updatedAt = new Date().toISOString();
        return draft;
      }),
    );
  }

  private updateApplication(id: string, change: (app: StaffApplication) => void): void {
    this.applications.update((list) =>
      list.map((app) => {
        if (app.id !== id) return app;
        const draft = structuredClone(app);
        change(draft);
        draft.updatedAt = new Date().toISOString();
        return draft;
      }),
    );
  }
}
