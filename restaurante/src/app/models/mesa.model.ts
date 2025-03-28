import { Menu } from "./menu.model";
import { Producto } from "./producto.modelo";

export interface Mesa {
    id: number;
    nombre: string;
    capacidad: number;
    numero: number;
    estado: 'libre' | 'ocupada' | 'por desocupar';
    nuevoPedido: (Producto| Menu)[];
  }