// src/app/auth/services/usuarios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface CreateUsuarioDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Usuario {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private api = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  crear(dto: CreateUsuarioDto): Observable<{ userId: number }> {
    return this.http.post<{ userId: number }>(this.api, dto);
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }
}
