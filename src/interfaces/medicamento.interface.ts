export interface Medicamento {
  id: number;
  nombre: string;
  precio_costo: number;
  precio_sugerido: number;
  stock_med: number;
  stock_max: number;
  foto: string;
  guia_id: number;
  laboratorio_id: number;
  unidad_id: number;
  modo_uso_id: number;
  presentacion_id: number;
}

export const initializeMedicamento = (): Medicamento => {
  return {
    id: 0,
    nombre: '',
    precio_costo: 0,
    precio_sugerido: 0,
    stock_med: 0,
    stock_max: 0,
    foto: '',
    guia_id: 0,
    laboratorio_id: 0,
    unidad_id: 0,
    modo_uso_id: 0,
    presentacion_id: 0,
  };
};


// -------------------------

export interface MedicamentoErrors {
  id: string;
  nombre: string;
  precio_costo: string;
  precio_sugerido: string;
  stock_med: string;
  stock_max: string;
  foto: string;
  guia_id: string;
  laboratorio_id: string;
  unidad_id: string;
  modo_uso_id: string;
  presentacion_id: string;
}

export const initializeMedicamentoErrors = (): MedicamentoErrors => {
  return {
    id: '',
    nombre: '',
    precio_costo: '',
    precio_sugerido: '',
    stock_med: '',
    stock_max: '',
    foto: '',
    guia_id: '',
    laboratorio_id: '',
    unidad_id: '',
    modo_uso_id: '',
    presentacion_id: ''
  };
};