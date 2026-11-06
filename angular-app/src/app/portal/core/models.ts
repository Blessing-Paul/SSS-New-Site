/**
 * Portal domain models. These mirror the Laravel API resources described in
 * docs/backend-api-spec.md; keep both in sync.
 */

export type Role = 'admin' | 'hr' | 'sales' | 'support' | 'staff';

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  hr: 'Human resources',
  sales: 'Sales',
  support: 'Support',
  staff: 'Staff',
};

/** Job discipline of a staff member (what they do), separate from portal role (what they can access). */
export type Discipline =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'mobile'
  | 'devops'
  | 'infrastructure'
  | 'network'
  | 'security'
  | 'qa'
  | 'uiux'
  | 'project'
  | 'support'
  | 'sales'
  | 'hr'
  | 'admin'
  | 'other';

export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  frontend: 'Frontend developer',
  backend: 'Backend developer',
  fullstack: 'Full-stack developer',
  mobile: 'Mobile developer',
  devops: 'DevOps engineer',
  infrastructure: 'Systems & infrastructure engineer',
  network: 'Network engineer',
  security: 'Cybersecurity analyst',
  qa: 'QA / test engineer',
  uiux: 'UI/UX designer',
  project: 'Project manager',
  support: 'IT support specialist',
  sales: 'Sales & account manager',
  hr: 'HR & people officer',
  admin: 'Operations & administration',
  other: 'Other',
};

export const DEPARTMENTS = [
  'Engineering',
  'Infrastructure',
  'Design',
  'Support',
  'Sales',
  'People',
  'Operations',
] as const;

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  discipline: Discipline;
  department: string;
  jobTitle: string;
  location: string;
  active: boolean;
  startedAt: string;
  /** Set when the staff record was created by accepting an application. */
  applicationId?: string;
}

/* ---------- Inbox (enquiries, meetings, demos, support, partners) ---------- */

export type InboxKind = 'enquiries' | 'meetings' | 'demos' | 'support' | 'partners';

export type InboxStatus =
  | 'new'
  | 'open'
  | 'awaiting_customer'
  | 'scheduled'
  | 'resolved'
  | 'closed';

export const INBOX_STATUS_LABELS: Record<InboxStatus, string> = {
  new: 'New',
  open: 'In progress',
  awaiting_customer: 'Awaiting reply',
  scheduled: 'Scheduled',
  resolved: 'Resolved',
  closed: 'Closed',
};

export type Priority = 'normal' | 'high' | 'critical';

export interface Contact {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
}

/** One message on a conversation. `outbound` = emailed to the contact, `note` = internal only. */
export interface ThreadMessage {
  id: string;
  type: 'inbound' | 'outbound' | 'note' | 'event';
  authorName: string;
  body: string;
  createdAt: string;
}

export interface InboxItem {
  id: string;
  /** Human reference shown to staff and customers, e.g. ENQ-1042, SUP-2201. */
  reference: string;
  kind: InboxKind;
  subject: string;
  contact: Contact;
  status: InboxStatus;
  priority: Priority;
  assigneeId: string | null;
  /** The original form answers (label → value), exactly as submitted. */
  fields: Record<string, string>;
  thread: ThreadMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface InboxConfig {
  kind: InboxKind;
  title: string;
  singular: string;
  icon: string;
  prefix: string;
  roles: Role[];
  /** Statuses that make sense for this inbox, in workflow order. */
  statuses: InboxStatus[];
}

export const INBOXES: Record<InboxKind, InboxConfig> = {
  enquiries: {
    kind: 'enquiries',
    title: 'Project enquiries',
    singular: 'enquiry',
    icon: 'bi-chat-square-text',
    prefix: 'ENQ',
    roles: ['admin', 'sales'],
    statuses: ['new', 'open', 'awaiting_customer', 'resolved', 'closed'],
  },
  meetings: {
    kind: 'meetings',
    title: 'Meeting requests',
    singular: 'meeting request',
    icon: 'bi-calendar-event',
    prefix: 'MTG',
    roles: ['admin', 'sales'],
    statuses: ['new', 'open', 'scheduled', 'closed'],
  },
  demos: {
    kind: 'demos',
    title: 'Demo requests',
    singular: 'demo request',
    icon: 'bi-play-btn',
    prefix: 'DEM',
    roles: ['admin', 'sales'],
    statuses: ['new', 'open', 'scheduled', 'resolved', 'closed'],
  },
  support: {
    kind: 'support',
    title: 'Support tickets',
    singular: 'ticket',
    icon: 'bi-headset',
    prefix: 'SUP',
    roles: ['admin', 'support'],
    statuses: ['new', 'open', 'awaiting_customer', 'resolved', 'closed'],
  },
  partners: {
    kind: 'partners',
    title: 'Partner applications',
    singular: 'partner application',
    icon: 'bi-people',
    prefix: 'PTR',
    roles: ['admin', 'sales'],
    statuses: ['new', 'open', 'awaiting_customer', 'resolved', 'closed'],
  },
};

/* ---------- Staff applications (hiring pipeline) ---------- */

export type ApplicationStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const PIPELINE: ApplicationStage[] = [
  'applied',
  'screening',
  'interview',
  'offer',
  'accepted',
];

export interface StaffApplication {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  portfolio?: string;
  role: string;
  jobId?: string;
  experience: string;
  availability: string;
  workEligibility: string;
  workArrangement: string;
  message?: string;
  cvFileName: string;
  cvUrl?: string;
  stage: ApplicationStage;
  rating: number | null;
  interviewAt?: string;
  thread: ThreadMessage[];
  /** Filled once accepted and converted into a staff account. */
  staffId?: string;
  createdAt: string;
  updatedAt: string;
}
