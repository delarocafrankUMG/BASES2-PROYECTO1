export interface Factura {
    id: number;
    pedidoId: number;
    cajaId: number;
    total: number;
    metodoPago: string;
    fecha: string;
  }