import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  templateUrl: './site-footer.html'
})
export class SiteFooterComponent implements OnInit {
  readonly year = new Date().getFullYear();
  visible = false;

  ngOnInit(): void {
    this.updateVisibility();
  }

  @HostListener('window:scroll')
  updateVisibility(): void {
    this.visible = window.scrollY > 400;
  }

  scrollToTop(): void {
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }
}
