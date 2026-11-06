import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FORM_API, FormKey } from './form-api.config';

/** A readable label/value pair taken from the form, used to write the email body. */
export interface SubmissionLine {
  label: string;
  value: string;
}

export interface SubmissionResult {
  ok: boolean;
  /** True when the submission was handed to the visitor's email app instead of the API. */
  viaEmail?: boolean;
  message: string;
  /** Laravel validation errors keyed by field name. */
  errors?: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class FormSubmissionService {
  constructor(private readonly http: HttpClient) {}

  get usesEmail(): boolean {
    return !FORM_API.apiBaseUrl;
  }

  async submit(key: FormKey, data: FormData, lines: SubmissionLine[] = []): Promise<SubmissionResult> {
    if (this.usesEmail) return this.openEmail(key, data, lines);
    try {
      await firstValueFrom(this.http.post(`${FORM_API.apiBaseUrl}${FORM_API.endpoints[key]}`, data, {
        headers: new HttpHeaders({ Accept: 'application/json' })
      }));
      return { ok: true, message: 'Thank you. We have received your submission and will be in touch.' };
    } catch (error) {
      const response = error instanceof HttpErrorResponse ? error : null;
      if (response?.status === 422) {
        return {
          ok: false,
          message: response.error?.message ?? 'Please check the highlighted fields.',
          errors: response.error?.errors ?? {}
        };
      }
      return { ok: false, message: 'Something went wrong sending this form. Please try again or email info@stableshield.com.' };
    }
  }

  /** Opens the visitor's email app with the form contents filled in. Files can't be attached this way. */
  private openEmail(key: FormKey, data: FormData, lines: SubmissionLine[]): SubmissionResult {
    const route = FORM_API.mailFallback[key];
    const name = String(data.get('name') ?? data.get('contact_name') ?? '').trim();
    const subject = `${route.subject}${name ? ` from ${name}` : ''}`;
    const files = [...data.values()].filter((value): value is File => value instanceof File && value.size > 0);

    const body = [
      `Hello Stable Shield team,`,
      '',
      ...lines.map((line) => `${line.label}: ${line.value}`),
      '',
      ...(files.length ? [`Attached: ${files.map((file) => file.name).join(', ')}`, ''] : []),
      'Sent from stableshield.com'
    ].join('\n');

    const params = new URLSearchParams({ subject, body });
    if (route.cc) params.set('cc', route.cc);
    const query = params.toString().replace(/\+/g, '%20');
    window.location.href = `mailto:${route.to}?${query}`;

    const attachNote = files.length
      ? ` Please attach ${files.length === 1 ? `your file (${files[0].name})` : 'your files'} before sending.`
      : '';
    return {
      ok: true,
      viaEmail: true,
      message: `Your email app should now open with your details filled in. Just press Send.${attachNote} ` +
        `If nothing opened, email us at ${route.to}.`
    };
  }
}
