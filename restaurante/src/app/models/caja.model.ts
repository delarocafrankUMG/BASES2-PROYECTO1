export interface Caja {
    id: number;
    empleado_id: number;
    saldo_apertura: number;
    saldo_cierre?: number;
    hora_inicio: Date;
    hora_fin?: Date;
    }