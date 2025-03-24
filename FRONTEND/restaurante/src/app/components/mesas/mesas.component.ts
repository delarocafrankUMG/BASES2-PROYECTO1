import { Component } from '@angular/core';
import { MesasService } from '../../services/mesas.service';
import { Mesa } from '../../models/mesa.model';
import { PedidosService } from '../../services/pedidos.service';
import {ng 
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mesas', 
  standalone: true,
  imports: [DragDropModule],
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

    srvPedidos.getMenus().subscribe(result => {
      console.log(result);
    });

    srvPedidos.getProductos().subscribe(result => {
      console.log(result);
    })

    srvPedidos.getMenuProductos(2).subscribe(result => {
      console.log(result);
    })
  }
  
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
