export interface Empleado {
    id: number;
    nombre: string;
    tipo: 'Cajero' | 'Mesero' | 'Admin';
    turno: string;
  }
  