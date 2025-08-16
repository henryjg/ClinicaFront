import { ref } from 'vue';
import PreguntasService from '../services/Preguntas.service';
import { Pregunta, initializePregunta, initializePreguntaErrors } from '../interfaces/preguntas.interface';
import { useValidaPregunta } from './Validaciones/useValidaPregunta'; // Debes tener este archivo de validaciones
import { useOperacion } from './Tools/useOperacion';
import { Alerta } from '../utils/_utils';

export function usePreguntas() {
  // Estado reactivo
  const listaPreguntas = ref<Pregunta[]>([]);
  const nuevaPregunta = ref<Pregunta>(initializePregunta());
  const pregunta = ref<Pregunta>(initializePregunta());
  const isLoading_Pregunta = ref(false);
  const isSaving = ref(false);

  // Validaciones y operaciones
  const { errors, validarFormulario } = useValidaPregunta();
  const { ejecutar } = useOperacion();

  // Listar todas las preguntas
  const Listar_Preguntas = async () => {
    return ejecutar(
      () => PreguntasService.listar(),
      {
        indicadorCarga: isLoading_Pregunta,
        onExito: (response: Pregunta[]) => {
          listaPreguntas.value = response || [];
        }
      }
    );
  };

  // Obtener pregunta por ID
  const Obtener_Pregunta = async (id: number) => {
    return ejecutar(
      () => PreguntasService.obtener(id),
      {
        indicadorCarga: isLoading_Pregunta,
        onExito: (response: any) => {
          if (response.success && response.data) {
            pregunta.value = { ...response.data, id };
          } else if (response.id) {
            pregunta.value = { ...response, id };
          } else {
            throw new Error('No se pudo cargar la pregunta');
          }
        }
      }
    );
  };

  // Crear pregunta
  const Crear_Pregunta = async (): Promise<boolean> => {
    const valid = validarFormulario(pregunta.value);
    // Si no es válido, no mostrar alerta ni cerrar modal, solo mostrar errores en el formulario
    if (!valid) {
      return false;
    }

    const resultado = await ejecutar(
      () => PreguntasService.crear(pregunta.value),
      {
        indicadorCarga: isSaving,
        onExito: async (response: any) => {
          if (response.success) {
            nuevaPregunta.value = initializePregunta();
            await Listar_Preguntas();
          } else {
            throw new Error(response.message || 'Error al guardar la pregunta');
          }
        },
        mensajeExito: 'Pregunta registrada satisfactoriamente'
      }
    );

    return !!resultado;
  };

  // Actualizar pregunta
  const Actualizar_Pregunta = async (): Promise<boolean> => {
    const valid = validarFormulario(pregunta.value);
    // Si no es válido, no mostrar alerta ni cerrar modal, solo mostrar errores en el formulario
    if (!valid) {
      return false;
    }

    const resultado = await ejecutar(
      () => PreguntasService.actualizar(pregunta.value),
      {
        indicadorCarga: isSaving,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Preguntas();
          } else {
            throw new Error(response.message || 'Error al actualizar la pregunta');
          }
        },
        mensajeExito: 'Pregunta actualizada con éxito'
      }
    );

    return !!resultado;
  };

  // Eliminar pregunta
  const Eliminar_Pregunta = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta pregunta?',
      'Esta acción no se puede deshacer.'
    );

    if (!isConfirmado) return;

    return ejecutar(
      () => PreguntasService.eliminar(id),
      {
        indicadorCarga: isSaving,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Preguntas();
          } else {
            throw new Error(response.message || 'Error al eliminar la pregunta');
          }
        },
        mensajeExito: 'Pregunta eliminada con éxito'
      }
    );
  };

  // Reset formulario
  const resetFormulario = () => {
    nuevaPregunta.value = initializePregunta();
    errors.value = initializePreguntaErrors();
  };

  return {
    listaPreguntas,
    nuevaPregunta,
    pregunta,
    errors,
    isLoading_Pregunta,
    isSaving,
    Listar_Preguntas,
    Obtener_Pregunta,
    Crear_Pregunta,
    Actualizar_Pregunta,
    Eliminar_Pregunta,
    resetFormulario,
  };
}
