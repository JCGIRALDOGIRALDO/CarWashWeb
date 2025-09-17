// src/app/auth/services/auth-service.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environment/environment';

type LoginType = 'Usuario' | 'Empresa';

export interface ApiLoginResponse {
  token: string;
  userId?: number;
  empresaId?: number;
  role?: string;
  companyRole?: string;
  scopes?: Array<{ clientId: number; roleCode: string }>;
}

@Injectable({ providedIn: 'root' })
export class AuthServiceService {
  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
  private getItem(k: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  }
  private setItem(k: string, v: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(k, v);
    } catch {}
  }
  private removeItem(k: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(k);
    } catch {}
  }

  private rolesFromToken(token?: string): string[] {
    if (!token) return [];
    try {
      const decoded: any = jwtDecode(token);
      const claim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const raw = decoded?.[claim];
      const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return arr.map((x: any) => String(x).trim());
    } catch {
      return [];
    }
  }

  private persistSession(res: {
    token: string;
    userId?: number;
    empresaId?: number;
    roles: string[];
    companyRole?: string | null;
  }) {
    this.setItem('token', res.token);
    this.setItem('roles', JSON.stringify(res.roles));
    if (res.companyRole) this.setItem('companyRole', res.companyRole);
    if (res.userId) this.setItem('userId', String(res.userId));
    if (res.empresaId) this.setItem('empresaId', String(res.empresaId));
  }

  login(
    tipo: LoginType,
    data: { email: string; password: string }
  ): Observable<ApiLoginResponse> {
    const url =
      tipo === 'Usuario'
        ? `${this.api}/usuarios/login`
        : `${this.api}/empresas/login`;

    return this.http.post<ApiLoginResponse>(url, data).pipe(
      map((res) => {
        const roles = this.rolesFromToken(res.token);
        const empresaId = res.empresaId ?? res.scopes?.[0]?.clientId;
        const companyRole =
          res.companyRole ??
          roles.find((r) => r.toLowerCase() !== 'empresa') ??
          null;

        return { ...res, empresaId, companyRole, roles };
      }),
      tap((res: any) => {
        this.persistSession({
          token: res.token,
          userId: res.userId,
          empresaId: res.empresaId,
          roles: res.roles,
          companyRole: res.companyRole,
        });
      })
    );
  }

  logout(): void {
    this.removeItem('token');
    this.removeItem('roles');
    this.removeItem('companyRole');
    this.removeItem('userId');
    this.removeItem('empresaId');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getItem('token');
  }

  getRolesFromToken(): string[] {
    const token = this.getItem('token');
    if (!token) return [];
    try {
      const decoded: any = jwtDecode(token);
      const claim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const raw = decoded?.[claim];
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return list.map((r: string) => r.trim().toLowerCase());
    } catch {
      return [];
    }
  }

  hasRole(appRole: 'Empresa' | 'Usuario'): boolean {
    return this.getRolesFromToken().includes(appRole.toLowerCase());
  }

  hasCompanyRole(codes: string[]): boolean {
    const roles = this.getRolesFromToken();
    const set = codes.map((c) => c.toLowerCase());
    return roles.some((r) => set.includes(r));
  }
}
