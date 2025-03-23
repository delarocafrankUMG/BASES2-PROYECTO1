import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Caja } from '../models/caja.model';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  private apiUrl = `${environment.apiUrl}/cajas`;

  constructor(private http: HttpClient) {}

  abrirCaja(empleadoId: number, saldoApertura: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, { empleadoId, saldoApertura });
  }

  cerrarCaja(id: number, saldoCierre: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, { saldoCierre });
  }

  getCajas(): Observable<Caja[]> {
    return this.http.get<Caja[]>(this.apiUrl);
  }
}
