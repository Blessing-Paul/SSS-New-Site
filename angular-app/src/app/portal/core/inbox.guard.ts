import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { INBOXES, InboxKind } from './models';

/** Checks the :kind param is a real inbox and the user has one of its roles. */
export const inboxGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const config = INBOXES[route.paramMap.get('kind') as InboxKind];
  if (!config) return router.createUrlTree(['/portal']);
  return auth.hasAnyRole(config.roles) ? true : router.createUrlTree(['/unauthorized']);
};
