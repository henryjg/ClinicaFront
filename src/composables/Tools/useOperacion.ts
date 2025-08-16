import { Ref, ref } from 'vue';
import NProgress from 'nprogress';
import { useErrorHandler } from './useErrorHandler';

export interface OperacionOptions<T> {
  /**
   * Indicador reactivo de carga para controlar UI
   */
  indicadorCarga?: Ref<boolean>;
  
  /**
   * Mensaje que se mostrará en caso de éxito
   */
  mensajeExito?: string;
  
  /**
   * Controla si se deben mostrar notificaciones de error (true por defecto)
   */
  mostrarErrores?: boolean;
  
  /**
   * Controla si se debe mostrar la barra de progreso global (true por defecto)
   */
  mostrarCarga?: boolean;
  
  /**
   * Función que se ejecuta solo si la operación fue exitosa
   */
  onExito?: (resultado: T) => Promise<void> | void;
  
  /**
   * Función que se ejecuta siempre al final, independientemente del resultado
   */
  onFinalizacion?: () => Promise<void> | void;
  
  /**
   * Controla si se debe redirigir en caso de error de autenticación
   */
  redirectOnAuth?: boolean;
}

export function useOperacion() {
  const { handleError } = useErrorHandler();
  
  // Estado global que puede usarse para operaciones que no tienen su propio estado
  const isLoading = ref(false);

  /**
   * Ejecuta una operación asíncrona con manejo automatizado de errores y estados
   * 
   * @param operacion - Función asíncrona a ejecutar
   * @param options - Configuraciones de la operación
   * @returns Resultado de la operación o undefined si ocurrió un error
   */
  const ejecutar = async <T>(
    operacion: () => Promise<T>,
    options: OperacionOptions<T> = {}
  ): Promise<T | undefined> => {
    const {
      indicadorCarga = isLoading,
      mensajeExito,
      mostrarErrores = true,
      mostrarCarga = true,
      onExito,
      onFinalizacion,
      redirectOnAuth = false
    } = options;

    // Activar indicadores de carga
    if (mostrarCarga) NProgress.start();
    indicadorCarga.value = true;
    
    try {
      // Ejecutar operación principal
      const resultado = await operacion();
      
      // Si hay función de éxito, ejecutarla con el resultado
      if (onExito) {
        await onExito(resultado);
      }
      
      return resultado;
    } catch (error: unknown) {
      // Usar el manejador centralizado de errores con las opciones especificadas
      handleError(error, mostrarErrores, redirectOnAuth);
      return undefined;
    } finally {
      // Desactivar indicadores de carga, sin importar resultado
      if (mostrarCarga) NProgress.done();
      indicadorCarga.value = false;
      
      // Ejecutar función de finalización si existe
      if (onFinalizacion) {
        await onFinalizacion();
      }
    }
  };

  return { 
    ejecutar,
    isLoading
  };
}