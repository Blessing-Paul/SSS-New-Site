import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormKey } from '../core/form-api.config';
import { FormSubmissionService, SubmissionLine, SubmissionResult } from '../core/form-submission.service';

/**
 * Sends a form through FormSubmissionService.
 * Usage: <form appFormSubmit="project-enquiry" novalidate> … <p class="f-status" data-form-status></p></form>
 * - Skips sending if another handler already called preventDefault (e.g. a multi-step form that isn't finished).
 * - Uses native validation, a honeypot field (`website_hp`) and shows Laravel 422 errors next to fields.
 */
@Directive({
  selector: 'form[appFormSubmit]',
  standalone: true,
  host: { novalidate: '' }
})
export class FormSubmitDirective {
  @Input({ alias: 'appFormSubmit', required: true }) key!: FormKey;
  @Output() submitted = new EventEmitter<SubmissionResult>();

  private busy = false;

  constructor(
    private readonly host: ElementRef<HTMLFormElement>,
    private readonly submissions: FormSubmissionService
  ) {}

  @HostListener('submit', ['$event'])
  async onSubmit(event: SubmitEvent): Promise<void> {
    const alreadyHandled = event.defaultPrevented;
    event.preventDefault();
    if (alreadyHandled || this.busy) return;

    const form = this.host.nativeElement;
    this.clearErrors();
    if (!form.checkValidity()) {
      this.markInvalid();
      this.setStatus('Please complete the highlighted fields.', 'error');
      return;
    }

    const data = new FormData(form);
    if (data.get('website_hp')) return; // bot filled the honeypot
    data.delete('website_hp');

    this.setBusy(true);
    this.setStatus('Sending…', 'pending');
    const result = await this.submissions.submit(this.key, data, this.readableLines());
    this.setBusy(false);

    if (result.errors) this.showServerErrors(result.errors);
    this.setStatus(result.message, result.ok ? 'success' : 'error');
    if (result.ok && !result.viaEmail) form.reset();
    this.submitted.emit(result);
  }

  /** Field label + chosen value(s), in form order, skipping empty, hidden-section and file fields. */
  private readableLines(): SubmissionLine[] {
    const lines: SubmissionLine[] = [];
    const seen = new Set<string>();
    const data = new FormData(this.host.nativeElement);
    for (const field of this.fields) {
      const name = field.name;
      if (!name || seen.has(name) || name === 'website_hp' || field.type === 'file' || field.type === 'hidden') continue;
      if (field.closest('[hidden]')) continue;
      seen.add(name);
      const values = data.getAll(name).filter((value): value is string => typeof value === 'string' && value.trim() !== '');
      if (!values.length || (field.type === 'checkbox' && name === 'consent')) continue;
      lines.push({ label: this.labelFor(field), value: values.join(', ') });
    }
    return lines;
  }

  private labelFor(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
    if (field.type === 'radio' || field.type === 'checkbox') {
      const group = field.closest('[aria-label]')?.getAttribute('aria-label') ??
        field.closest('div')?.parentElement?.querySelector('legend')?.textContent;
      if (group) return group.replace('*', '').trim();
    }
    const label = field.closest('label');
    const text = label ? [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())?.textContent : '';
    return (text || field.name.replace(/[_[\]]+/g, ' ')).replace('*', '').trim();
  }

  private get fields(): (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[] {
    return [...this.host.nativeElement.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];
  }

  private markInvalid(): void {
    const invalid = this.fields.filter((field) => !field.checkValidity());
    invalid.forEach((field) => field.setAttribute('aria-invalid', 'true'));
    invalid[0]?.focus();
  }

  private showServerErrors(errors: Record<string, string[]>): void {
    let first: HTMLElement | null = null;
    for (const [name, messages] of Object.entries(errors)) {
      const field = this.fields.find((item) => item.name === name || item.name === `${name}[]`);
      if (!field) continue;
      field.setAttribute('aria-invalid', 'true');
      const note = document.createElement('small');
      note.className = 'f-error';
      note.textContent = messages[0] ?? '';
      field.insertAdjacentElement('afterend', note);
      first ??= field;
    }
    first?.focus();
  }

  private clearErrors(): void {
    this.fields.forEach((field) => field.removeAttribute('aria-invalid'));
    this.host.nativeElement.querySelectorAll('.f-error').forEach((note) => note.remove());
  }

  private setBusy(busy: boolean): void {
    this.busy = busy;
    this.host.nativeElement.querySelectorAll<HTMLButtonElement>('button[type="submit"]')
      .forEach((button) => { button.disabled = busy; });
  }

  private setStatus(message: string, state: 'pending' | 'success' | 'error'): void {
    const status = this.host.nativeElement.querySelector<HTMLElement>('[data-form-status]');
    if (!status) return;
    status.textContent = message;
    status.dataset['state'] = state;
  }
}
