import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { AuthServiceService } from '../services/auth-service.service';
import {
  UsuariosService,
  CreateUsuarioDto,
} from '../services/usuarios.service';
import {
  EmpresasService,
  CreateEmpresaDto,
} from '../services/empresas.service';

type RegisterType = 'Usuario' | 'Empresa';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  tipo: RegisterType = 'Usuario';

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    city: '',
  };
  confirmPassword = '';

  company = {
    razonSocial: '',
    nombreComercial: '',
    nit: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    ciudad: '',
  };

  constructor(
    private usuariosSvc: UsuariosService,
    private empresasSvc: EmpresasService,
    private auth: AuthServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {}

  private notify(msg: string) {
    if (isPlatformBrowser(this.platformId)) window.alert(msg);
    else console.log('[ALERT]', msg);
  }

  changeType(t: RegisterType) {
    this.tipo = t;
  }

  submit(): void {
    if (this.tipo === 'Usuario') this.registerUsuario();
    else this.registerEmpresa();
  }

  private registerUsuario(): void {
    if (!this.user.password || this.user.password !== this.confirmPassword) {
      this.notify('Las contraseñas no coinciden.');
      return;
    }

    const dto: CreateUsuarioDto = {
      firstName: this.user.firstName.trim(),
      lastName: this.user.lastName.trim(),
      email: this.user.email.trim(),
      password: this.user.password,
      phone: this.user.phoneNumber?.trim() || undefined,
      country: this.user.country?.trim() || undefined,
      city: this.user.city?.trim() || undefined,
    };

    this.usuariosSvc.crear(dto).subscribe({
      next: (r) => {
        this.notify('Usuario registrado exitosamente.');
        if (!this.auth.isAuthenticated()) {
          this.auth
            .login('Usuario', { email: dto.email, password: dto.password })
            .subscribe(() => this.router.navigate(['/home']));
        }
      },
      error: (e) => {
        console.error(e);
        this.notify('No se pudo registrar el usuario.');
      },
    });
  }

  private registerEmpresa(): void {
    if (!this.company.password) {
      this.notify('Contraseña requerida.');
      return;
    }

    const dto: CreateEmpresaDto = {
      razonSocial: this.company.razonSocial.trim(),
      nombreComercial: this.company.nombreComercial?.trim(),
      nit: this.company.nit?.trim(),
      email: this.company.email.trim(),
      password: this.company.password,
      telefono: this.company.telefono?.trim(),
      direccion: this.company.direccion?.trim(),
      ciudad: this.company.ciudad?.trim(),
    };

    this.empresasSvc.registrar(dto).subscribe({
      next: () => {
        this.notify('Empresa registrada exitosamente.');
        this.auth
          .login('Empresa', { email: dto.email, password: dto.password })
          .subscribe(() => this.router.navigate(['/home']));
      },
      error: (e) => {
        console.error(e);
        this.notify('No se pudo registrar la empresa.');
      },
    });
  }
}
