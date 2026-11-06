import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SiteEffectsService {
  private cleanups: (() => void)[] = [];
  private initializeFrame: number | null = null;

  refresh(): void {
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    if (this.initializeFrame !== null) cancelAnimationFrame(this.initializeFrame);
    this.initializeFrame = requestAnimationFrame(() => {
      this.initializeFrame = null;
      this.initialize();
    });
  }

  private initialize(): void {
    this.initializeRevealEffects();
    this.initializeCardEffects();
    this.initializeCounters();
    this.initializeSubnav();
    this.initializePrefilledSelects();
    this.initializePortalLinks();
    this.initializeTabs();
  }

  private initializeRevealEffects(): void {
    const items = [...document.querySelectorAll<HTMLElement>('.reveal')];
    if (!items.length || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 80}ms`;
      observer.observe(item);
    });
    this.cleanups.push(() => observer.disconnect());
  }

  private initializeCardEffects(): void {
    const cards = [...document.querySelectorAll<HTMLElement>('.card-p, .person, .pcard')];
    if (!cards.length) return;
    if (matchMedia('(hover: hover)').matches) {
      cards.forEach((card) => {
        const move = (event: PointerEvent): void => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          card.style.setProperty('--my', `${event.clientY - rect.top}px`);
        };
        card.addEventListener('pointermove', move);
        this.cleanups.push(() => card.removeEventListener('pointermove', move));
      });
      return;
    }
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
    }, { rootMargin: '-42% 0px -42% 0px' });
    cards.forEach((card) => observer.observe(card));
    this.cleanups.push(() => observer.disconnect());
  }

  private initializeCounters(): void {
    const numbers = [...document.querySelectorAll<HTMLElement>('.stats strong')];
    if (!numbers.length || !('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        const match = element.textContent?.match(/(\d+)(.*)/);
        if (!match) return;
        const target = Number(match[1]);
        const suffix = match[2];
        const start = performance.now();
        const tick = (now: number): void => {
          const progress = Math.min((now - start) / 1200, 1);
          element.textContent = `${Math.round(target * (1 - (1 - progress) ** 3))}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    numbers.forEach((number) => observer.observe(number));
    this.cleanups.push(() => observer.disconnect());
  }

  private initializeSubnav(): void {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.subnav a[href^="#"]')];
    if (!links.length || !('IntersectionObserver' in window)) return;
    const targets = new Map(links.map((link) => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove('is-current'));
        const link = targets.get((entry.target as HTMLElement).id);
        if (!link) return;
        link.classList.add('is-current');
        const bar = link.parentElement;
        bar?.scrollTo({
          left: link.offsetLeft - bar.clientWidth / 2 + link.offsetWidth / 2,
          behavior: 'smooth'
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((_, id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    this.cleanups.push(() => observer.disconnect());
  }

  private initializePrefilledSelects(): void {
    const params = new URLSearchParams(location.search);
    this.prefillSelect('demo-product', params.get('product'));
    this.prefillSelect('enquiry-service', params.get('service'));
  }

  private prefillSelect(id: string, value: string | null): void {
    if (!value) return;
    const select = document.getElementById(id);
    if (!(select instanceof HTMLSelectElement)) return;
    const option = [...select.options].find((item) => item.value === value || item.text === value);
    if (option) select.value = option.value;
  }

  private initializePortalLinks(): void {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('.portal-link')];
    links.forEach((link) => {
      if (link.getAttribute('href') !== '#configure') {
        link.target = '_blank';
        return;
      }
      const click = (event: MouseEvent): void => {
        event.preventDefault();
        const status = document.getElementById('portal-status');
        if (status) {
          status.textContent = `The ${link.dataset['service']} address hasn't been configured yet. Please contact IT support.`;
        }
      };
      link.addEventListener('click', click);
      this.cleanups.push(() => link.removeEventListener('click', click));
    });
  }

  private initializeTabs(): void {
    const tabs = [...document.querySelectorAll<HTMLElement>('.ptabs [role="tab"]')];
    if (!tabs.length) return;
    const select = (tab: HTMLElement, focus = false): void => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls') ?? '');
        if (panel) (panel as HTMLElement).hidden = !selected;
      });
      if (focus) tab.focus();
    };
    const listeners: (() => void)[] = [];
    tabs.forEach((tab, index) => {
      const click = (): void => select(tab);
      const keydown = (event: KeyboardEvent): void => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key as 'ArrowRight' | 'ArrowLeft'];
        if (step === undefined) return;
        select(tabs[(index + step + tabs.length) % tabs.length], true);
      };
      tab.addEventListener('click', click);
      tab.addEventListener('keydown', keydown);
      listeners.push(() => {
        tab.removeEventListener('click', click);
        tab.removeEventListener('keydown', keydown);
      });
    });
    const fromHash = (): void => {
      const tab = tabs.find((item) => `#${item.getAttribute('aria-controls')}` === location.hash);
      if (!tab) return;
      select(tab);
      document.getElementById('explore')?.scrollIntoView();
    };
    window.addEventListener('hashchange', fromHash);
    fromHash();
    this.cleanups.push(() => {
      listeners.forEach((cleanup) => cleanup());
      window.removeEventListener('hashchange', fromHash);
    });
  }
}
