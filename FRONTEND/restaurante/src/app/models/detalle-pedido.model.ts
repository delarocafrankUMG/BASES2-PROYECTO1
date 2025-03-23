export interface DetallePedido {
    id: number;
    pedidoId: number;
    productoId?: number;
    menuId?: number;
    cantidad: number;
    precio: number;
    estado: 'pendiente' | 'en preparación' | 'listo';
  }