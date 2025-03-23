export interface Mesa {
    id: number;
    nombre: string;
    capacidad: number;
    estado: 'disponible' | 'ocupada' | 'reservada';
  }