import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './auth/components/home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Ruta para el home (protección con AuthGuard)
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'login' },
];
