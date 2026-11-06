import { inboxGuard } from './portal/core/inbox.guard';
import { portalGuard } from './portal/core/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page').then((page) => page.AboutPageComponent),
    data: {
      title: 'About Us',
      description:
        ' Stable Shield Solutions|Stable Shield Solutions is a technology and digital transformation company. Learn about our story, mission, values, leadership, partners and journey.',
    },
  },
  {
    path: 'accessibility',
    loadComponent: () =>
      import('./pages/accessibility/accessibility-page').then(
        (page) => page.AccessibilityPageComponent,
      ),
    data: {
      title: 'Accessibility',
      description: ' Stable Shield Solutions|Our approach to accessible digital experiences.',
    },
  },
  {
    path: 'careers',
    loadComponent: () =>
      import('./pages/careers/careers-page').then((page) => page.CareersPageComponent),
    data: {
      title: 'Careers | Stable Shield Solutions',
      description:
        'Careers at Stable Shield Solutions: open roles in software, infrastructure, cybersecurity and IT support.',
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact-page').then((page) => page.ContactPageComponent),
    data: {
      title: 'Contact Us',
      description:
        ' Stable Shield Solutions|Start a project enquiry, book a meeting or request support from Stable Shield Solutions.',
    },
  },
  {
    path: 'index-copy',
    loadComponent: () =>
      import('./pages/index-copy/index-copy-page').then((page) => page.IndexCopyPageComponent),
    data: {
      title: 'Stable Shield Solutions | Technology That Moves You Forward',
      description:
        'Stable Shield Solutions helps organizations modernize with custom software, secure infrastructure, cloud, cybersecurity and digital transformation.',
    },
  },
  {
    path: '',
    loadComponent: () => import('./pages/index/index-page').then((page) => page.IndexPageComponent),
    pathMatch: 'full',
    data: {
      title: 'Stable Shield Solutions | Technology That Moves You Forward',
      description:
        'Stable Shield Solutions helps organizations modernize with custom software, secure infrastructure, cloud, cybersecurity and digital transformation.',
    },
  },
  {
    path: 'industries',
    loadComponent: () =>
      import('./pages/industries/industries-page').then((page) => page.IndustriesPageComponent),
    data: {
      title: 'Industries',
      description:
        ' Stable Shield Solutions|Technology solutions for government, universities, schools, faith-based organizations, NGOs, healthcare, agriculture, enterprises and membership organizations.',
    },
  },
  {
    path: 'apply',
    loadComponent: () =>
      import('./pages/application/application-page').then((page) => page.ApplicationPageComponent),
    data: {
      title: 'Apply for a Role | Stable Shield Solutions',
      description:
        'Apply for an open role or send a general application to Stable Shield Solutions.',
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login-page').then((page) => page.LoginPageComponent),
    data: {
      title: 'Sign In | Stable Shield Solutions',
      description: 'Sign-in page preview for Stable Shield Solutions.',
    },
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized-page').then(
        (page) => page.UnauthorizedPageComponent,
      ),
    data: {
      title: 'Access Denied | Stable Shield Solutions',
      description: 'You are not authorized to access this page.',
    },
  },
  {
    path: 'partners',
    loadComponent: () =>
      import('./pages/partners/partners-page').then((page) => page.PartnersPageComponent),
    data: {
      title: 'Partner With Us',
      description:
        ' Stable Shield Solutions|Become a Stable Shield partner: resellers, implementation partners, technology partners and co-development partners for in-house projects. Apply online in five steps.',
    },
  },
  {
    path: 'access',
    loadComponent: () =>
      import('./pages/portal/portal-page').then((page) => page.PortalPageComponent),
    data: {
      title: 'Staff Access | Stable Shield Solutions',
      description:
        'Secure access for Stable Shield staff: the staff portal, company webmail and sign-in help.',
    },
  },
  {
    path: 'portal',
    loadComponent: () =>
      import('./portal/layout/portal-layout').then((m) => m.PortalLayoutComponent),
    canActivate: [portalGuard],
    canActivateChild: [portalGuard],
    data: { title: 'Portal | Stable Shield Solutions' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./portal/pages/dashboard/dashboard-page').then((m) => m.DashboardPageComponent),
        data: { title: 'Dashboard | Portal' },
      },
      {
        path: 'inbox/:kind',
        loadComponent: () =>
          import('./portal/pages/inbox-list/inbox-list-page').then((m) => m.InboxListPageComponent),
        canActivate: [inboxGuard],
        data: { title: 'Inbox | Portal' },
      },
      {
        path: 'inbox/:kind/:id',
        loadComponent: () =>
          import('./portal/pages/inbox-detail/inbox-detail-page').then(
            (m) => m.InboxDetailPageComponent,
          ),
        canActivate: [inboxGuard],
        data: { title: 'Conversation | Portal' },
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./portal/pages/applications/applications-page').then(
            (m) => m.ApplicationsPageComponent,
          ),
        data: { title: 'Staff applications | Portal', roles: ['hr'] },
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./portal/pages/application-detail/application-detail-page').then(
            (m) => m.ApplicationDetailPageComponent,
          ),
        data: { title: 'Application | Portal', roles: ['hr'] },
      },
      {
        path: 'staff',
        loadComponent: () =>
          import('./portal/pages/staff/staff-page').then((m) => m.StaffPageComponent),
        data: { title: 'Staff directory | Portal' },
      },
      {
        path: 'staff/new',
        loadComponent: () =>
          import('./portal/pages/staff-detail/staff-detail-page').then(
            (m) => m.StaffDetailPageComponent,
          ),
        data: { title: 'Add staff | Portal', roles: ['hr'] },
      },
      {
        path: 'staff/:id',
        loadComponent: () =>
          import('./portal/pages/staff-detail/staff-detail-page').then(
            (m) => m.StaffDetailPageComponent,
          ),
        data: { title: 'Staff | Portal' },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./portal/pages/staff-detail/staff-detail-page').then(
            (m) => m.StaffDetailPageComponent,
          ),
        data: { title: 'My profile | Portal', self: true },
      },
      { path: '**', redirectTo: '' },
    ],
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy/privacy-page').then((page) => page.PrivacyPageComponent),
    data: {
      title: 'Privacy Notice',
      description:
        ' Stable Shield Solutions|How Stable Shield Solutions handles information submitted through this website.',
    },
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products-page').then((page) => page.ProductsPageComponent),
    data: {
      title: 'Silo Products | Stable Shield Solutions',
      description:
        '14 Silo products, led by our flagship School Silo, across schools, business, administration, identity, revenue, payments, learning, membership, healthcare and automotive. Explore features, integrations and book a demo.',
    },
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail-page').then(
        (page) => page.ProductDetailPageComponent,
      ),
  },
  { path: 'office-silo', redirectTo: 'products/office-silo', pathMatch: 'full' },
  { path: 'training-silo', redirectTo: 'products/training-silo', pathMatch: 'full' },
  {
    path: 'resources',
    loadComponent: () =>
      import('./pages/resources/resources-page').then((page) => page.ResourcesPageComponent),
    data: {
      title: 'Insights & Resources',
      description:
        ' Stable Shield Solutions|Practical guidance on cybersecurity, digital transformation, infrastructure, education technology and enterprise systems.',
    },
  },
  { path: 'school-silo', redirectTo: 'products/school-silo', pathMatch: 'full' },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services-page').then((page) => page.ServicesPageComponent),
    data: {
      title: 'Services',
      description:
        ' Stable Shield Solutions|Custom software, websites, portals, servers, cloud, cybersecurity, networking, process automation, payments, data, consultancy, managed IT and training from Stable Shield Solutions.',
    },
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./pages/support/support-page').then((page) => page.SupportPageComponent),
    data: {
      title: 'Support Centre',
      description:
        ' Stable Shield Solutions|Help for Stable Shield clients: product questions, technical assistance, training and service requests.',
    },
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms-page').then((page) => page.TermsPageComponent),
    data: {
      title: 'Terms of Use',
      description: ' Stable Shield Solutions|Terms for using the Stable Shield Solutions website.',
    },
  },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  { path: 'index-copy.html', redirectTo: 'index-copy', pathMatch: 'full' },
  { path: 'index copy.html', redirectTo: 'index-copy', pathMatch: 'full' },
  { path: 'about.html', redirectTo: 'about', pathMatch: 'full' },
  { path: 'accessibility.html', redirectTo: 'accessibility', pathMatch: 'full' },
  { path: 'careers.html', redirectTo: 'careers', pathMatch: 'full' },
  { path: 'contact.html', redirectTo: 'contact', pathMatch: 'full' },
  { path: 'industries.html', redirectTo: 'industries', pathMatch: 'full' },
  { path: 'office-silo.html', redirectTo: 'products/office-silo', pathMatch: 'full' },
  { path: 'partners.html', redirectTo: 'partners', pathMatch: 'full' },
  { path: 'portal.html', redirectTo: 'portal', pathMatch: 'full' },
  { path: 'privacy.html', redirectTo: 'privacy', pathMatch: 'full' },
  { path: 'products.html', redirectTo: 'products', pathMatch: 'full' },
  { path: 'resources.html', redirectTo: 'resources', pathMatch: 'full' },
  { path: 'school-silo.html', redirectTo: 'products/school-silo', pathMatch: 'full' },
  { path: 'services.html', redirectTo: 'services', pathMatch: 'full' },
  { path: 'support.html', redirectTo: 'support', pathMatch: 'full' },
  { path: 'terms.html', redirectTo: 'terms', pathMatch: 'full' },
  { path: 'training-silo.html', redirectTo: 'products/training-silo', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found-page').then((page) => page.NotFoundPageComponent),
    data: {
      title: 'Page Not Found | Stable Shield Solutions',
      description: 'The page you requested could not be found.',
    },
  },
];
