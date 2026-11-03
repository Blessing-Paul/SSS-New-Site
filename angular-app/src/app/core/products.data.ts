export interface ProductModule {
  icon: string;
  title: string;
  items: string[];
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  summary: string;
  overview: string[];
  highlight: { title: string; detail: string };
  targetUsers: string[];
  modules: ProductModule[];
  industries: string[];
  primaryIndustry: string;
  otherSectors: string;
  flagship?: boolean;
  image?: string;
}

export interface ProductCategory {
  slug: string;
  letter: string;
  name: string;
  short: string;
  icon: string;
  description: string;
  industries: string[];
}

export interface ProductIntegration {
  products: string[];
  title: string;
  description: string;
}

export interface SectorEcosystem {
  sector: string;
  icon: string;
  scenario: string;
  products: string[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: 'school',
    letter: 'A',
    name: 'School Management',
    short: 'Schools',
    icon: 'bi-backpack',
    description: 'Our flagship school application: admissions, classes, results, fees and parent communication, from creche to secondary school.',
    industries: ['Daycare & creche', 'Nursery & primary schools', 'Secondary schools', 'Multi-campus school groups', 'Educational boards & networks']
  },
  {
    slug: 'business',
    letter: 'B',
    name: 'Business, Commerce & Enterprise Management',
    short: 'Business & Commerce',
    icon: 'bi-shop',
    description: 'Solutions that support commercial activity, business operations, property administration and cooperative finance.',
    industries: ['SMEs', 'Corporate organisations', 'Retail & wholesale', 'Real estate & property', 'Commercial markets', 'Cooperative societies', 'Estate administration']
  },
  {
    slug: 'organisational',
    letter: 'C',
    name: 'Organisational & Institutional Management',
    short: 'Organisational',
    icon: 'bi-buildings',
    description: 'Solutions that improve administrative efficiency, institutional coordination, workplace operations and campus administration.',
    industries: ['Government MDAs', 'Corporate organisations', 'Universities & polytechnics', 'Colleges & training institutions', 'Public & private institutions', 'NGOs']
  },
  {
    slug: 'identity-finance',
    letter: 'D',
    name: 'Identity, Revenue & Financial Management',
    short: 'Identity & Finance',
    icon: 'bi-shield-lock',
    description: 'Solutions for identity administration, revenue generation, financial operations and institutional payments.',
    industries: ['Government institutions', 'Revenue authorities', 'Financial organisations', 'Public administration', 'Private enterprises', 'Membership organisations']
  },
  {
    slug: 'education',
    letter: 'E',
    name: 'Education, Learning & Assessment',
    short: 'Learning & Assessment',
    icon: 'bi-mortarboard',
    description: 'Solutions for digital learning, professional development, examinations and certification.',
    industries: ['Primary & secondary education', 'Tertiary institutions', 'Government training agencies', 'Professional associations', 'Religious organisations', 'Examination bodies']
  },
  {
    slug: 'membership',
    letter: 'F',
    name: 'Membership & Community Management',
    short: 'Membership',
    icon: 'bi-people',
    description: 'Solutions for organisations that manage registered members, subscriptions, participation and member services.',
    industries: ['Professional associations', 'Cooperative societies', 'Religious organisations', 'Clubs & societies', 'Trade unions', 'Alumni associations']
  },
  {
    slug: 'specialised',
    letter: 'G',
    name: 'Specialised Industry Management',
    short: 'Specialised Industry',
    icon: 'bi-gear-wide-connected',
    description: 'Solutions built around the operational and administrative requirements of specific industries.',
    industries: ['Hospitals & clinics', 'Diagnostic centres', 'Vehicle dealerships', 'Fleet operators', 'Transport & logistics', 'Vehicle regulators']
  }
];

export const PRODUCTS: Product[] = [
  {
    slug: 'school-silo',
    name: 'School Silo',
    category: 'school',
    icon: 'bi-backpack',
    flagship: true,
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&h=900&q=80',
    tagline: 'Run your whole school from one place.',
    summary: 'Admissions, classes, results, fees and parent communication, from creche to secondary school.',
    overview: [
      "From the morning check-in at the creche to the final report card in SS3, School Silo brings admissions, classes, results, fees and parent communication together, so your staff spend less time on paperwork and parents always know what's going on.",
      "School Silo replaces paper records, notebook fee tracking and endless phone calls with one secure system that every authorised person can reach, from the proprietor's office to a parent's phone."
    ],
    highlight: { title: 'Results published', detail: 'Report cards ready · parents notified instantly' },
    targetUsers: ['Daycare & creche', 'Nursery & primary schools', 'Secondary schools', 'Multi-campus school groups', 'Educational boards & networks', 'Proprietors & school administrators'],
    modules: [
      { icon: 'bi-person-plus', title: 'Admissions', items: ['Online application forms & uploads', 'Entrance exam scheduling', 'Offers, acceptance & student records'] },
      { icon: 'bi-journal-text', title: 'Results & report cards', items: ['Continuous assessment & exam scores', 'Grading, ranking & comments', 'Report cards published with approval'] },
      { icon: 'bi-cash-coin', title: 'Fees & payments', items: ['Fee structures by class & term', 'Online payment & receipts', 'Overdue reminders & debtor reports'] },
      { icon: 'bi-phone', title: 'Parent portal', items: ['Attendance, results & homework', 'Fee balances & school notices', 'Several children, one account'] },
      { icon: 'bi-person-workspace', title: "Teacher's workspace", items: ['Class lists & attendance', 'Lesson plans & homework', 'Score entry for assigned classes'] },
      { icon: 'bi-laptop', title: 'Exams & CBT', items: ['Question banks & scheduling', 'Automatic marking', 'Controlled result publication'] },
      { icon: 'bi-balloon', title: 'Early years care', items: ['Check-in & check-out', 'Authorised pickup contacts', 'Daily notes & development reports'] },
      { icon: 'bi-calendar-event', title: 'School life', items: ['Timetables, calendars & events', 'Clubs, transport & library', 'Hostel records where enabled'] },
      { icon: 'bi-graph-up', title: 'Leadership dashboards', items: ['Enrolment & attendance', 'Performance & fee collection', 'One campus or many'] }
    ],
    industries: ['Daycare & creche', 'Nursery schools', 'Primary schools', 'Secondary schools', 'School groups', 'Educational boards', 'Mission schools'],
    primaryIndustry: 'Primary and secondary education',
    otherSectors: 'Creches, nursery, primary, secondary, school groups'
  },
  {
    slug: 'business-silo',
    name: 'Business Silo',
    category: 'business',
    icon: 'bi-shop',
    tagline: 'Run your whole business from one place.',
    summary: 'Customers, sales, stock, suppliers and finances on one centralised platform.',
    overview: [
      'Business Silo helps entrepreneurs, SMEs and established organisations manage their business activities from a centralised digital platform.',
      'It brings together the tools for organising operations, monitoring transactions, managing resources and keeping accurate business records.'
    ],
    highlight: { title: 'Low-stock alert', detail: '6 products below reorder level' },
    targetUsers: ['Entrepreneurs & business owners', 'Small & medium-sized enterprises', 'Retail & wholesale businesses', 'Corporate organisations', 'Distributors & suppliers', 'Service-based businesses'],
    modules: [
      { icon: 'bi-building', title: 'Business profile', items: ['Business registration & profile', 'Operational records', 'Multiple business or branch management'] },
      { icon: 'bi-person-lines-fill', title: 'Customer management', items: ['Customer registration & records', 'Contact information', 'Customer transaction history'] },
      { icon: 'bi-graph-up-arrow', title: 'Sales management', items: ['Sales recording & tracking', 'Sales orders & invoicing', 'Sales history & reporting'] },
      { icon: 'bi-box-seam', title: 'Inventory management', items: ['Product & stock records', 'Stock movement tracking', 'Inventory & low-stock monitoring'] },
      { icon: 'bi-truck', title: 'Purchases & suppliers', items: ['Supplier registration', 'Purchase orders & records', 'Supplier transaction history'] },
      { icon: 'bi-wallet2', title: 'Financial management', items: ['Income & expense tracking', 'Invoices & receipts', 'Financial summaries & reports'] }
    ],
    industries: ['Retail', 'Wholesale', 'Manufacturing', 'Distribution', 'Professional services', 'Hospitality', 'General commerce'],
    primaryIndustry: 'Business and commerce',
    otherSectors: 'Retail, wholesale, SMEs, manufacturing, distribution'
  },
  {
    slug: 'cooperative-silo',
    name: 'Cooperative Silo',
    category: 'business',
    icon: 'bi-piggy-bank',
    tagline: 'Savings, loans and members, finally in order.',
    summary: 'Members, contributions, savings, loans and dividends for cooperative societies.',
    overview: [
      'Cooperative Silo simplifies the administration of cooperative organisations, from members and contributions to savings, loans and financial activity.',
      'Executives manage society operations on one platform, while members can see their own account information and services.'
    ],
    highlight: { title: 'Loan approved', detail: 'Disbursement scheduled · repayments tracked' },
    targetUsers: ['Cooperative societies', 'Staff cooperative associations', 'Community savings groups', 'Agricultural cooperatives', 'Multipurpose cooperatives', 'Trade & professional cooperatives'],
    modules: [
      { icon: 'bi-person-plus', title: 'Member management', items: ['Member registration & profiles', 'Membership status', 'Member account information'] },
      { icon: 'bi-safe', title: 'Contributions & savings', items: ['Regular & monthly contributions', 'Voluntary contributions', 'Contribution history & statements'] },
      { icon: 'bi-cash-stack', title: 'Loan management', items: ['Loan applications & approval workflows', 'Disbursement records', 'Repayments & outstanding balances'] },
      { icon: 'bi-calculator', title: 'Financial management', items: ['Income & expenditure records', 'Member financial statements', 'Interest & dividend calculations'] },
      { icon: 'bi-diagram-3', title: 'Cooperative administration', items: ['Executive & admin roles', 'Member communication', 'Reports & analytics'] }
    ],
    industries: ['Staff cooperatives', 'Agricultural cooperatives', 'Community savings groups', 'Professional associations', 'Multipurpose societies'],
    primaryIndustry: 'Cooperative and financial associations',
    otherSectors: 'Agriculture, community savings, staff associations'
  },
  {
    slug: 'mep-silo',
    name: 'MEP Silo',
    category: 'business',
    icon: 'bi-house-gear',
    tagline: 'Markets, estates and properties under one roof.',
    summary: 'Properties, tenancies, estates, market stalls and levies in one place.',
    overview: [
      'MEP Silo (Market, Estate and Property) supports the administration of commercial markets, residential estates, real estate portfolios and property-related activity.',
      'It manages properties, occupants, allocations, tenancy information, transactions and market operations.'
    ],
    highlight: { title: '94% occupancy', detail: '3 tenancy renewals due this month' },
    targetUsers: ['Estate developers & managers', 'Property owners & landlords', 'Real estate agencies', 'Property management companies', 'Market administrators', 'Local government authorities', 'Market associations', 'Facility managers'],
    modules: [
      { icon: 'bi-house-door', title: 'Property management', items: ['Property registration & categories', 'Ownership information', 'Availability & status tracking'] },
      { icon: 'bi-houses', title: 'Estate management', items: ['Estate & residential units', 'Occupant & tenant records', 'Service & maintenance records'] },
      { icon: 'bi-key', title: 'Tenancy management', items: ['Leases & tenancy records', 'Rent schedules & payments', 'Renewals & expirations'] },
      { icon: 'bi-shop-window', title: 'Market management', items: ['Shop & stall allocation', 'Trader records', 'Market fees, levies & space availability'] },
      { icon: 'bi-arrow-left-right', title: 'Property transactions', items: ['Property listings', 'Sales & rental records', 'Transaction documentation'] },
      { icon: 'bi-clipboard-data', title: 'Reporting', items: ['Occupancy reports', 'Property inventory', 'Rent, revenue & market activity'] }
    ],
    industries: ['Real estate', 'Property development', 'Residential estates', 'Commercial markets', 'Shopping complexes', 'Local government', 'Facility management'],
    primaryIndustry: 'Real estate and property',
    otherSectors: 'Commercial markets, estates, local government'
  },
  {
    slug: 'office-silo',
    name: 'Office Silo',
    category: 'organisational',
    icon: 'bi-briefcase',
    tagline: "Know what's happening across your organisation.",
    summary: 'Staff, documents, correspondence, workflows and meetings in one workspace.',
    overview: [
      'Office Silo streamlines administrative processes, improves workplace coordination and centralises organisational information.',
      'It supports the daily work of businesses, government institutions and other organisations through digital administrative tools and workflow management.'
    ],
    highlight: { title: 'Memo approved', detail: 'Routed and signed off in 2 hours' },
    targetUsers: ['Government ministries & agencies', 'Corporate organisations', 'Private companies', 'NGOs & development organisations', 'Administrative departments', 'Professional institutions'],
    modules: [
      { icon: 'bi-person-vcard', title: 'Staff & departments', items: ['Employee records & profiles', 'Department & unit administration', 'Organisational structure'] },
      { icon: 'bi-folder2-open', title: 'Document management', items: ['Digital storage & categories', 'Document tracking', 'Fast retrieval'] },
      { icon: 'bi-envelope-paper', title: 'Correspondence', items: ['Incoming & outgoing mail', 'Official communication records', 'Tracking & internal routing'] },
      { icon: 'bi-signpost-split', title: 'Workflow management', items: ['Task assignment', 'Approval workflows', 'Activity tracking'] },
      { icon: 'bi-calendar3', title: 'Meetings & scheduling', items: ['Meeting scheduling & calendars', 'Meeting records', 'Meeting documentation'] },
      { icon: 'bi-megaphone', title: 'Office administration', items: ['General office records', 'Internal communication', 'Resources & admin reports'] }
    ],
    industries: ['Government administration', 'Corporate offices', 'NGOs', 'Private enterprises', 'Professional institutions', 'Public sector'],
    primaryIndustry: 'Corporate and public administration',
    otherSectors: 'NGOs, government, private institutions'
  },
  {
    slug: 'office-silo-campus',
    name: 'Office Silo Campus',
    category: 'organisational',
    icon: 'bi-bank2',
    tagline: 'Campus administration, built for academia.',
    summary: 'Faculties, departments, students, staff and campus resources for tertiary institutions.',
    overview: [
      'Office Silo Campus is an institutional administration solution built for educational campuses and academic establishments.',
      'Unlike the general-purpose Office Silo, it focuses on the needs of academic institutions: faculties, departments, students, staff and campus resources.'
    ],
    highlight: { title: 'Academic calendar published', detail: '12 faculties · 64 departments notified' },
    targetUsers: ['Universities', 'Polytechnics', 'Colleges of education', 'Technical institutions', 'Vocational training centres', 'Other tertiary institutions'],
    modules: [
      { icon: 'bi-building', title: 'Institutional management', items: ['Institution profile', 'Faculty & department management', 'Administrative structure & records'] },
      { icon: 'bi-person-badge', title: 'Student administration', items: ['Student registration & profiles', 'Student status management', 'Student information'] },
      { icon: 'bi-people', title: 'Staff management', items: ['Academic staff records', 'Non-academic staff records', 'Departmental assignments'] },
      { icon: 'bi-journal-bookmark', title: 'Academic administration', items: ['Programmes & courses', 'Academic calendars', 'Academic records'] },
      { icon: 'bi-geo-alt', title: 'Campus operations', items: ['Campus facilities', 'Institutional resources', 'Campus activities & coordination'] },
      { icon: 'bi-clipboard-data', title: 'Reporting & records', items: ['Student & staff reports', 'Departmental reports', 'Institutional reports'] }
    ],
    industries: ['Higher education', 'Tertiary institutions', 'Vocational education', 'Technical colleges', 'Academic establishments'],
    primaryIndustry: 'Education and institutional administration',
    otherSectors: 'Universities, colleges, polytechnics'
  },
  {
    slug: 'identity-silo',
    name: 'Identity Silo',
    category: 'identity-finance',
    icon: 'bi-fingerprint',
    tagline: 'Know exactly who you are serving.',
    summary: 'Identity enrolment, verification, authentication and digital credentials.',
    overview: [
      'Identity Silo supports the registration, verification, authentication and management of individual and organisational identities.',
      'It centralises identity information, validates identities and provides secure access to services and systems.'
    ],
    highlight: { title: 'Identity verified', detail: 'Documents validated · credential issued' },
    targetUsers: ['Government institutions', 'Public sector agencies', 'Private organisations', 'Educational institutions', 'Financial institutions', 'Membership organisations', 'Businesses requiring verification'],
    modules: [
      { icon: 'bi-person-plus', title: 'Identity registration', items: ['Digital identity enrolment', 'Personal information capture', 'Identity profiles & records'] },
      { icon: 'bi-patch-check', title: 'Identity verification', items: ['Document verification', 'Validation workflows', 'Verification status tracking'] },
      { icon: 'bi-shield-lock', title: 'Authentication & access', items: ['User authentication', 'Role-based permissions', 'Identity-based service access'] },
      { icon: 'bi-person-vcard', title: 'Digital identity records', items: ['Centralised records', 'Identity history', 'Information updates'] },
      { icon: 'bi-file-earmark-check', title: 'Identity documentation', items: ['Document uploads & records', 'Document validation', 'Digital credentials'] },
      { icon: 'bi-journal-text', title: 'Identity administration', items: ['Administrative permissions', 'Verification reports', 'Audit & activity records'] }
    ],
    industries: ['Government identity', 'Banking & finance', 'Public administration', 'Education', 'Corporate security', 'Membership organisations', 'Digital services'],
    primaryIndustry: 'Digital identity and information management',
    otherSectors: 'Government, banking, education, corporate security'
  },
  {
    slug: 'revenue-silo',
    name: 'Revenue Silo',
    category: 'identity-finance',
    icon: 'bi-cash-coin',
    tagline: 'Every naira assessed, billed and accounted for.',
    summary: 'Revenue sources, assessments, billing, collections and reconciliation.',
    overview: [
      'Revenue Silo is a revenue administration and collection solution for public and private sector organisations.',
      'It manages revenue sources, assesses charges, generates bills, monitors collections and tracks revenue performance.'
    ],
    highlight: { title: 'Collections up 18%', detail: 'Outstanding bills down this quarter' },
    targetUsers: ['Federal & state agencies', 'Local government authorities', 'Revenue authorities', 'Ministries & departments', 'Private companies', 'Educational institutions', 'Estate & market administrators', 'Service-based organisations'],
    modules: [
      { icon: 'bi-collection', title: 'Revenue sources', items: ['Source registration', 'Revenue categories & streams', 'Revenue records'] },
      { icon: 'bi-receipt', title: 'Assessment & billing', items: ['Revenue assessments', 'Bill generation', 'Fees, levies & billing schedules'] },
      { icon: 'bi-inboxes', title: 'Revenue collection', items: ['Collection records', 'Collection monitoring', 'Outstanding payments'] },
      { icon: 'bi-bank', title: 'Tax, levy & fee administration', items: ['Tax administration', 'Levy management', 'Government & private charges'] },
      { icon: 'bi-arrow-repeat', title: 'Reconciliation', items: ['Revenue reconciliation', 'Collection summaries', 'Outstanding revenue monitoring'] },
      { icon: 'bi-bar-chart-line', title: 'Reports & analytics', items: ['Revenue performance', 'Collection trends', 'Departmental reports'] }
    ],
    industries: ['Government revenue', 'Taxation', 'Local government finance', 'Property management', 'Education', 'Hospitality', 'Institutional finance'],
    primaryIndustry: 'Revenue administration',
    otherSectors: 'Government, taxation, private organisations'
  },
  {
    slug: 'payment-silo',
    name: 'Payment Silo',
    category: 'identity-finance',
    icon: 'bi-credit-card-2-front',
    tagline: 'Payments you can trace, match and trust.',
    summary: 'Payment processing, invoicing, receipts and reconciliation for institutions.',
    overview: [
      'Payment Silo helps organisations administer, monitor and manage payment activity from a centralised digital platform.',
      'It covers payment operations, transaction monitoring, financial records and reconciliation, so every transaction has a reliable record.'
    ],
    highlight: { title: 'Payment reconciled', detail: 'Ref matched · receipt sent automatically' },
    targetUsers: ['Government institutions', 'Educational institutions', 'Corporate organisations', 'Hospitals & healthcare providers', 'Professional associations', 'Cooperative societies', 'Service providers'],
    modules: [
      { icon: 'bi-send-check', title: 'Payment management', items: ['Payment initiation & processing', 'Payment requests', 'Status tracking & history'] },
      { icon: 'bi-file-earmark-text', title: 'Billing & invoicing', items: ['Invoice generation', 'Payment references', 'Outstanding payment tracking'] },
      { icon: 'bi-activity', title: 'Transaction management', items: ['Transaction records', 'Monitoring & verification', 'Transaction history'] },
      { icon: 'bi-arrow-left-right', title: 'Reconciliation', items: ['Transaction matching', 'Settlement monitoring', 'Discrepancy tracking'] },
      { icon: 'bi-receipt-cutoff', title: 'Receipts & documentation', items: ['Digital receipts', 'Payment confirmation', 'Payment statements'] },
      { icon: 'bi-pie-chart', title: 'Reporting & administration', items: ['Payment reports', 'Transaction analytics', 'Access controls'] }
    ],
    industries: ['Government payments', 'Education fees', 'Institutional collections', 'Healthcare payments', 'Corporate transactions', 'Association subscriptions'],
    primaryIndustry: 'Financial and payment administration',
    otherSectors: 'Education, healthcare, government, business'
  },
  {
    slug: 'training-silo',
    name: 'Training Silo',
    category: 'education',
    icon: 'bi-journal-check',
    tagline: 'Learning that continues after the room empties.',
    summary: 'Courses, organisational training, seminar recordings, assessments and certificates.',
    overview: [
      'Training Silo lets individuals, organisations, institutions and training providers create, deliver, access and manage learning programmes online.',
      'It supports public courses and private organisational training, and keeps learning going after seminars and workshops with recordings, materials and follow-up lessons.'
    ],
    highlight: { title: '41 certificates issued', detail: '86 learners · 3 cohorts in progress' },
    targetUsers: ['Individual learners', 'Tutors & instructors', 'Professional trainers', 'Government agencies', 'Corporate organisations', 'Churches & religious institutions', 'Educational institutions', 'Seminar & workshop organisers'],
    modules: [
      { icon: 'bi-search', title: 'Discovery & enrolment', items: ['Browse & search courses', 'Learner enrolment', 'Course access management'] },
      { icon: 'bi-upload', title: 'Course creation', items: ['Course creation & publishing', 'Video & recorded lessons', 'Learning resources'] },
      { icon: 'bi-building', title: 'Organisational training', items: ['Private staff programmes', 'Learner assignment', 'Progress monitoring'] },
      { icon: 'bi-camera-video', title: 'Seminars & workshops', items: ['Seminar recordings', 'Workshop materials', 'Follow-up lessons'] },
      { icon: 'bi-speedometer2', title: 'Learning management', items: ['Learner dashboards', 'Progress & completion tracking', 'Learning history'] },
      { icon: 'bi-ui-checks', title: 'Assessment & evaluation', items: ['Quizzes & tests', 'Learner performance', 'Training evaluation'] },
      { icon: 'bi-award', title: 'Certification', items: ['Completion records', 'Digital certificates', 'Certificate verification'] }
    ],
    industries: ['Education', 'Professional development', 'Government training', 'Corporate L&D', 'Religious organisations', 'Vocational training', 'Continuing education'],
    primaryIndustry: 'Education and professional development',
    otherSectors: 'Government, corporate, religious, vocational'
  },
  {
    slug: 'exam-silo',
    name: 'Exam Silo',
    category: 'education',
    icon: 'bi-pencil-square',
    tagline: 'Set, sit and score exams with confidence.',
    summary: 'Question banks, computer-based testing, marking and results processing.',
    overview: [
      'Exam Silo simplifies the creation, administration, delivery and evaluation of examinations.',
      'Institutions and examination bodies get tools for computer-based tests, candidate management, results processing and examination records.'
    ],
    highlight: { title: 'Results published', detail: '2,310 candidates · auto-marked in minutes' },
    targetUsers: ['Schools', 'Universities & polytechnics', 'Examination bodies', 'Government education agencies', 'Professional certification bodies', 'Training institutions', 'Corporate assessors'],
    modules: [
      { icon: 'bi-calendar-check', title: 'Examination creation', items: ['Exam setup & categories', 'Scheduling', 'Assessment configuration'] },
      { icon: 'bi-database', title: 'Question bank', items: ['Question creation', 'Multiple question formats', 'Question bank organisation'] },
      { icon: 'bi-laptop', title: 'Computer-based testing', items: ['Online examinations', 'Timed assessments', 'Candidate access management'] },
      { icon: 'bi-person-check', title: 'Candidate management', items: ['Candidate registration', 'Exam allocation', 'Candidate tracking'] },
      { icon: 'bi-check2-square', title: 'Assessment & marking', items: ['Automated marking', 'Manual grading', 'Score calculation'] },
      { icon: 'bi-trophy', title: 'Results management', items: ['Results processing', 'Grading & publication', 'Examination reports'] },
      { icon: 'bi-eye', title: 'Exam administration', items: ['Exam monitoring', 'Administrative controls', 'Performance analytics'] }
    ],
    industries: ['Primary & secondary education', 'Tertiary education', 'Professional exams', 'Recruitment assessments', 'Government exams', 'Corporate assessments'],
    primaryIndustry: 'Education and assessment',
    otherSectors: 'Examination bodies, recruitment, certification'
  },
  {
    slug: 'membership-silo',
    name: 'Membership Silo',
    category: 'membership',
    icon: 'bi-people',
    tagline: 'Keep members engaged and dues up to date.',
    summary: 'Registration, subscriptions, renewals, digital ID and member communication.',
    overview: [
      'Membership Silo helps organisations register, manage, engage and keep in touch with their members.',
      'It centralises membership records, subscriptions, renewals, member activity and participation.'
    ],
    highlight: { title: '128 renewals this week', detail: 'Reminders sent · dues reconciled' },
    targetUsers: ['Professional associations', 'Religious organisations & churches', 'Trade unions', 'Cooperative societies', 'Clubs & societies', 'Alumni associations', 'NGOs', 'Community organisations'],
    modules: [
      { icon: 'bi-person-plus', title: 'Member registration', items: ['Online registration', 'Member profiles', 'Member categories'] },
      { icon: 'bi-sliders', title: 'Membership administration', items: ['Levels & categories', 'Status tracking', 'Membership approvals'] },
      { icon: 'bi-arrow-clockwise', title: 'Subscriptions', items: ['Membership dues', 'Renewal management', 'Outstanding subscriptions'] },
      { icon: 'bi-person-badge', title: 'Member identification', items: ['Digital membership ID', 'Identification records', 'Membership credentials'] },
      { icon: 'bi-chat-dots', title: 'Communication & engagement', items: ['Announcements & updates', 'Member notifications', 'Events & activities'] },
      { icon: 'bi-graph-up', title: 'Reporting & analytics', items: ['Membership statistics', 'Growth & subscription reports', 'Activity records'] }
    ],
    industries: ['Professional bodies', 'Religious organisations', 'Unions', 'Clubs & societies', 'Alumni networks', 'Cooperatives', 'Community associations'],
    primaryIndustry: 'Associations and membership organisations',
    otherSectors: 'Churches, unions, clubs, professional bodies'
  },
  {
    slug: 'health-silo',
    name: 'Health Silo',
    category: 'specialised',
    icon: 'bi-heart-pulse',
    tagline: 'More time for patients, less for paperwork.',
    summary: 'Patients, appointments, medical records, labs and prescriptions.',
    overview: [
      'Health Silo supports the administration of healthcare facilities, patient information, medical services and healthcare operations.',
      'It keeps patient records, coordinates care, manages appointments and supports efficient service delivery.'
    ],
    highlight: { title: 'Lab result ready', detail: 'Added to patient record · doctor notified' },
    targetUsers: ['Hospitals', 'Private & public clinics', 'Diagnostic centres', 'Medical laboratories', 'Healthcare practitioners', 'HMOs', 'Public health institutions'],
    modules: [
      { icon: 'bi-person-heart', title: 'Patient management', items: ['Patient registration & profiles', 'Medical history', 'Patient records'] },
      { icon: 'bi-calendar2-week', title: 'Appointments', items: ['Scheduling & consultation bookings', 'Appointment tracking', 'Visit records'] },
      { icon: 'bi-file-medical', title: 'Medical records', items: ['Electronic medical records', 'Consultation & diagnosis history', 'Medical documentation'] },
      { icon: 'bi-eyedropper', title: 'Laboratory & diagnostics', items: ['Lab requests & test records', 'Diagnostic reports', 'Results management'] },
      { icon: 'bi-capsule', title: 'Prescriptions & medication', items: ['Prescription records', 'Medication history', 'Pharmacy workflows'] },
      { icon: 'bi-hospital', title: 'Healthcare administration', items: ['Facility records', 'Staff & practitioner information', 'Operational reporting'] },
      { icon: 'bi-bar-chart', title: 'Reporting & analytics', items: ['Patient statistics', 'Service delivery reports', 'Performance reports'] }
    ],
    industries: ['Hospitals', 'Clinics', 'Diagnostic centres', 'Medical laboratories', 'Healthcare networks', 'Public health', 'Private healthcare'],
    primaryIndustry: 'Healthcare',
    otherSectors: 'Hospitals, clinics, laboratories, public health'
  },
  {
    slug: 'automobile-silo',
    name: 'Automobile Silo',
    category: 'specialised',
    icon: 'bi-car-front',
    tagline: 'Every vehicle, driver and service on record.',
    summary: 'Vehicle records, fleets, maintenance, drivers and documentation.',
    overview: [
      'Automobile Silo supports the administration, tracking and management of vehicles and automobile-related activity.',
      'It keeps vehicle records, manages fleets, tracks maintenance and organises vehicle documentation.'
    ],
    highlight: { title: 'Service due', detail: '4 vehicles · insurance expiring in 14 days' },
    targetUsers: ['Vehicle owners', 'Automobile dealerships', 'Fleet operators', 'Transport & logistics companies', 'Vehicle rental businesses', 'Automobile workshops', 'Inspection organisations', 'Transport regulators'],
    modules: [
      { icon: 'bi-card-list', title: 'Vehicle records', items: ['Vehicle registration', 'Identification & ownership', 'Vehicle documentation'] },
      { icon: 'bi-truck-front', title: 'Fleet management', items: ['Fleet registration', 'Vehicle allocation', 'Fleet monitoring'] },
      { icon: 'bi-tools', title: 'Maintenance', items: ['Maintenance schedules', 'Service & repair history', 'Maintenance reminders'] },
      { icon: 'bi-person-workspace', title: 'Driver management', items: ['Driver information', 'Driver assignments', 'Vehicle-driver allocation'] },
      { icon: 'bi-file-earmark-lock', title: 'Vehicle documentation', items: ['Insurance & registration', 'Inspection records', 'Expiry tracking'] },
      { icon: 'bi-tag', title: 'Automobile transactions', items: ['Sales & purchase records', 'Rental administration', 'Transaction documentation'] },
      { icon: 'bi-clipboard-data', title: 'Reporting', items: ['Vehicle inventory', 'Fleet & maintenance reports', 'Vehicle activity history'] }
    ],
    industries: ['Dealerships', 'Fleet management', 'Transport & logistics', 'Vehicle rental', 'Automobile servicing', 'Vehicle inspection', 'Transport administration'],
    primaryIndustry: 'Automotive and transportation',
    otherSectors: 'Dealerships, logistics, fleet operators, workshops'
  }
];

export const PRODUCT_INTEGRATIONS: ProductIntegration[] = [
  { products: ['school-silo', 'exam-silo', 'payment-silo'], title: 'The complete school', description: 'School Silo runs admissions, classes and results, Exam Silo powers computer-based tests, and Payment Silo collects and reconciles school fees.' },
  { products: ['identity-silo', 'membership-silo'], title: 'Verified members', description: 'Identity Silo verifies members at registration and authenticates them when they access membership services.' },
  { products: ['membership-silo', 'payment-silo'], title: 'Dues that pay themselves', description: 'Membership Silo manages subscriptions and dues while Payment Silo processes and records each transaction.' },
  { products: ['training-silo', 'exam-silo'], title: 'Learn, then certify', description: 'Training Silo delivers the courses and materials; Exam Silo runs the formal examinations and assessments.' },
  { products: ['training-silo', 'membership-silo'], title: 'Continuing professional development', description: 'Associations manage members in Membership Silo and deliver CPD programmes through Training Silo.' },
  { products: ['revenue-silo', 'payment-silo'], title: 'Bill to bank', description: 'Revenue Silo handles assessments, billing and collections while Payment Silo manages the payments and reconciliation.' },
  { products: ['mep-silo', 'revenue-silo', 'payment-silo'], title: 'Property, levies & rent', description: 'Estate and market administrators manage properties, assess fees and monitor payments through connected systems.' },
  { products: ['office-silo', 'identity-silo'], title: 'Secure workplace', description: 'Identity Silo verifies and authenticates staff while Office Silo runs administration and internal workflows.' },
  { products: ['office-silo-campus', 'training-silo', 'exam-silo'], title: 'The connected campus', description: 'Institutions run campus administration, deliver digital learning and conduct examinations on specialised, connected solutions.' },
  { products: ['automobile-silo', 'payment-silo'], title: 'Vehicle charges & payments', description: 'Dealerships and fleet operators manage vehicle-related charges and payments through connected payment services.' },
  { products: ['health-silo', 'payment-silo'], title: 'Patient billing', description: 'Healthcare providers connect patient billing and payment administration with healthcare service records.' }
];

export const SECTOR_ECOSYSTEMS: SectorEcosystem[] = [
  { sector: 'Schools & school groups', icon: 'bi-backpack', scenario: 'Run admissions, results and parent communication, set computer-based tests and collect fees online.', products: ['school-silo', 'exam-silo', 'payment-silo', 'training-silo'] },
  { sector: 'Government & public sector', icon: 'bi-bank', scenario: 'Verify citizens, assess and collect revenue, and run ministry administration on connected systems.', products: ['identity-silo', 'revenue-silo', 'payment-silo', 'office-silo'] },
  { sector: 'Universities & tertiary', icon: 'bi-building', scenario: 'Administer the campus, deliver digital learning, run exams and collect fees in one ecosystem.', products: ['office-silo-campus', 'training-silo', 'exam-silo', 'payment-silo'] },
  { sector: 'Professional associations', icon: 'bi-award', scenario: 'Register verified members, collect dues, deliver CPD training and certify through examinations.', products: ['membership-silo', 'identity-silo', 'training-silo', 'exam-silo', 'payment-silo'] },
  { sector: 'Faith-based organisations', icon: 'bi-house-heart', scenario: 'Manage members and contributions, and keep teaching going after every seminar and retreat.', products: ['membership-silo', 'training-silo', 'payment-silo', 'office-silo'] },
  { sector: 'Healthcare', icon: 'bi-heart-pulse', scenario: 'Link patient records, appointments and labs with billing and payment administration.', products: ['health-silo', 'payment-silo', 'identity-silo'] },
  { sector: 'Real estate & markets', icon: 'bi-houses', scenario: 'Allocate units and stalls, assess rents and levies, and reconcile every payment.', products: ['mep-silo', 'revenue-silo', 'payment-silo'] },
  { sector: 'Cooperatives & agriculture', icon: 'bi-flower1', scenario: 'Manage members, savings and loans, and process contributions and repayments.', products: ['cooperative-silo', 'membership-silo', 'payment-silo'] },
  { sector: 'Businesses & SMEs', icon: 'bi-briefcase', scenario: 'Run sales, stock and finances, manage the office, and train your staff.', products: ['business-silo', 'office-silo', 'payment-silo', 'training-silo'] },
  { sector: 'Transport & logistics', icon: 'bi-truck', scenario: 'Track fleets, drivers and maintenance, and handle vehicle charges and payments.', products: ['automobile-silo', 'payment-silo', 'identity-silo'] }
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getCategory(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => category.slug === slug);
}

export function productsInCategory(slug: string): Product[] {
  return PRODUCTS.filter((product) => product.category === slug);
}

export function integrationsFor(slug: string): ProductIntegration[] {
  return PRODUCT_INTEGRATIONS.filter((integration) => integration.products.includes(slug));
}
