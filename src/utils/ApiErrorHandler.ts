import { AxiosError } from 'axios';

export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTH = 'AUTH_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export class ApiError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    // Error de respuesta (el servidor respondió con un código de estado diferente de 2xx)
    if (error.response) {
      const statusCode = error.response.status;
      
      // Mapear códigos de estado HTTP a tipos de error
      switch (statusCode) {
        case 400:
          return new ApiError(
            error.response.data?.message || 'Datos inválidos', 
            ErrorType.VALIDATION, 
            statusCode, 
            error
          );
        case 401:
          return new ApiError(
            'Su sesión ha expirado o no está autorizado', 
            ErrorType.AUTH, 
            statusCode, 
            error
          );
        case 403:
          return new ApiError(
            'No tiene permisos para realizar esta acción', 
            ErrorType.AUTH, 
            statusCode, 
            error
          );
        case 404:
          return new ApiError(
            'Recurso no encontrado', 
            ErrorType.NOT_FOUND, 
            statusCode, 
            error
          );
        case 422:
          return new ApiError(
            error.response.data?.message || 'Error de validación', 
            ErrorType.VALIDATION, 
            statusCode, 
            error
          );
        case 500:
        case 502:
        case 503:
          return new ApiError(
            'Error en el servidor', 
            ErrorType.SERVER, 
            statusCode, 
            error
          );
        default:
          return new ApiError(
            'Error desconocido en la comunicación con el servidor', 
            ErrorType.UNKNOWN, 
            statusCode, 
            error
          );
      }
    } 
    
    // Error de red (sin conexión)
    if (error.request) {
      return new ApiError(
        'No se pudo conectar con el servidor. Verifique su conexión a internet', 
        ErrorType.NETWORK, 
        undefined, 
        error
      );
    }
  }
  
  // Error no relacionado con Axios
  return new ApiError(
    error instanceof Error ? error.message : 'Error desconocido', 
    ErrorType.UNKNOWN, 
    undefined, 
    error
  );
};