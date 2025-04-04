import { Inject, Injectable } from '@angular/core';
import { EmpleadosService } from '../services/empleados.service';
import { Empleado } from '../models/empleado.model';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public srvEmpleado: EmpleadosService, @Inject(DOCUMENT) private document: Document, public router: Router) { }

  public onLogin(userName:string, password:string) {
    const passwordBase64 = btoa(password);
    const localStorage = document.defaultView?.localStorage

    this.srvEmpleado.login(userName, passwordBase64).subscribe({
      next: (empleado: Empleado) => {
        console.log(empleado);
        localStorage?.setItem('empleado', JSON.stringify(empleado));
        if(empleado.tipo == 'Cajero'){
          this.router.navigate(['/cajas']);
        }
        else if (empleado.tipo == 'Mesero'){
          this.router.navigate(['/mesas']); 
        }else if (empleado.tipo == 'Admin'){
          this.router.navigate(['/reportes']); 
        }
      },
      error: (error) => {
        alert('Credenciales incorrectas');
      }
    });
  }

  logout() {
    localStorage.removeItem('empleado'); 
    this.router.navigate(['/login']); 
  }
}
