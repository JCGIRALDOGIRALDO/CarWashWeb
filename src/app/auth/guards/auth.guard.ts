import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
