import { Pedido } from "./pedido.model";

export interface Mesa {
    id: number;
    nombre: string;
    capacidad: number;
    numero: number;
    estado: 'Libre' | 'Ocupada' | 'Por Desocupar';

    pedidos: Pedido[];
  }