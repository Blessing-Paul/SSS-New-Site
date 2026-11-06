import { Component } from '@angular/core';
import { SERVICES } from '../../core/services.data';

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];

@Component({
  selector: 'app-services-page',
  standalone: true,
  templateUrl: './services-page.html'
})
export class ServicesPageComponent {
  readonly services = SERVICES;
  readonly countWord = WORDS[SERVICES.length] ?? String(SERVICES.length);
}
