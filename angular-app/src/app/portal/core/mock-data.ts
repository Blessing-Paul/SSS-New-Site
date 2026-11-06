import { InboxItem, StaffApplication, StaffMember } from './models';

/** Sample data used until the Laravel API is connected. Demo password for every account: "portal123". */
const d = (daysAgo: number, hour = 10): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

export const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Amaka Eze', email: 'admin@stableshield.com', phone: '0803 000 0001', roles: ['admin'], discipline: 'admin', department: 'Operations', jobTitle: 'Operations Director', location: 'Abuja', active: true, startedAt: '2021-02-01' },
  { id: 's2', name: 'Tunde Bello', email: 'hr@stableshield.com', phone: '0803 000 0002', roles: ['hr', 'staff'], discipline: 'hr', department: 'People', jobTitle: 'HR Manager', location: 'Abuja', active: true, startedAt: '2022-05-09' },
  { id: 's3', name: 'Grace Okafor', email: 'sales@stableshield.com', phone: '0803 000 0003', roles: ['sales', 'staff'], discipline: 'sales', department: 'Sales', jobTitle: 'Account Manager', location: 'Abuja', active: true, startedAt: '2022-09-12' },
  { id: 's4', name: 'Ibrahim Musa', email: 'support@stableshield.com', phone: '0803 000 0004', roles: ['support', 'staff'], discipline: 'support', department: 'Support', jobTitle: 'Support Lead', location: 'Abuja', active: true, startedAt: '2023-01-16' },
  { id: 's5', name: 'Chidi Nwosu', email: 'chidi@stableshield.com', phone: '0803 000 0005', roles: ['staff'], discipline: 'fullstack', department: 'Engineering', jobTitle: 'Senior Full-stack Developer', location: 'Abuja', active: true, startedAt: '2022-03-07' },
  { id: 's6', name: 'Fatima Sani', email: 'fatima@stableshield.com', phone: '0803 000 0006', roles: ['staff'], discipline: 'uiux', department: 'Design', jobTitle: 'UI/UX Designer', location: 'Remote', active: true, startedAt: '2023-06-01' },
  { id: 's7', name: 'Samuel Adeyemi', email: 'samuel@stableshield.com', phone: '0803 000 0007', roles: ['staff', 'support'], discipline: 'infrastructure', department: 'Infrastructure', jobTitle: 'Systems & Infrastructure Engineer', location: 'Abuja', active: true, startedAt: '2021-11-22' },
  { id: 's8', name: 'Ngozi Obi', email: 'ngozi@stableshield.com', phone: '0803 000 0008', roles: ['staff'], discipline: 'devops', department: 'Infrastructure', jobTitle: 'DevOps Engineer', location: 'Hybrid', active: false, startedAt: '2022-01-10' }
];

const sys = (id: string, body: string, at: string) => ({ id, type: 'event' as const, authorName: 'System', body, createdAt: at });

export const MOCK_INBOX: InboxItem[] = [
  {
    id: 'i1', reference: 'ENQ-1042', kind: 'enquiries', subject: 'School management system for 3 campuses',
    contact: { name: 'Mrs. Adaeze Okon', email: 'principal@brightfuture.edu.ng', phone: '0809 111 2233', organization: 'Bright Future Schools', jobTitle: 'Principal' },
    status: 'new', priority: 'normal', assigneeId: null,
    fields: { 'Organization type': 'School', 'What do you need?': 'Silo products (School, Office, Training & more)', 'Target timeline': 'Within 1–3 months', 'Project details': 'We run three campuses and want one system for admissions, fees and results. Parents should be able to pay online.' },
    thread: [{ id: 'm1', type: 'inbound', authorName: 'Mrs. Adaeze Okon', body: 'We run three campuses and want one system for admissions, fees and results. Parents should be able to pay online.', createdAt: d(0, 9) }],
    createdAt: d(0, 9), updatedAt: d(0, 9)
  },
  {
    id: 'i2', reference: 'ENQ-1041', kind: 'enquiries', subject: 'Network upgrade for head office',
    contact: { name: 'Daniel Etim', email: 'd.etim@kanoagro.com', phone: '0812 555 1020', organization: 'Kano Agro Ltd', jobTitle: 'IT Officer' },
    status: 'open', priority: 'high', assigneeId: 's3',
    fields: { 'Organization type': 'Agriculture', 'What do you need?': 'Networking & connectivity', 'Target timeline': 'As soon as possible', 'Project details': 'Wi-Fi drops constantly across two floors, about 60 staff.' },
    thread: [
      { id: 'm2', type: 'inbound', authorName: 'Daniel Etim', body: 'Wi-Fi drops constantly across two floors, about 60 staff.', createdAt: d(2, 11) },
      sys('m3', 'Assigned to Grace Okafor', d(2, 12)),
      { id: 'm4', type: 'outbound', authorName: 'Grace Okafor', body: 'Hello Daniel, thanks for reaching out. Could we schedule a site survey this week?', createdAt: d(1, 10) },
      { id: 'm5', type: 'note', authorName: 'Grace Okafor', body: 'Samuel can do the survey Thursday.', createdAt: d(1, 10) }
    ],
    createdAt: d(2, 11), updatedAt: d(1, 10)
  },
  {
    id: 'i3', reference: 'MTG-311', kind: 'meetings', subject: 'Video call: cybersecurity review',
    contact: { name: 'Halima Yusuf', email: 'halima@fcthealth.gov.ng', phone: '0703 222 1188', organization: 'FCT Health Board' },
    status: 'new', priority: 'normal', assigneeId: null,
    fields: { 'Preferred date': '2026-11-12', 'Preferred time': 'Morning (9am–12pm)', 'Time zone': 'West Africa Time (WAT, UTC+1)', 'Meeting type': 'Video call', 'Topic': 'Security review of patient records system' },
    thread: [{ id: 'm6', type: 'inbound', authorName: 'Halima Yusuf', body: 'Security review of patient records system', createdAt: d(1, 15) }],
    createdAt: d(1, 15), updatedAt: d(1, 15)
  },
  {
    id: 'i4', reference: 'DEM-208', kind: 'demos', subject: 'Demo: Office Silo for 40 users',
    contact: { name: 'Peter Johnson', email: 'peter@harvestngo.org', phone: '0802 444 9090', organization: 'Harvest NGO' },
    status: 'scheduled', priority: 'normal', assigneeId: 's3',
    fields: { 'Product': 'Office Silo', 'Number of users': '40', 'Message': 'Interested in leave and document workflows.' },
    thread: [
      { id: 'm7', type: 'inbound', authorName: 'Peter Johnson', body: 'Interested in leave and document workflows.', createdAt: d(4, 9) },
      { id: 'm8', type: 'outbound', authorName: 'Grace Okafor', body: 'Thanks Peter, demo booked for Monday 10am. Invite sent.', createdAt: d(3, 14) }
    ],
    createdAt: d(4, 9), updatedAt: d(3, 14)
  },
  {
    id: 'i5', reference: 'SUP-2201', kind: 'support', subject: 'Fees module: payments not reflecting',
    contact: { name: 'Bursar, Unity College', email: 'bursar@unitycollege.edu.ng', phone: '0805 777 3434', organization: 'Unity College' },
    status: 'new', priority: 'critical', assigneeId: null,
    fields: { 'Client / account reference': 'SS-SCH-0087', 'Issue category': 'Error or bug', 'System': 'School Silo', 'Version / module': 'Fees module', 'Users affected': 'A team or department', 'Business impact': 'Parents are paying but receipts are not generated', 'What happened?': 'Since this morning online payments show pending.', 'Steps to reproduce': '1. Pay via parent portal 2. Check bursary dashboard' },
    thread: [{ id: 'm9', type: 'inbound', authorName: 'Bursar, Unity College', body: 'Since this morning online payments show pending.', createdAt: d(0, 8) }],
    createdAt: d(0, 8), updatedAt: d(0, 8)
  },
  {
    id: 'i6', reference: 'SUP-2199', kind: 'support', subject: 'Cannot sign in after password reset',
    contact: { name: 'Mary Obi', email: 'mary@gracechurch.org', organization: 'Grace Assembly' },
    status: 'awaiting_customer', priority: 'normal', assigneeId: 's4',
    fields: { 'Issue category': "Can't sign in / access", 'System': 'Office Silo', 'Users affected': 'Just me', 'What happened?': 'Reset link says expired.' },
    thread: [
      { id: 'm10', type: 'inbound', authorName: 'Mary Obi', body: 'Reset link says expired.', createdAt: d(3, 10) },
      { id: 'm11', type: 'outbound', authorName: 'Ibrahim Musa', body: 'Hi Mary, I have sent a new reset link valid for 24 hours. Please confirm it works.', createdAt: d(2, 9) }
    ],
    createdAt: d(3, 10), updatedAt: d(2, 9)
  },
  {
    id: 'i7', reference: 'PTR-057', kind: 'partners', subject: 'Reseller partnership: North-Central',
    contact: { name: 'Yakubu Danjuma', email: 'yakubu@nctech.ng', phone: '0806 101 2020', organization: 'NC Tech Solutions', jobTitle: 'CEO' },
    status: 'open', priority: 'normal', assigneeId: 's1',
    fields: { 'Partnership type': 'Reseller / referral', 'Products / services': 'School Silo, Office Silo', 'Organization type': 'Reseller / distributor', 'Team size': '11–50', 'Existing customer base': '20–100 organizations', 'Expected annual business you could bring': '₦5m–₦25m', 'Partnership goals': 'Exclusive reseller for Niger and Kogi states.' },
    thread: [{ id: 'm12', type: 'inbound', authorName: 'Yakubu Danjuma', body: 'Exclusive reseller for Niger and Kogi states.', createdAt: d(5, 13) }],
    createdAt: d(5, 13), updatedAt: d(5, 13)
  }
];

export const MOCK_APPLICATIONS: StaffApplication[] = [
  { id: 'a1', reference: 'APP-0315', name: 'Kelechi Umeh', email: 'kelechi.umeh@gmail.com', phone: '0810 333 4545', location: 'Abuja, FCT', portfolio: 'https://github.com/kelechi', role: 'Backend Developer (Laravel)', experience: '3–5 years', availability: '1 month', workEligibility: 'Yes', workArrangement: 'Hybrid', message: 'Built payment integrations for two fintechs.', cvFileName: 'Kelechi_Umeh_CV.pdf', stage: 'applied', rating: null, thread: [], createdAt: d(0, 12), updatedAt: d(0, 12) },
  { id: 'a2', reference: 'APP-0312', name: 'Blessing Ade', email: 'blessing.ade@yahoo.com', phone: '0703 888 1212', location: 'Lagos', portfolio: 'https://dribbble.com/blessing', role: 'UI/UX Designer', experience: '1–3 years', availability: '2 weeks', workEligibility: 'Yes', workArrangement: 'Remote', cvFileName: 'Blessing_Ade_Portfolio.pdf', stage: 'interview', rating: 4, interviewAt: d(-2, 11), thread: [{ id: 't1', type: 'note', authorName: 'Tunde Bello', body: 'Strong portfolio, invite to design task.', createdAt: d(3, 10) }], createdAt: d(6, 9), updatedAt: d(3, 10) },
  { id: 'a3', reference: 'APP-0309', name: 'Musa Garba', email: 'musa.garba@outlook.com', phone: '0814 222 7878', location: 'Kaduna', role: 'Systems & Infrastructure Engineer', experience: '5–10 years', availability: '2–3 months', workEligibility: 'Yes', workArrangement: 'On-site', cvFileName: 'MusaGarba.docx', stage: 'screening', rating: 3, thread: [], createdAt: d(8, 9), updatedAt: d(5, 9) },
  { id: 'a4', reference: 'APP-0301', name: 'Esther Johnson', email: 'esther.j@gmail.com', phone: '0809 555 6060', location: 'Abuja, FCT', role: 'Frontend Developer (Angular)', experience: '3–5 years', availability: 'Immediately', workEligibility: 'Yes', workArrangement: 'Hybrid', cvFileName: 'EstherJohnson_CV.pdf', stage: 'offer', rating: 5, thread: [{ id: 't2', type: 'note', authorName: 'Chidi Nwosu', body: 'Excellent technical interview.', createdAt: d(4, 15) }], createdAt: d(14, 9), updatedAt: d(2, 9) },
  { id: 'a5', reference: 'APP-0297', name: 'Paul Okeke', email: 'paulokeke@gmail.com', phone: '0802 676 1111', location: 'Enugu', role: 'General application', experience: 'Student / graduate', availability: 'Immediately', workEligibility: 'Yes', workArrangement: 'Any', cvFileName: 'Paul_Okeke.pdf', stage: 'rejected', rating: 2, thread: [], createdAt: d(20, 9), updatedAt: d(12, 9) }
];
