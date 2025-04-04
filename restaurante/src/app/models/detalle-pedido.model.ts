export interface DetallePedido {
    id: number;
    pedido_id: number;
    productoid?: number;
    menuid?: number;
    cantidad: number;
    precio: number;
    numero_mesa: number;
    producto: string;
    estado: 'Pendiente' | 'En preparación' | 'Listo' | 'Despachado';
  }