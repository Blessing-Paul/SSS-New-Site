import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html'
})
export class LoginPageComponent {
  status = '';

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    this.status = 'Sign-in is not connected yet. Portal access will be available when authentication is implemented.';
  }
}
