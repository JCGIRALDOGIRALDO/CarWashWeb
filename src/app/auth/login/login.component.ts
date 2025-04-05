import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';

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
  isRegistering = true;
  loginType: 'Usuario' | 'Empresa' = 'Usuario';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  toggleRegister(): void {
    this.isRegistering = !this.isRegistering;
  }

  setLoginType(type: 'Usuario' | 'Empresa'): void {
    this.loginType = type;
  }

  login(): void {
    const loginData = { email: this.email, password: this.password };

    const request$ =
      this.loginType === 'Usuario'
        ? this.authService.loginUsuario(loginData)
        : this.authService.loginEmpresa(loginData);

    request$.subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas';
      },
    });
  }
}
