import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = `${environment.apiUrl}/empleados`; // Ruta para el login

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, { username, password });
  }
}
