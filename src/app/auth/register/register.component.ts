import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import {
  UsuariosService,
  CreateUsuarioDto,
  Usuario,
} from '../services/usuarios.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    city: '',
    role: 'Usuario',
  };

  confirmPassword = '';
  users: Usuario[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private auth: AuthServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.auth.isAuthenticated()) {
      this.loadUsers();
    }
  }

  private notify(msg: string) {
    if (isPlatformBrowser(this.platformId)) window.alert(msg);
    else console.log('[ALERT]', msg);
  }

  loadUsers(): void {
    this.usuariosService.listar().subscribe({
      next: (data) => {
        if (Array.isArray(data)) this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        if (err.status !== 401)
          this.notify('Error al cargar la lista de usuarios.');
      },
    });
  }

  register(): void {
    if (!this.user.password || !this.confirmPassword) {
      this.notify('Ambos campos de contraseña son obligatorios');
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.notify('Las contraseñas no coinciden');
      return;
    }

    const dto: CreateUsuarioDto = {
      firstName: this.user.firstName.trim(),
      lastName: this.user.lastName.trim(),
      email: this.user.email.trim(),
      password: this.user.password,
      phone: this.user.phoneNumber?.trim() || undefined,
    };

    this.usuariosService.crear(dto).subscribe({
      next: () => {
        this.notify('Usuario registrado exitosamente');
        this.resetForm();
        if (this.auth.isAuthenticated()) this.loadUsers();
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        if (error.status === 400)
          this.notify('Solicitud inválida. Revisa los datos.');
        else if (error.status === 500)
          this.notify('Error interno del servidor.');
        else this.notify('Error desconocido. Revisa la consola.');
      },
    });
  }

  resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      dateOfBirth: '',
      country: '',
      city: '',
      role: 'Usuario',
    };
    this.confirmPassword = '';
  }
}
