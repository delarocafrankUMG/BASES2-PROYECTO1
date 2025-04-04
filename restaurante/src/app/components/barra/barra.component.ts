import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from '@angular/router';
import { Empleado } from '../../models/empleado.model';

@Component({
  selector: 'app-barra',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink,CommonModule],
  templateUrl: './barra.component.html',
  styleUrl: './barra.component.scss'
})
export class BarraComponent {
  empleado: Empleado | null;
  constructor(@Inject(DOCUMENT) private document: Document, public srvAuth: AuthService){
    const localStorage = document.defaultView?.localStorage;
     this.empleado =  JSON.parse(localStorage?.getItem('empleado') || '{}');
  }

  public logout (){
    this.empleado = null;
    this.srvAuth.logout();
  }

  esMesero(): boolean {
    return this.empleado?.tipo === 'Mesero' || this.empleado?.tipo === 'Admin';
  }

  esCajero(): boolean {
    return this.empleado?.tipo === 'Cajero' || this.empleado?.tipo === 'Admin';
  }

  esAdmin(): boolean {
    return this.empleado?.tipo === 'Admin';
  }
}
