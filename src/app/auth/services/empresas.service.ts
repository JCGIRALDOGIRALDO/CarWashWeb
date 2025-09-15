import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

export interface CreateEmpresaDto {
  razonSocial: string;
  nombreComercial?: string;
  nit?: string;
  email: string;
  password: string;
  telefono?: string;

  direccion?: string;
  ciudad?: string;
}

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}

  registrar(
    dto: CreateEmpresaDto
  ): Observable<{ empresaId: number; userId: number; token: string }> {
    return this.http.post<{ empresaId: number; userId: number; token: string }>(
      `${this.api}/auth/register-company`,
      dto
    );
  }
}
