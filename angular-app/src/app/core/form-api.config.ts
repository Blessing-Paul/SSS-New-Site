/**
 * Where each site form is sent.
 *
 * `apiBaseUrl` is empty while there is no backend: forms validate, then open the visitor's
 * email app with a pre-filled message to the team in `mailFallback`. Once the Laravel API is live, set it (e.g. 'https://api.stableshield.com')
 * and every form posts multipart/form-data to `${apiBaseUrl}${endpoint}`.
 *
 * Field `name`s in each form are the request contract (snake_case). Laravel should
 * return 201 on success and the standard 422 `{ message, errors: { field: [msg] } }` on validation failure.
 */
export const FORM_API = {
  apiBaseUrl: '',
  endpoints: {
    'project-enquiry': '/api/enquiries',
    'meeting-request': '/api/meeting-requests',
    'support-request': '/api/support-tickets',
    'product-demo': '/api/demo-requests',
    'staff-application': '/api/staff-applications',
    'partner-application': '/api/partner-applications'
  },
  /** Used only while apiBaseUrl is empty (and kept as a reference for backend notifications). */
  mailFallback: {
    'project-enquiry': { to: 'sales@stableshield.com', subject: 'Project enquiry' },
    'meeting-request': { to: 'sales@stableshield.com', subject: 'Meeting request' },
    'product-demo': { to: 'sales@stableshield.com', subject: 'Product demo request' },
    'support-request': { to: 'support@stableshield.com', subject: 'Support request' },
    'staff-application': { to: 'info@stableshield.com', subject: 'Job application' },
    'partner-application': { to: 'info@stableshield.com', cc: 'legal@stableshield.com', subject: 'Partner application' }
  } as Record<string, { to: string; cc?: string; subject: string }>
} as const;

export type FormKey = keyof typeof FORM_API.endpoints;
