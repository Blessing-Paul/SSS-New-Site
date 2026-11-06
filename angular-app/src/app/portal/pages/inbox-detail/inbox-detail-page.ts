import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { initials, timeAgo } from '../../core/format';
import { INBOXES, INBOX_STATUS_LABELS, InboxKind, InboxStatus, Priority } from '../../core/models';
import { PortalDataService } from '../../core/portal-data.service';

@Component({
  selector: 'app-inbox-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, KeyValuePipe],
  templateUrl: './inbox-detail-page.html'
})
export class InboxDetailPageComponent {
  private readonly data = inject(PortalDataService);
  private readonly auth = inject(AuthService);

  readonly kind = input.required<InboxKind>();
  readonly id = input.required<string>();

  readonly item = computed(() => this.data.getInbox(this.id()));
  readonly config = computed(() => INBOXES[this.kind()]);
  readonly statusLabels = INBOX_STATUS_LABELS;
  readonly timeAgo = timeAgo;
  readonly initials = initials;
  readonly keepOrder = () => 0;

  /** Staff who can own items in this inbox. */
  readonly owners = computed(() => this.data.allStaff()
    .filter((member) => member.active && (member.roles.includes('admin') || this.config().roles.some((role) => member.roles.includes(role)))));

  readonly mode = signal<'reply' | 'note'>('reply');
  readonly draft = signal('');
  readonly afterReply = signal<InboxStatus>('awaiting_customer');
  readonly flash = signal('');

  private get me(): string {
    return this.auth.user()?.name ?? 'Staff';
  }

  greeting(): string {
    const first = this.item()?.contact.name.split(' ').find((part) => !part.endsWith('.')) ?? '';
    return `Hello ${first},\n\n`;
  }

  startReply(): void {
    this.mode.set('reply');
    if (!this.draft()) this.draft.set(this.greeting());
  }

  onDraft(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  send(): void {
    const body = this.draft().trim();
    const item = this.item();
    if (!body || !item) return;
    if (this.mode() === 'reply') {
      this.data.reply(item.id, this.me, body, this.afterReply());
      this.notify(`Reply sent to ${item.contact.email}`);
    } else {
      this.data.addInboxNote(item.id, this.me, body);
      this.notify('Note added (visible to staff only)');
    }
    this.draft.set('');
  }

  setStatus(event: Event): void {
    const item = this.item();
    if (item) this.data.setInboxStatus(item.id, this.me, (event.target as HTMLSelectElement).value as InboxStatus);
  }

  setPriority(event: Event): void {
    const item = this.item();
    if (item) this.data.setPriority(item.id, this.me, (event.target as HTMLSelectElement).value as Priority);
  }

  setAssignee(event: Event): void {
    const item = this.item();
    const value = (event.target as HTMLSelectElement).value;
    if (item) this.data.assign(item.id, this.me, value || null);
  }

  assignToMe(): void {
    const item = this.item();
    const me = this.auth.user();
    if (item && me) this.data.assign(item.id, this.me, me.id);
  }

  setAfterReply(event: Event): void {
    this.afterReply.set((event.target as HTMLSelectElement).value as InboxStatus);
  }

  private notify(message: string): void {
    this.flash.set(message);
    setTimeout(() => this.flash.set(''), 3500);
  }
}
