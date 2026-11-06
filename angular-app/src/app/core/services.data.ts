/**
 * Single source of truth for the service catalogue.
 * Used by the Services page (subnav + counts) and every enquiry form dropdown.
 * `slug` matches the section id on /services and the `?service=` query value.
 */
export type ServiceGroup = 'Build' | 'Infrastructure' | 'Transform' | 'Advise & support';

export interface ServiceItem {
  slug: string;
  name: string;
  shortName: string;
  group: ServiceGroup;
  icon: string;
}

export const SERVICES: readonly ServiceItem[] = [
  { slug: 'software', name: 'Software development & application engineering', shortName: 'Software', group: 'Build', icon: 'bi-code-slash' },
  { slug: 'web', name: 'Website design & development', shortName: 'Websites', group: 'Build', icon: 'bi-window-stack' },
  { slug: 'portals', name: 'Web portals & digital service platforms', shortName: 'Portals', group: 'Build', icon: 'bi-person-badge' },
  { slug: 'infrastructure', name: 'Local servers, data centres & IT infrastructure', shortName: 'Servers', group: 'Infrastructure', icon: 'bi-hdd-rack' },
  { slug: 'cloud', name: 'Cloud computing & hosting', shortName: 'Cloud', group: 'Infrastructure', icon: 'bi-cloud-check' },
  { slug: 'security', name: 'Cybersecurity & information security', shortName: 'Cybersecurity', group: 'Infrastructure', icon: 'bi-shield-lock' },
  { slug: 'networking', name: 'Networking & connectivity', shortName: 'Networking', group: 'Infrastructure', icon: 'bi-router' },
  { slug: 'transformation', name: 'Digital process automation', shortName: 'Automation', group: 'Transform', icon: 'bi-diagram-3' },
  { slug: 'payments', name: 'Payment gateway & transaction integration', shortName: 'Payments', group: 'Transform', icon: 'bi-credit-card-2-front' },
  { slug: 'data', name: 'Databases, migration & analytics', shortName: 'Data', group: 'Transform', icon: 'bi-bar-chart-line' },
  { slug: 'consulting', name: 'IT consultancy & transformation strategy', shortName: 'Consulting', group: 'Advise & support', icon: 'bi-compass' },
  { slug: 'support', name: 'Technical support, maintenance & managed IT', shortName: 'Support', group: 'Advise & support', icon: 'bi-headset' },
  { slug: 'training', name: 'Training, capacity building & adoption', shortName: 'Training', group: 'Advise & support', icon: 'bi-mortarboard' }
];

export const SERVICE_GROUPS: readonly ServiceGroup[] = ['Build', 'Infrastructure', 'Transform', 'Advise & support'];

/** Extra enquiry topics that are not catalogue services. */
export const ENQUIRY_EXTRAS = [
  { slug: 'silo-products', name: 'Silo products (School, Office, Training & more)' },
  { slug: 'co-development', name: 'Help with our in-house project (co-development)' },
  { slug: 'other', name: 'Partnership or something else' }
] as const;

export const ORGANIZATION_TYPES = [
  'Business / enterprise', 'Government institution', 'University / tertiary', 'School',
  'NGO / non-profit', 'Faith-based organization', 'Healthcare', 'Agriculture', 'Other'
] as const;
