import { Injectable, computed, signal } from '@angular/core';
import { Role, StaffMember } from './models';

const STORAGE_KEY = 'ss-portal-session';

/**
 * Portal authentication.
 * Mock now: any active staff email from mock data + password "portal123".
 * Laravel: replace login()/logout()/restore() with calls to POST /api/auth/login,
 * POST /api/auth/logout and GET /api/auth/me (Sanctum SPA cookie auth).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly current = signal<StaffMember | null>(this.restore());
  readonly user = this.current.asReadonly();
  readonly isSignedIn = computed(() => this.current() !== null);

  async login(email: string, password: string): Promise<{ ok: boolean; message?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const { MOCK_STAFF } = await import('./mock-data');
    // Forgiving in mock mode: ignore stray spaces, allow "admin" or "admin@" for admin@stableshield.com.
    let address = email.trim().toLowerCase();
    if (!address.includes('@')) address += '@stableshield.com';
    if (address.endsWith('@')) address += 'stableshield.com';
    const staff = MOCK_STAFF.find((member) => member.email.toLowerCase() === address);
    if (!staff || password.trim() !== 'portal123') return { ok: false, message: 'Email or password is incorrect.' };
    if (!staff.active) return { ok: false, message: 'This account has been deactivated. Contact HR or an administrator.' };
    this.setUser(staff);
    return { ok: true };
  }

  logout(): void {
    this.current.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  /** Keep the session copy fresh when the signed-in user's own record changes. */
  setUser(staff: StaffMember): void {
    this.current.set({ ...staff });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  }

  hasAnyRole(roles: readonly Role[] | undefined): boolean {
    const user = this.current();
    if (!user) return false;
    if (!roles?.length || user.roles.includes('admin')) return true;
    return roles.some((role) => user.roles.includes(role));
  }

  private restore(): StaffMember | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StaffMember) : null;
    } catch {
      return null;
    }
  }
}
