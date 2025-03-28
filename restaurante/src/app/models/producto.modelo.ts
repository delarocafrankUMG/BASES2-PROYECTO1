export interface Producto {
    id: number;
    nombre: string;
    tipo: string;
    precio: number;
    cantidad?: number;
    menu?: string;
    listingId: string;
  }