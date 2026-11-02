import { routes } from './app.routes';

describe('site routes', () => {
  it('uses clean URLs for all page components', () => {
    const componentPaths = routes
      .filter((route) => route.loadComponent)
      .map((route) => route.path);
    const expectedPaths = [
      '', 'index-copy', 'about', 'accessibility', 'apply', 'careers', 'contact', 'industries', 'login', 'unauthorized',
      'office-silo', 'partners', 'portal', 'privacy', 'products', 'resources',
      'school-silo', 'services', 'support', 'terms', 'training-silo', '**'
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

  it('renders a not-found page for unmatched URLs', () => {
    const notFoundRoute = routes.find((route) => route.path === '**');
    expect(notFoundRoute?.loadComponent).toBeDefined();
    expect(notFoundRoute?.redirectTo).toBeUndefined();
  });
});
