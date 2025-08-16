// Servicios de API y configuración
export { api } from './axiosConfig';

// Servicios de autenticación
export { default as AuthService } from './Auth.service';

// Servicios principales
// export { default as NegocioService } from './Negocio.service';
export { default as CitasService } from './Citas.service';
// export { default as CuponService } from './Cupon.service';
export { default as UsuariosService } from './Usuarios.service';

// Servicios de negocio
export { default as TrabajadorService } from './Trabajador.service';
// export { default as FamiliaService } from './Familia.service';
// export { default as OficinaService } from './Oficina.service';
export { default as MedicoService } from './medico.service';
// export { default as ConvenioService } from './convenio.service';
// export { default as SedesService } from './Sedes.service';
// export { default as NegocioCategoriaService } from './NegocioCategoria.service';

// Servicios de contenido
// export { default as PublicidadService } from './Publicidad.service';
export { default as WebSliderService } from './Web.Slider.service';
// export { default as NoticiaService } from './Noticia.service';
// export { default as NoticiaCategoriaService } from './NoticiaCategoria.service';
// export { default as FotoService } from './Foto.service';

// Servicios de utilidad
export { default as ServidorArchivosService } from './ServidorArchivos.service';
export { default as ApiSunatService } from './apisunat.service';
export { default as WebPaginaService } from './Web.Pagina.service';
export { default as UbigeoService } from './Ubigeo.service';
export { default as EvoltaService } from './Evolta.service';
export { default as SunatService } from './sunat.service';

// Servicios de estadísticas
export { default as EstadisticasService } from './estadisticas.service';

// Aliases para retrocompatibilidad
// import OficinaService from './Oficina.service';
// export const add_oficina = (formData: FormData) => OficinaService.crear(formData);