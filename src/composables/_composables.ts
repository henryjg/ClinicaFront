// ===================================================
// COMPOSABLES CENTRALIZADOS
// ===================================================

// Composables principales de entidades
// export { useCategorias } from './useCategorias';
// export { useCategoriaNoticia } from './useCategoria_noticia';
// export { useCliente } from './useCliente';
// export { useConvenios } from './useConvenio';
// export { useCupones } from './useCupones';
// export { useFamiliars } from './useFamiliar';
// export { useNegocios } from './useNegocio';
// export { useNoticias } from './useNoticias';
export { useCitas } from './useCitas';
// export { useOficina } from './useOficina';
// export { usePagina } from './usePagina';
// export { usePublicidad } from './usePublicidad';
// export { useSedes } from './useSedes';
export { useSliders } from './useSlider';
export { useTrabajador } from './useTrabajador';
export { useUsuario } from './useUsuarios';
export { useEstadisticas } from './useEstadisticas';

// Composables de recursos
// export { useFotos } from './useFotos';
export { useUbigeo } from './useUbigeo';
export { useGoogleMaps } from './useGoogleMaps';

// Composables de autenticación y estado
export { useAuth } from './useAuth';
export { useTokenRefresh } from './useTokenRefresh';
export { useItemState } from './useItemState';
export { useAuthStore } from '../stores/authStore';
export { usarAutenticacion } from './AuthValidate';
export { usarCarritoStore } from '../stores/OfertaCarrito';

// Composables utilitarios y herramientas
export { useSubirArchivo } from './useSubirArchivo';
export { Sunat } from './Sunat';
export { useErrorHandler } from './Tools/useErrorHandler';
export { useFileUpload } from './use_ArchivosUpload';

// Composables de validación
// export { useValidaOferta } from './Validaciones/useValidaOfertas';
// export { useValidaNegocio } from './Validaciones/useValidarNegocio';
// export { useValidaCategoria } from './Validaciones/useValidaCategoria';
// export { useValidaConvenio } from './Validaciones/useValidaConvenio';
// export { useValidaCategoria_noticia } from './Validaciones/useValidaCategoria_noticia';
// export { useValidaCliente } from './Validaciones/useValidaCliente';
export { useValidator } from './Validaciones/useValidator';
// export { useValidaNoticia } from './Validaciones/useValidaNoticia';