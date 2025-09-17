import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public userRole: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      this.userRole = String(
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || ''
      )
        .trim()
        .toLowerCase();
    } catch (e) {
      console.error('Error al decodificar el token:', e);
    }
  }
}
