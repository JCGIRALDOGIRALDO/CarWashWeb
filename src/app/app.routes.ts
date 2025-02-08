import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './auth/components/home/home.component'; // Asegúrate de importar correctamente
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  // Redirección inicial al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para el login
  { path: 'login', component: LoginComponent },

  // Ruta para el home (protección con AuthGuard)
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard], // Protegido por el guard
  },

  // Ruta para manejar cualquier URL no reconocida
  { path: '**', redirectTo: 'login' },
];
