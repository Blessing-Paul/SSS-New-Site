import { AuthService } from './auth.service';

describe('AuthService (mock)', () => {
  beforeEach(() => sessionStorage.clear());

  it('signs in every demo account with portal123', async () => {
    for (const email of ['admin@stableshield.com', 'hr@stableshield.com', 'sales@stableshield.com', 'support@stableshield.com', 'chidi@stableshield.com']) {
      const auth = new AuthService();
      const result = await auth.login(email, 'portal123');
      expect(result.ok).withContext(email).toBeTrue();
      expect(auth.user()?.email).toBe(email);
    }
  });

  it('accepts stray spaces and capitals', async () => {
    const auth = new AuthService();
    expect((await auth.login('  Admin@StableShield.com ', ' portal123 ')).ok).toBeTrue();
  });

  it('rejects a wrong password and deactivated accounts', async () => {
    const auth = new AuthService();
    expect((await auth.login('admin@stableshield.com', 'nope')).ok).toBeFalse();
    expect((await auth.login('ngozi@stableshield.com', 'portal123')).message).toContain('deactivated');
  });
});
