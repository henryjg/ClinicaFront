// Interfaces de negocio
// export * from './negocio.interface';
export * from './citas.interface';
// export * from './categoria.interface';
export * from './medico.interface';
export * from './paciente.interface';
// export * from './sede.interface';
export * from './medicamento.interface';
// export * from './familiar.interface';
export * from './trabajador.interface';
// export * from './oficina.interface';
export * from './usuario.interface';
export * from './usuarios.interface';
export * from './historia.interface';
// export * from './noticias.interface';
export * from './slider.interface';
export * from './slider.interface';
export * from './sunat.interface';
export * from './paciente.interface';
export * from './ubigeo.interface';
export * from './api.response.interface';
export * from './archivo.interface';
export * from './foto.interface';
// export * from './pagina.interface';
// export * from './noticiasCategoria.interface';
export * from './preguntas.interface';
export * from './EvoltaInterfaces';
// Interfaces de estadísticas
export * from './estadisticas.interface';

// Tipos y utilidades comunes
export * from '../types/objetosweb';

// Tipos de error
export { ApiError, ErrorType } from '../utils/ApiErrorHandler';

// Interfaz para enlaces de breadcrumb (usado en varios componentes)
export interface Link {
  path: string;
  name: string;
}