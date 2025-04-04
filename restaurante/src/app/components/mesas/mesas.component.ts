import { Component, Inject } from '@angular/core';
import { MesasService } from '../../services/mesas.service';
import { Mesa } from '../../models/mesa.model';
import { PedidosService } from '../../services/pedidos.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { Producto } from '../../models/producto.modelo';
import { DetallePedido } from '../../models/detalle-pedido.model';
import {MatChipsModule} from '@angular/material/chips';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Menu } from '../../models/menu.model';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CajasService } from '../../services/cajas.service';
import {MatDividerModule} from '@angular/material/divider';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FacturasService } from '../../services/facturas.service';
import { Pedido } from '../../models/pedido.model';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Empleado } from '../../models/empleado.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-mesas',
    imports: [ CommonModule, MatBadgeModule, MatChipsModule, DragDropModule, CdkDropList, 
      CdkDrag, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,MatFormFieldModule, MatInputModule, FormsModule ],
    templateUrl: './mesas.component.html',
    styleUrl: './mesas.component.scss'
})
export class MesasComponent {

  mesas : Mesa[] = [];
  productos: (Producto|Menu)[] = [];
  pedidos: DetallePedido[] = [];
  menus: Menu[] = [];
  codigoEmpleado: number = 0;
  menuFind: string = '';
  productosFiltered: (Producto|Menu)[] = [];


  constructor(public srvMesas: MesasService,public srvPedidos: PedidosService,public srvCaja: CajasService,private dialog: MatDialog, public srvFactura: FacturasService
    , @Inject(DOCUMENT) private document: Document
  ){
        const localStorage = document.defaultView?.localStorage;
        const empleado : Empleado = JSON.parse(localStorage?.getItem('empleado') || '{}');
        this.codigoEmpleado = empleado.id;

    srvMesas.getMesas().subscribe(result => {
      this.mesas = result.sort((a, b) => a.numero - b.numero);;
      this.mesas.forEach(mesa => {
          srvMesas.getPedidosPorMesa(mesa.id).subscribe(result =>{
            result.forEach(pedido => {
              pedido.nuevoPedido = [];
            });
            mesa.pedidos = result;
          })
      });
      
      console.log('mesas', result)
    })

    srvPedidos.getPedidosCocina().subscribe(result => {
      this.pedidos = result;
      console.log('pedidos', this.pedidos)
    })

    srvPedidos.getMenus().subscribe(result => {
      result.forEach(element => {
        element.type = 'menu';
      });
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

  public fncGetDetallePedido(idPedido:number){
    return this.pedidos.filter(x => x.pedido_id === idPedido);
  }

  public async fncGetPedidoPorMesa(numero_mesa: number): Promise<Pedido[]> {
    try {
      const pedido = await lastValueFrom(this.srvMesas.getPedidosPorMesa(numero_mesa));
      console.log('Pedido de mesa ',pedido)
      return pedido;
    } catch (error) {
      console.error("Error al obtener pedidos por mesa:", error);
      return [];
    }
  }
  
  public removePedido(producto: Producto|Menu, _pedido: Pedido){
    const index = _pedido.nuevoPedido.findIndex(item => item.listingId === producto.listingId);
    if (index !== -1) {
     _pedido.nuevoPedido.splice(index, 1); // Elimina solo la primera coincidencia
    }
  }

  public addPedido(mesaid: number){
    this.srvPedidos.crearPedido(mesaid, this.codigoEmpleado).subscribe(result => {
        console.log('pedido nuevo',result)
        result.nuevoPedido = [];
        result.pedido_id = result.id;
        this.mesas.find(x => x.id == mesaid)?.pedidos.push(result);
    });
  }

  async openPaymentDialog(pedido: Pedido) {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '600px'
    });
  
    try {
      // Esperar el resultado del modal
      const result = await firstValueFrom(dialogRef.afterClosed());
      console.log('resultado' , result)
      if (result) {
        // Esperar la respuesta de getCajas() y obtener el primer elemento de la lista
        const cajas = await firstValueFrom(this.srvCaja.getCajas());
        const caja = cajas.find(x=> x.saldo_cierre == null); // Asumimos que al menos hay una caja
        if(caja)
        {
        // Generar factura y esperar respuesta
        await firstValueFrom(this.srvFactura.generarFactura(pedido.pedido_id, caja.id, result));
  
        // Obtener pedidos por mesa y actualizar la UI
        const pedidosMesa = await firstValueFrom(this.srvMesas.getPedidosPorMesa(pedido.numero_mesa));
        console.log('pedidos mesa', pedidosMesa)
        pedidosMesa.forEach(pedidoMesa => {
          pedidoMesa.nuevoPedido = [];
        });
  
        if (this.mesas) {
          const mesa = this.mesas.find(x => x.id == pedido.numero_mesa);
          if (mesa) mesa.pedidos = pedidosMesa;
        }
      }else{
        alert("Error en el proceso de pago, no existe caja abierta.");
      }
      }
    } catch (error) {
      alert("Error en el proceso de pago: "+ error);
    }
  }

  async confirmarPedido(pedido: Pedido) {
    let detallePedido = this.agruparPedidos(pedido.nuevoPedido, pedido.pedido_id, pedido.numero_mesa);
  
    try {
      await Promise.all(
        detallePedido.map(element => firstValueFrom(this.srvPedidos.agregarDetallePedido(element)))
      );

      const mesa = this.mesas?.find(x => x.id === pedido.numero_mesa);

      if (mesa) {
        this.srvMesas.getPedidosPorMesa(mesa.id).subscribe(result => {
          result.forEach(pedido => {
            pedido.nuevoPedido = [];
          });
          mesa.pedidos = result;
        });
      }

      this.srvPedidos.getPedidosCocina().subscribe(result => {
        this.pedidos = result;
      })

      console.log("Todos los pedidos fueron confirmados.");
    } catch (error) {
      console.error("Error al confirmar pedidos:", error);
    }
  }

  ciclarEstadoMesa(mesa: Mesa) {
    const estados: Mesa['estado'][] = ['Libre', 'Ocupada', 'Por Desocupar'];
    const indiceActual = estados.indexOf(mesa.estado);
    const nuevoEstado = estados[(indiceActual + 1) % estados.length];
  
    mesa.estado = nuevoEstado;
    this.srvMesas.updateMesaEstado(mesa.id, mesa.estado).subscribe();
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
    console.log('agrupar', listado)
    listado.forEach(item => {
      const id = item.id;
  
      if (!map.has(id)) {
        map.set(id, {
          id,
          pedido_id,
          productoid: !item.type ? id : undefined, // Si no tiene tipo, se asume como producto
          menuid: item.type ? id : undefined, // Si tiene tipo, se asume como menú
          cantidad: 1,
          precio: item.precio || 0,
          numero_mesa: numeroMesa,
          producto: item.nombre,
          estado: 'Pendiente'
        });
      } else {
        const detalle = map.get(id)!;
        detalle.cantidad += 1;
      }
    });
  
    return Array.from(map.values());
  }
  
  filtrarMenu() {
    this.productosFiltered = this.productos.filter(x => 
      x.nombre.toLowerCase().includes(this.menuFind.toLowerCase())
    );
  }
}
