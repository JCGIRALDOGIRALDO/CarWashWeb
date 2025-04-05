import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    country: '',
    city: '',
    phoneNumber: '',
    role: 'Usuario',
  };

  confirmPassword: string = '';
  users: User[] = [];

  constructor(private serviceService: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  register(): void {
    if (!this.user.password || !this.confirmPassword) {
      alert('Ambos campos de contraseña son obligatorios');
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Convertir la fecha a formato ISO antes de enviar al backend
    this.user.dateOfBirth = new Date(this.user.dateOfBirth).toISOString();
    this.serviceService.register(this.user).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Usuario registrado exitosamente');
        this.loadUsers();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        if (error.status === 400) {
          alert('Solicitud inválida. Revisa los datos ingresados.');
        } else if (error.status === 500) {
          alert('Error interno en el servidor.');
        } else {
          alert('Error desconocido. Verifica la consola para más detalles.');
        }
      },
    });
  }

  loadUsers(): void {
    this.serviceService.getUsers().subscribe(
      (data) => {
        //console.log('Respuesta completa de la API:', data);

        if (Array.isArray(data)) {
          this.users = data;
        }
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar la lista de usuarios.');
      }
    );
  }

  resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      dateOfBirth: '',
      country: '',
      city: '',
      phoneNumber: '',
      role: 'Usuario',
    };
    this.confirmPassword = '';
  }
}
