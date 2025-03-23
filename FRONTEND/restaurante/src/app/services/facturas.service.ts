import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/facuta.model';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private apiUrl = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  generarFactura(pedidoId: number, cajaId: number, total: number, metodoPago: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, { pedidoId, cajaId, total, metodoPago });
  }

  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }
}
