import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    authService.currentUser?.enabled &&
    authService.currentUser.profile === 'admin'
  ) {
    return true;
  } else if (
    authService.currentUser?.enabled &&
    authService.currentUser.profile === 'user'
  ) {
    return false;
  }

  router.navigateByUrl('');
  return false;
};
