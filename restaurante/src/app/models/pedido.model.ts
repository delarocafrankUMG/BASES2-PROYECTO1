import { Menu } from "./menu.model";
import { Producto } from "./producto.modelo";

export interface Pedido {
    id: number;
    pedido_id: number;
    numero_mesa: number;
    producto: string;
    cantidad: number;
    estado: string;
    total: number
    
    nuevoPedido: (Producto| Menu)[];
  }