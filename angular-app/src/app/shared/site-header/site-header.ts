import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-site-header',
  standalone: true,
  templateUrl: './site-header.html'
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('header', { static: true }) private header!: ElementRef<HTMLElement>;
  @ViewChild('navigation', { static: true }) private navigation!: ElementRef<HTMLElement>;
  @ViewChild('toggle', { static: true }) private toggle!: ElementRef<HTMLButtonElement>;
  @ViewChild('closeButton', { static: true }) private closeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('backdrop', { static: true }) private backdrop!: ElementRef<HTMLButtonElement>;

  menuOpen = false;
  darkMode = false;
  private readonly routeSubscription: Subscription;
  readonly mobileBreakpoint = window.matchMedia('(max-width: 900px)');
  private scrollPosition = 0;
  private bodyStyleSnapshot = new Map<string, [string, string]>();
  private overlayStyleSnapshots: Map<string, [string, string]>[] = [];

  constructor(private readonly router: Router) {
    this.routeSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
        requestAnimationFrame(() => this.updateHeader());
      });
  }

  ngOnInit(): void {
    this.syncTheme();
    this.mobileBreakpoint.addEventListener('change', this.onBreakpointChange);
    this.updateHeader();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.mobileBreakpoint.removeEventListener('change', this.onBreakpointChange);
    if (this.menuOpen) this.restoreScrollLock();
  }

  @HostListener('window:scroll')
  updateHeader(): void {
    const header = this.header.nativeElement;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    const hero = document.querySelector('main > section:first-child');
    header.classList.toggle('on-dark', Boolean(hero?.matches('.page-hero')));
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.menuOpen) this.closeMenu(true);
  }

  isCurrent(path: string): boolean {
    return this.router.url.split(/[?#]/, 1)[0] === path;
  }

  toggleMenu(): void {
    if (this.menuOpen) this.closeMenu(true);
    else this.openMenu();
  }

  closeMenu(returnFocus = false): void {
    if (!this.menuOpen) return;
    this.menuOpen = false;
    this.restoreScrollLock();
    if (returnFocus) this.toggle.nativeElement.focus({ preventScroll: true });
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    document.documentElement.dataset['theme'] = this.darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  private readonly onBreakpointChange = (): void => this.closeMenu();

  private openMenu(): void {
    if (!this.mobileBreakpoint.matches) return;
    this.scrollPosition = window.scrollY;
    const bodyProperties = ['position', 'top', 'left', 'right', 'width', 'overflow-y'];
    const overlayProperties = ['position', 'top', 'bottom', 'height'];
    this.bodyStyleSnapshot = this.snapshotStyles(document.body, bodyProperties);
    this.overlayStyleSnapshots = [this.navigation.nativeElement, this.backdrop.nativeElement]
      .map((element) => this.snapshotStyles(element, overlayProperties));

    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflowY = 'hidden';
    [this.navigation.nativeElement, this.backdrop.nativeElement].forEach((element) => {
      element.style.position = 'absolute';
      element.style.bottom = 'auto';
      const parentTop = element.offsetParent?.getBoundingClientRect().top ?? 0;
      element.style.top = `${-parentTop}px`;
    });
    this.backdrop.nativeElement.style.height = '100dvh';
    this.menuOpen = true;
    this.closeButton.nativeElement.focus({ preventScroll: true });
  }

  private restoreScrollLock(): void {
    const overlayProperties = ['position', 'top', 'bottom', 'height'];
    [this.navigation.nativeElement, this.backdrop.nativeElement].forEach((element, index) => {
      this.restoreStyles(element, overlayProperties, this.overlayStyleSnapshots[index]);
    });
    this.restoreStyles(
      document.body,
      ['position', 'top', 'left', 'right', 'width', 'overflow-y'],
      this.bodyStyleSnapshot
    );
    this.overlayStyleSnapshots = [];
    this.bodyStyleSnapshot.clear();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const behavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, this.scrollPosition);
        document.documentElement.style.scrollBehavior = behavior;
      });
    });
  }

  private snapshotStyles(element: HTMLElement, properties: string[]): Map<string, [string, string]> {
    return new Map(properties.map((property) => [
      property,
      [element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]
    ]));
  }

  private restoreStyles(
    element: HTMLElement,
    properties: string[],
    snapshot?: Map<string, [string, string]>
  ): void {
    if (!snapshot) return;
    properties.forEach((property) => {
      const [value, priority] = snapshot.get(property) ?? ['', ''];
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    });
  }

  private syncTheme(): void {
    this.darkMode = document.documentElement.dataset['theme'] === 'dark';
  }
}
