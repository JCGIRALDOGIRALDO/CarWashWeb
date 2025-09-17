import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './auth/components/home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      {
        path: 'appointments',
        component: AppointmentsComponent,
        canActivate: [roleGuard],
        data: { appRole: 'Empresa' },
      },

      {
        path: 'mis-citas',
        component: AppointmentsComponent,
        canActivate: [roleGuard],
        data: { appRole: 'Usuario' },
      },

      // === Solo OWNER/MANAGER dentro de Empresa (opcional) ===
      // {
      //   path: 'servicios',
      //   component: ServicesComponent,
      //   canActivate: [roleGuard],
      //   data: { appRole: 'Empresa', companyRoles: ['OWNER','MANAGER'] }
      // },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
