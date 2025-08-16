import { ApiError, ErrorType } from '../../utils/ApiErrorHandler';
import Notif from '../../utils/notificaciones';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

export function useErrorHandler() {
  const router = useRouter();
  const authStore = useAuthStore();

  /**
   * Maneja errores de API de manera centralizada
   * @param error Error capturado (ya convertido a ApiError por los servicios)
   * @param showNotification Si se debe mostrar notificación
   * @param redirectOnAuth Si se debe redirigir en caso de error de autenticación
   * @returns Información sobre si el error fue manejado correctamente
   */
  const handleError = (error: unknown, showNotification = true, redirectOnAuth = false) => {
    // Los errores ya vienen como ApiError desde los servicios
    if (error instanceof ApiError) {
      if (error.type === ErrorType.AUTH && error.statusCode === 401) {
        Notif.ErrorTop('Su sesión ha expirado, por favor vuelva a iniciar sesión');
          if (redirectOnAuth) {
          authStore.logout();
          router.push('/beneficios/loggin/');
        }
      } else if (showNotification) {
        switch (error.type) {
          case ErrorType.VALIDATION:
            Notif.Advertencia(error.message);
            break;
          case ErrorType.NETWORK:
            Notif.Error('No se pudo conectar con el servidor. Verifique su conexión a internet.');
            break;
          case ErrorType.SERVER:
            Notif.Error('El servidor no responde correctamente. Intente más tarde.');
            break;
          case ErrorType.NOT_FOUND:
            Notif.Advertencia('El recurso solicitado no fue encontrado.');
            break;
          default:
            Notif.Error(error.message);
        }
      }
      return { handled: true, error };
    }
    
    // Error no controlado
    if (showNotification) {
      Notif.Error('Ocurrió un error inesperado');
    }
    console.error('Error no controlado:', error);
    return { handled: false, error };
  };

  return { handleError };
}