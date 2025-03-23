import { Component } from '@angular/core';
import { MesasService } from '../../services/mesas.service';
import { Mesa } from '../../models/mesa.model';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.scss'
})
export class MesasComponent {
  mesas : Mesa[] = [];
  constructor(public srvMesas: MesasService, srvPedidos: PedidosService){
    srvMesas.getMesas().subscribe(result => {
      console.log(result);
    })

    srvPedidos.getPedidosCocina().subscribe(result => {
      console.log(result);
    })
  }
  
  

}
