import { useToast, POSITION } from "vue-toastification";
import { ApiError, ErrorType } from "./ApiErrorHandler";
import { AxiosError } from "axios";

// Configuración común para todos los tipos de notificaciones
const commonConfig = {
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
};

export const Success = (texto: string) => {
  const toast = useToast();
  toast.success(texto, {
    ...commonConfig,
    timeout: 3000,
    position: POSITION.BOTTOM_RIGHT,
  });
  return toast;
};

export const SuccessTop = (texto: string) => {
  const toast = useToast();
  toast.success(texto, {
    ...commonConfig,
    timeout: 3000,
    position: POSITION.TOP_CENTER,
  });
  return toast;
};

export const Error = (texto: string) => {
  const toast = useToast();
  toast.error(texto, {
    ...commonConfig,
    timeout: 3300,
    position: POSITION.BOTTOM_RIGHT,
  });
  return toast;
};

export const ErrorTop = (texto: string) => {
  const toast = useToast();
  toast.error(texto, {
    ...commonConfig,
    timeout: 3300,
    position: POSITION.TOP_CENTER,
  });
  return toast;
};

export const Advertencia = (texto: string) => {
  const toast = useToast();
  toast.warning(texto, {
    ...commonConfig,
    timeout: 2000,
    position: POSITION.TOP_CENTER,
  });
  return toast;
};

export const AdvertenciaTop = (texto: string) => {
  const toast = useToast();
  toast.warning(texto, {
    ...commonConfig,
    timeout: 2000,
    position: POSITION.TOP_CENTER,
  });
  return toast;
};

/**
 * Maneja errores de API de manera inteligente basado en el tipo de error
 */
export const handleApiErrorWithNotification = (error: unknown, showNotification = true) => {
  // Si ya es un ApiError, úsalo directamente
  if (error instanceof ApiError) {
    if (showNotification) {
      switch (error.type) {
        case ErrorType.AUTH:
          ErrorTop(error.message);
          break;
        case ErrorType.VALIDATION:
          Advertencia(error.message);
          break;
        case ErrorType.NETWORK:
          ErrorTop('No se pudo conectar con el servidor. Verifique su conexión a internet.');
          break;
        case ErrorType.SERVER:
          Error('El servidor no está respondiendo correctamente. Intente más tarde.');
          break;
        default:
          Error(error.message);
          break;
      }
    }
    console.error(`[${error.type}]`, error.message, error.originalError);
    return error;
  }
  
  // Si no, conviértelo y procesa
  const apiError = error instanceof AxiosError 
    ? handleAxiosError(error)
    : new ApiError(
        error && typeof error === 'object' && 'message' in error ? (error as Error).message : 'Error desconocido',
        ErrorType.UNKNOWN,
        undefined,
        error
      );
      
  if (showNotification) {
    Error(apiError.message);
  }
  console.error(`[${apiError.type}]`, apiError.message, apiError.originalError);
  return apiError;
};

// Función auxiliar para manejar errores de Axios
const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    const statusCode = error.response.status;
    const message = (error.response.data as { message?: string })?.message || 'Error en la solicitud';
    
    switch (statusCode) {
      case 401:
        return new ApiError('Su sesión ha expirado o no está autorizado', ErrorType.AUTH, statusCode, error);
      case 403:
        return new ApiError('No tiene permisos para realizar esta acción', ErrorType.AUTH, statusCode, error);
      case 400:
      case 422:
        return new ApiError(message, ErrorType.VALIDATION, statusCode, error);
      case 404:
        return new ApiError('Recurso no encontrado', ErrorType.NOT_FOUND, statusCode, error);
      case 500:
      case 502:
      case 503:
        return new ApiError('Error en el servidor', ErrorType.SERVER, statusCode, error);
      default:
        return new ApiError(message, ErrorType.UNKNOWN, statusCode, error);
    }
  } else if (error.request) {
    return new ApiError(
      'No se pudo conectar con el servidor. Verifique su conexión a internet',
      ErrorType.NETWORK,
      undefined,
      error
    );
  } else {
    return new ApiError(error.message, ErrorType.UNKNOWN, undefined, error);
  }
};

const Notif = {
  Success,
  SuccessTop,
  Error,
  ErrorTop,
  Advertencia,
  AdvertenciaTop,
  handleApiErrorWithNotification
};

export default Notif;