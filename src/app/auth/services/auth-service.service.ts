import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  loginUsuario(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  loginEmpresa(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Clients/login`, data);
  }
}
