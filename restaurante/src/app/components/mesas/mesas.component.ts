import { Component } from '@angular/core';
import { MesasService } from '../../services/mesas.service';
import { Mesa } from '../../models/mesa.model';
import { PedidosService } from '../../services/pedidos.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { Producto } from '../../models/producto.modelo';
import { DetallePedido } from '../../models/detalle-pedido.model';
import {MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Menu } from '../../models/menu.model';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CajasService } from '../../services/cajas.service';
import {MatDividerModule} from '@angular/material/divider';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-mesas',
    imports: [ CommonModule, MatBadgeModule, MatChipsModule, DragDropModule, CdkDropList, CdkDrag, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
    templateUrl: './mesas.component.html',
    styleUrl: './mesas.component.scss'
})
export class MesasComponent {

  mesas : Mesa[] = [];
  productos: (Producto|Menu)[] = [];
  pedidos: DetallePedido[] = [];
  menus: Menu[] = [];


  constructor(public srvMesas: MesasService,public srvPedidos: PedidosService,public srvCaja: CajasService,private dialog: MatDialog){
    srvMesas.getMesas().subscribe(result => {
      this.mesas = result;
      this.mesas.forEach(element => {
        element.nuevoPedido = []
      });
      console.log('mesas', result)
    })

    srvPedidos.getPedidosCocina().subscribe(result => {
      this.pedidos = result;
      console.log('pedidos', this.pedidos)
    })

    srvPedidos.getMenus().subscribe(result => {
      this.productos = result;
      console.log('menus', this.menus)
    });

    srvPedidos.getProductos().subscribe(result => {
      this.productos = this.productos.concat(result);
    })

    srvPedidos.getMenuProductos(2).subscribe(result => {
      console.log(result);
    })

    srvCaja.getCajas().subscribe(result => {
      console.log('cajas', result)
    })
  }

  public fncGetPedidosPorMesa(numero_mesa:number){
    return this.pedidos.filter(x => x.numero_mesa === numero_mesa);
  }
  
  public removePedido(pedido: Producto|Menu, mesa: Mesa){
    const index = mesa.nuevoPedido.findIndex(item => item.listingId === pedido.listingId);
    if (index !== -1) {
      mesa.nuevoPedido.splice(index, 1); // Elimina solo la primera coincidencia
    }
  }

  public facturar (){
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Método de pago seleccionado:', result);
        // Aquí puedes llamar a tu API para facturar
      }
    });
  }

  confirmarPedido(mesa: Mesa){
    const pedidoId = this.fncGetPedidosPorMesa(mesa.numero)[0].pedido_id;
    let detallePedido = this.agruparPedidos(mesa.nuevoPedido, pedidoId, mesa.numero);
    detallePedido.forEach(element => {
      console.log(element)
      this.srvPedidos.agregarDetallePedido(element).subscribe();
    });
    
  }

  drop(event: CdkDragDrop<(Producto|Menu)[]>) {
    if (event.previousContainer !== event.container) {
      let item = event.previousContainer.data[event.previousIndex];
      item.listingId = this.generateRandomString(5);
      // Agregar la copia del item al array de destino
      event.container.data.push({ ...item });
    }
  }
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  agruparPedidos(
    listado: any[], 
    pedido_id: number, 
    numeroMesa: number
  ): DetallePedido[] {
    
    const map = new Map<number, DetallePedido>();
  
    listado.forEach(item => {
      const id = item.id;
  
      if (!map.has(id)) {
        map.set(id, {
          id,
          pedido_id,
          productoid: item.precio ? id : undefined, // Si tiene precio, se asume como producto
          menuid: !item.precio ? id : undefined, // Si no tiene precio, se asume como menú
          cantidad: 1,
          precio: item.precio || 0,
          numero_mesa: numeroMesa,
          producto: item.nombre,
          estado: 'pendiente'
        });
      } else {
        const detalle = map.get(id)!;
        detalle.cantidad += 1;
      }
    });
  
    return Array.from(map.values());
  }
  
}
