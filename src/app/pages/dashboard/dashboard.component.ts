import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Token decodificado:', decoded);
        this.userRole = (
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] || ''
        )
          .trim()
          .toLowerCase();
        console.log('Rol del usuario:', this.userRole);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }
}
