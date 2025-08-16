// Interfaces para usuarios
export interface EstadisticasUsuariosDetalle {
  totalUsuarios: number;
  usuariosConCupones: number;
  usuariosConCuponesUtilizados: number;
  usuariosConCuponesPendientes: number;
  usuariosSinCupones: number;
  promediooCuponesPorUsuario: number;
}

export interface EstadisticasUsuarios {
  clientes: EstadisticasUsuariosDetalle;
  trabajadores: EstadisticasUsuariosDetalle;
}

// Interface para generales
export interface EstadisticasGenerales {
  totalCupones: number;
  cuponesUtilizados: number;
  cuponesActivos: number;
  cuponesPendientes: number;
  cuponesExpirados: number;
  porcentajeUtilizacion: number;
  promedioEvaluacion: number;
}

// Interface principal de estadísticas generales
export interface Estadisticas {
  generales: EstadisticasGenerales;
  porMes: any[];
  porDia: any[];
  porNegocio: any[];
  porCategoria: any[];
  porOferta: any[];
  usuarios: EstadisticasUsuarios;
}

export const initializeEstadisticasGenerales = (): EstadisticasGenerales => ({
  totalCupones: 0,
  cuponesUtilizados: 0,
  cuponesActivos: 0,
  cuponesPendientes: 0,
  cuponesExpirados: 0,
  porcentajeUtilizacion: 0,
  promedioEvaluacion: 0,
});

export const initializeEstadisticasUsuariosDetalle = (): EstadisticasUsuariosDetalle => ({
  totalUsuarios: 0,
  usuariosConCupones: 0,
  usuariosConCuponesUtilizados: 0,
  usuariosConCuponesPendientes: 0,
  usuariosSinCupones: 0,
  promediooCuponesPorUsuario: 0,
});

export const initializeEstadisticasUsuarios = (): EstadisticasUsuarios => ({
  clientes: initializeEstadisticasUsuariosDetalle(),
  trabajadores: initializeEstadisticasUsuariosDetalle(),
});

export const initializeEstadisticas = (): Estadisticas => ({
  generales: initializeEstadisticasGenerales(),
  porMes: [],
  porDia: [],
  porNegocio: [],
  porCategoria: [],
  porOferta: [],
  usuarios: initializeEstadisticasUsuarios(),
});