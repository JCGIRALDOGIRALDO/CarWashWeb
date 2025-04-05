import { Component, OnInit } from '@angular/core';

//const jwt_decode = require('jwt-decode');

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent implements OnInit {
  userRole: string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      //const decodedToken: any = jwt_decode(token);
      //this.userRole = decodedToken.role || null;
    }
  }
}
