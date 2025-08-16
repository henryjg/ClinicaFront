import { ref, computed } from 'vue';
import { useOperacion } from './Tools/useOperacion';
import EvoltaService from '../services/Evolta.service';
import { EvoltaClienteValidado, EvoltaClienteData } from '../interfaces/EvoltaInterfaces';
import { Alerta } from '../utils/_utils';

export interface UseEvoltaOptions {
  enviarEmail?: boolean; // Si enviar email automáticamente al validar
  mostrarErrores?: boolean;
  mostrarCarga?: boolean;
}

export function useEvolta(options: UseEvoltaOptions = {}) {
  const {
    enviarEmail = true,
    mostrarErrores = true,
    mostrarCarga = true
  } = options;

  // Estados reactivos
  const isLoading = ref(false);
  const clienteValidado = ref<EvoltaClienteValidado | null>(null);
  const datosCliente = ref<EvoltaClienteData | null>(null);
  const error = ref<string | null>(null);

  // Operaciones
  const { ejecutar } = useOperacion();

  // Computadas
  const esClienteActivo = computed(() => {
    return clienteValidado.value?.estadoOC === 'ACTIVO';
  });

  const codigoGenerado = computed(() => {
    return clienteValidado.value?.codigo || null;
  });

  /**
   * Valida un cliente por su número de documento
   * @param documento Número de documento a validar
   * @returns Promise<EvoltaClienteValidado | null>
   */
  const validarCliente = async (documento: string): Promise<EvoltaClienteValidado | null> => {
    if (!documento || documento.trim().length === 0) {
      if (mostrarErrores) {
        Alerta.Error('Error de validación', "Debe proporcionar un número de documento");
      }
      return null;
    }

    try {
      error.value = null;
      
      const resultado = await ejecutar(
        () => EvoltaService.validarCliente(documento.trim()),
        {
          indicadorCarga: mostrarCarga ? isLoading : undefined,
          mostrarErrores,
          mostrarCarga,
          onExito: async (cliente: EvoltaClienteValidado) => {
            clienteValidado.value = cliente;
            
            // Enviar email si está activo y está habilitado
            console.table(cliente);
            if (enviarEmail && cliente.estadoOC === 'ACTIVO') {

              // await enviarCodigoVerificacion(cliente.correo, cliente.nombreCompleto, cliente.codigo);
            }
          }
        }
      );

      return resultado || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      clienteValidado.value = null;
      return null;
    }
  };


  const obtenerDatosCliente = async (documento: string): Promise<EvoltaClienteData | null> => {
    if (!documento || documento.trim().length === 0) {
      const errorMsg = 'Debe proporcionar un número de documento';
      if (mostrarErrores) {
        Alerta.Error('Error de validación', errorMsg);
      }
      error.value = errorMsg;
      return null;
    }

    try {
      error.value = null;
      
      const resultado = await ejecutar(
        () => EvoltaService.obtenerDatosCliente(documento.trim()),
        {
          indicadorCarga: mostrarCarga ? isLoading : undefined,
          mostrarErrores,
          mostrarCarga,
          onExito: (datos: EvoltaClienteData) => {
            datosCliente.value = datos;
          }
        }
      );

      return resultado || null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
      datosCliente.value = null;
      return null;
    }
  };

  


  /**
   * Limpia todos los datos almacenados
   */
  const limpiar = () => {
    clienteValidado.value = null;
    datosCliente.value = null;
    error.value = null;
    isLoading.value = false;
  };

  /**
   * Verifica si un documento tiene el formato correcto
   * @param documento Número de documento
   * @returns boolean
   */
  const validarFormatoDocumento = (documento: string): boolean => {
    const cleaned = documento.replace(/\D/g, ''); // Solo números
    return cleaned.length >= 8 && cleaned.length <= 12; // DNI/RUC
  };

  return {
    // Estados
    isLoading: computed(() => isLoading.value),
    clienteValidado: computed(() => clienteValidado.value),
    datosCliente: computed(() => datosCliente.value),
    error: computed(() => error.value),
    
    // Computadas
    esClienteActivo,
    codigoGenerado,
    
    // Métodos
    validarCliente,
    obtenerDatosCliente,
    validarFormatoDocumento,
    limpiar
  };
}
