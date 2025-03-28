export interface Caja {
    id: number;
    empleadoid: number;
    saldoapertura: number;
    saldocierre?: number;
    estado: 'abierta' | 'cerrada';
  }