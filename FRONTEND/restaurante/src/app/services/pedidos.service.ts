import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { DetallePedido } from '../models/detalle-pedido.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  agregarDetallePedido(detalle: Omit<DetallePedido, 'id' | 'estado'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/detalle`, detalle);
  }

  getPedidosCocina(): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(`${this.apiUrl}/cocina`);
  }

  actualizarEstadoPedido(detallePedidoId: number, estado: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/estado`, { detallePedidoId, estado });
  }
}
