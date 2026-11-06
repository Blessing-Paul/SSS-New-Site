import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';

/** Requires a signed-in user; optionally `data.roles` on the route. */
export const portalGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isSignedIn())
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  const roles = route.data['roles'] as Role[] | undefined;
  return auth.hasAnyRole(roles) ? true : router.createUrlTree(['/unauthorized']);
};
