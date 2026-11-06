import { routes } from './app.routes';

describe('site routes', () => {
  it('uses clean URLs for all page components', () => {
    const componentPaths = routes
      .filter((route) => route.loadComponent)
      .map((route) => route.path);
    const expectedPaths = [
      '', 'index-copy', 'about', 'access', 'accessibility', 'apply', 'careers', 'contact', 'industries', 'login', 'unauthorized',
      'partners', 'portal', 'privacy', 'products', 'products/:slug', 'resources',
      'services', 'support', 'terms', '**'
    ];
    expect(new Set(componentPaths)).toEqual(new Set(expectedPaths));
    expect(componentPaths.some((path) => path?.endsWith('.html'))).toBeFalse();
  });

  it('redirects legacy HTML URLs to clean paths', () => {
    const redirects = new Map(
      routes.filter((route) => route.redirectTo !== undefined)
        .map((route) => [route.path, route.redirectTo])
    );
    expect(redirects.get('about.html')).toBe('about');
    expect(redirects.get('index.html')).toBe('');
    expect(redirects.get('index copy.html')).toBe('index-copy');
  });

  it('redirects the old Silo pages to their product detail pages', () => {
    const redirects = new Map(
      routes.filter((route) => route.redirectTo !== undefined)
        .map((route) => [route.path, route.redirectTo])
    );
    for (const silo of ['school-silo', 'office-silo', 'training-silo']) {
      expect(redirects.get(silo)).toBe(`products/${silo}`);
      expect(redirects.get(`${silo}.html`)).toBe(`products/${silo}`);
    }
  });

  it('renders a not-found page for unmatched URLs', () => {
    const notFoundRoute = routes.find((route) => route.path === '**');
    expect(notFoundRoute?.loadComponent).toBeDefined();
    expect(notFoundRoute?.redirectTo).toBeUndefined();
  });
});
