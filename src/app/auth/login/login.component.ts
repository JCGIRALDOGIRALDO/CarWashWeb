// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isRegistering = false;
  loginType: 'Usuario' | 'Empresa' = 'Usuario';

  constructor(private auth: AuthServiceService, private router: Router) {}

  toggleRegister(): void {
    this.isRegistering = !this.isRegistering;
  }
  setLoginType(type: 'Usuario' | 'Empresa'): void {
    this.loginType = type;
  }

  login(): void {
    this.errorMessage = '';
    this.auth
      .login(this.loginType, { email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          const returnedRole = (res.role ?? this.loginType).toLowerCase();

          if (this.loginType === 'Empresa' && returnedRole !== 'empresa') {
            this.errorMessage =
              'Este usuario no es de empresa. Usa "Soy Usuario".';
            this.auth.logout();
            return;
          }
          if (this.loginType === 'Usuario' && returnedRole !== 'usuario') {
            this.errorMessage =
              'Este usuario pertenece a una empresa. Usa "Soy Empresa".';
            this.auth.logout();
            return;
          }

          this.router.navigate(['/home']);
        },
        error: () => (this.errorMessage = 'Credenciales incorrectas'),
      });
  }
}
