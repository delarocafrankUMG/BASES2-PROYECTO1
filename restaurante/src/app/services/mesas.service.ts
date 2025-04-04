import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Mesa } from '../models/mesa.model';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  private apiUrl = environment.apiUrl + '/mesas';

  constructor(public http: HttpClient) { }

  
  getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  insertMesa(mesa: Partial<Mesa>): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesa);
  }

  updateMesaEstado(id: number, estado: string): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, { estado });
  }

  getPedidosPorMesa(id: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos/${id}`);
  }

}
