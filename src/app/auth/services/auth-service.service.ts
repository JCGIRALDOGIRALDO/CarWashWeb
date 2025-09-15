// src/app/auth/services/auth-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environment/environment';

type LoginType = 'Usuario' | 'Empresa';

export interface ApiLoginResponse {
  token: string;
  userId?: number;
  empresaId?: number;
  role?: string;
  scopes?: any[];
}

@Injectable({ providedIn: 'root' })
export class AuthServiceService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  private roleFromToken(token?: string): string | null {
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      const claim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const raw = decoded?.[claim];
      return String(Array.isArray(raw) ? raw[0] : raw).trim() || null;
    } catch {
      return null;
    }
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
        const role = (
          res.role ??
          this.roleFromToken(res.token) ??
          tipo
        ).toString();
        const empresaId =
          res.empresaId ?? res.scopes?.[0]?.clientId ?? undefined;
        return { ...res, role, empresaId };
      }),
      tap((res) => {
        localStorage.setItem('token', res.token);
        if (res.userId) localStorage.setItem('userId', String(res.userId));
        if (res.empresaId)
          localStorage.setItem('empresaId', String(res.empresaId));
        if (res.role) localStorage.setItem('role', res.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('empresaId');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
