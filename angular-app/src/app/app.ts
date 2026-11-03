import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SiteEffectsService } from './core/site-effects.service';
import { SiteFooterComponent } from './shared/site-footer/site-footer';
import { SiteHeaderComponent } from './shared/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private readonly routeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly meta: Meta,
    private readonly siteEffects: SiteEffectsService
  ) {
    this.routeSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split(/[?#]/, 1)[0];
        const homePage = path === '/' || path === '/index-copy';
        document.body.classList.toggle('inner', !homePage);
        document.body.classList.toggle('home', homePage);
        this.updatePageMetadata();
        this.siteEffects.refresh();
      });
  }

  ngOnInit(): void {
    const path = this.router.url.split(/[?#]/, 1)[0];
    const homePage = path === '/' || path === '/index-copy';
    document.body.classList.toggle('inner', !homePage);
    document.body.classList.toggle('home', homePage);
    this.updatePageMetadata();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  navigateInternalLinks(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;

    const rawHref = link.getAttribute('href');
    if (rawHref?.startsWith('#')) {
      event.preventDefault();
      void this.router.navigateByUrl(`${window.location.pathname}${window.location.search}${rawHref}`);
      return;
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    const path = destination.pathname.replace(/\/$/, '');
    const isRoute = path === '' ||
      /^\/(?:index-copy|about|accessibility|apply|careers|contact|industries|login|office-silo|partners|portal|privacy|products(?:\/[a-z-]+)?|resources|school-silo|services|support|terms|training-silo|unauthorized)$/.test(path) ||
      /\.html$/i.test(path);
    if (!isRoute) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    void this.router.navigateByUrl(`${destination.pathname}${destination.search}${destination.hash}`);
  }

  private updatePageMetadata(): void {
    let route: ActivatedRoute | null = this.router.routerState.root;
    while (route?.firstChild) route = route.firstChild;
    const title = route?.snapshot.data['title'];
    const description = route?.snapshot.data['description'];
    if (typeof title === 'string') this.titleService.setTitle(title);
    if (typeof description === 'string') this.meta.updateTag({ name: 'description', content: description });
  }
}
