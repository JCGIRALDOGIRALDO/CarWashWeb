import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isHovered = false;
  private roles: string[] = [];
  isEmpresa = false;
  isUsuario = false;
  isOwnerOrManager = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.leerRolesDesdeToken();

    this.isEmpresa = this.tieneRolApp('empresa');
    this.isUsuario = this.tieneRolApp('usuario');
    this.isOwnerOrManager = this.tieneRolEmpresa(['owner', 'manager']);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('empresaId');
    }
    this.router.navigate(['/login']);
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }
  onMouseLeave(): void {
    this.isHovered = false;
  }

  private leerRolesDesdeToken(): void {
    this.roles = [];
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const claim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const raw = decoded?.[claim];

      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      this.roles = list
        .filter(Boolean)
        .map((r: string) => r.trim().toLowerCase());
    } catch {
      this.roles = [];
    }
  }

  private tieneRolApp(rol: 'empresa' | 'usuario'): boolean {
    return this.roles.includes(rol);
  }

  private tieneRolEmpresa(validos: string[]): boolean {
    const setVal = validos.map((x) => x.toLowerCase());
    return this.roles.some((r) => setVal.includes(r));
  }
}
