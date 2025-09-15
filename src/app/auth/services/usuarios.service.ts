import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  apellido?: string | null;
  email: string;
  telefono?: string | null;
}

export interface CreateUsuarioDto {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  city?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  crear(dto: CreateUsuarioDto): Observable<{ userId: number; token: string }> {
    const payload = {
      nombre: dto.firstName,
      apellido: dto.lastName,
      email: dto.email,
      password: dto.password,
      telefono: dto.phone,
      pais: dto.country,
      ciudad: dto.city,
    };
    return this.http.post<{ userId: number; token: string }>(
      `${this.api}/usuarios/register`,
      payload
    );
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/usuarios`);
  }
}
