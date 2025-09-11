import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';

interface LoginResponse {
  token: string;
  userId?: number;
  empresaId?: number;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthServiceService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  loginUsuario(data: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.api}/usuarios/login`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          if (res.userId) localStorage.setItem('userId', String(res.userId));
          localStorage.setItem('role', res.role);
        })
      );
  }

  loginEmpresa(data: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.api}/empresas/login`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          if (res.empresaId)
            localStorage.setItem('empresaId', String(res.empresaId));
          localStorage.setItem('role', res.role);
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
