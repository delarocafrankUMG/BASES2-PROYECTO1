import { Component } from '@angular/core';
import { DetallePedido } from '../../models/detalle-pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../models/mesa.model';
import { MesasService } from '../../services/mesas.service';

@Component({
  selector: 'app-cocina',
  imports: [MatCardModule, MatChipsModule, CommonModule],
  templateUrl: './cocina.component.html',
  styleUrl: './cocina.component.scss'
})
export class CocinaComponent {
pedidos:DetallePedido[] = [];
mesas: Mesa[] = [];
constructor(public srvPedidos: PedidosService, srvMesas: MesasService){
  this.recargarPedidos();
  srvMesas.getMesas().subscribe(result => {
    this.mesas = result;
  })
}

private recargarPedidos(){
  this.srvPedidos.getPedidosCocina().subscribe(result => {
    this.pedidos = result;
    console.log('pedidos', this.pedidos)
  });
}

public getMesaNumber(id:number){
 return this.mesas.find(x=>x.id = id)?.numero;
}

public ciclarEstadoPedido(pedido: DetallePedido){
  console.log(pedido)
  const estados: DetallePedido['estado'][] = ['Pendiente', 'En preparación', 'Listo', 'Despachado'];
    const indiceActual = estados.indexOf(pedido.estado);
    const nuevoEstado = estados[(indiceActual + 1) % estados.length];
    console.log(nuevoEstado)
    this.srvPedidos.actualizarEstadoPedido(pedido.id, nuevoEstado).subscribe(result=>{
      this.recargarPedidos();
    });
}
}
