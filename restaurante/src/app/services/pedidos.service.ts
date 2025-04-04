import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { DetallePedido } from '../models/detalle-pedido.model';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.modelo';
import { Menu } from '../models/menu.model';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  agregarDetallePedido(detalle: Omit<DetallePedido, 'id' | 'estado'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}`, detalle);
  }

  getPedidosCocina(): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(`${this.apiUrl}`);
  }

  actualizarEstadoPedido(detallePedidoId: number, estado: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}`, { "detallePedidoId":detallePedidoId, "estado":estado });
  }
  
  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  // Obtener todos los menús
  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.apiUrl}/menus`);
  }

  // Obtener productos de un menú específico
  getMenuProductos(menuId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos-menu/${menuId}`);
  }

  // Crear pedido
  crearPedido(mesaId: number, empleadoId: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/pedido`, { mesaId, empleadoId });
  }
}
