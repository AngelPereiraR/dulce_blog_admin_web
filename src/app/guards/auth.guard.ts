import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';

@Injectable()
class PermissionsService {
  canActivate() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
