import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../portal/core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html'
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly status = signal('');
  readonly busy = signal(false);
  readonly showPassword = signal(false);
  /** Demo credentials hint, only on a developer machine. */
  readonly isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

  constructor() {
    if (this.auth.isSignedIn()) void this.router.navigateByUrl(this.returnUrl());
  }

  async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    this.busy.set(true);
    this.status.set('');
    const result = await this.auth.login(String(data.get('email')), String(data.get('password')));
    this.busy.set(false);
    if (!result.ok) {
      this.status.set(result.message ?? 'Sign-in failed.');
      return;
    }
    void this.router.navigateByUrl(this.returnUrl());
  }

  private returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    return url.startsWith('/portal') ? url : '/portal';
  }
}
