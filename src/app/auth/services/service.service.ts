import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/Users`; // Endpoint base del backend

  constructor(private http: HttpClient) {}

  /**
   * Método para registrar un nuevo usuario
   */
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Método para obtener la lista de usuarios
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`); // Llama al método GET del backend
  }

  /**
   * Método para validar usuario (login)
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  /**
   * Método para cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
  }

  /**
   * Método para obtener información del usuario autenticado
   */
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
}
