// filtros.interfaces.ts
export interface filtros_Negocio {
    f_estado?: string | null;
    f_mes_registro?: number | null;
    f_anio_registro?: number | null;
    f_fecha_inicio?: string | null; // Formato de fecha en string 'YYYY-MM-DD'
    f_fecha_fin?: string | null; // Formato de fecha en string 'YYYY-MM-DD'
}

export const initializeNegocioFiltro = (): filtros_Negocio => {
    return {
      f_estado: null,
      f_mes_registro: null,
      f_anio_registro: null,
      f_fecha_inicio: null,
      f_fecha_fin: null, 
    };
};
  