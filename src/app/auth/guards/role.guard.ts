import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthServiceService } from '../services/auth-service.service';

/**
 * Data soportada en las rutas:
 *  - appRole: 'Empresa' | 'Usuario'
 *  - companyRoles: ['OWNER','MANAGER', ...]  // solo válida cuando appRole = 'Empresa'
 */
export const roleGuard: CanActivateFn = (route) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthServiceService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) return true;

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const needAppRole = route.data?.['appRole'] as
    | 'Empresa'
    | 'Usuario'
    | undefined;
  const needCompanyRoles = route.data?.['companyRoles'] as string[] | undefined;

  if (needAppRole && !auth.hasRole(needAppRole)) {
    router.navigate(['/login']);
    return false;
  }

  if (needAppRole === 'Empresa' && needCompanyRoles?.length) {
    if (!auth.hasCompanyRole(needCompanyRoles)) {
      router.navigate(['/home']);
      return false;
    }
  }
  return true;
};
