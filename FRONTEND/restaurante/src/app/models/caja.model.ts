export interface Caja {
    id: number;
    empleadoId: number;
    saldoApertura: number;
    saldoCierre?: number;
    estado: 'abierta' | 'cerrada';
  }