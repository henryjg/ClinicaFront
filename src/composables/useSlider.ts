import { ref, computed } from 'vue';
import { WebSliderService } from '../services/_services';
import { Alerta } from '../utils/_utils';
import { Slider, initializeSlider, initializeSliderErrors, SliderOrdenRequest, ReordenarSlidersRequest } from '../interfaces/_interface';
import { useValidaSlider } from './Validaciones/useValidaSlider';
import { useOperacion } from './Tools/useOperacion';

export function useSliders() {
  // Estado reactivo
  const listaSliders = ref<Slider[]>([]);
  const nuevoSlider  = ref<Slider>(initializeSlider());
  const editandoSlider = ref<Slider>(initializeSlider()); // Separado para edición
  const slider       = ref<Slider>(initializeSlider());
  
  // Estados de carga separados
  const isLoading_Slider = ref(false);
  const isLoadingModal = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingEdit = ref(false);
  const isLoadingReorder = ref(false);

  // Importar validaciones y operaciones
  const { errors, validarFormulario } = useValidaSlider();
  const { ejecutar } = useOperacion();

  // Carga la lista completa de sliders
  const Listar_Slider = async () => {
    return ejecutar(
      () => WebSliderService.listar(),
      {
        indicadorCarga: isLoading_Slider,
        onExito: (response: any) => {
          listaSliders.value = response || [];
        }
      }
    );
  };

  // Carga la lista de sliders ordenados
  const Listar_Slider_Ordenados = async () => {
    return ejecutar(
      () => WebSliderService.listarOrdenados(),
      {
        indicadorCarga: isLoading_Slider,
        onExito: (response: any) => {
          listaSliders.value = response || [];
        }
      }
    );
  };

  //  Carga la lista de sliders activos
  const Listar_Slider_Activos = async () => {
    return ejecutar(
      () => WebSliderService.listarActivos(),
      {
        indicadorCarga: isLoading_Slider,
        onExito: (response: any) => {
          listaSliders.value = response || [];
        }
      }
    );
  };
  
  // Guarda un nuevo slider
  const Crear_Slider = async (): Promise<boolean> => {
    if (!validarFormulario(nuevoSlider.value)) return false;

    const resultado = await ejecutar(
      () => WebSliderService.crear(nuevoSlider.value),
      {
        indicadorCarga: isLoadingCreate,
        onExito: async (response: any) => {
          if (response.success) {
            resetFormularioCrear();
            await Listar_Slider();
          } else {
            throw new Error(response.message || 'Error al guardar el slider');
          }
        },
        mensajeExito: 'Slider registrado satisfactoriamente'
      }
    );

    return !!resultado;
  };
  // Actualiza un slider existente
  const Actualizar_Slider = async (estadoData?: Slider): Promise<boolean> => {
    if (!validarFormulario(editandoSlider.value)) return false;

    const resultado = await ejecutar(
      () => WebSliderService.actualizar(editandoSlider.value),
      {
        indicadorCarga: isLoadingEdit,
        onExito: async (response: any) => {
          if (response.success) {
            resetFormularioEditar();
            await Listar_Slider();
          } else {
            throw new Error(response.message || 'Error al actualizar el slider');
          }
        },
        mensajeExito: 'Slider actualizado con éxito'
      }
    );

    return !!resultado;
  };
  
  // Reordena los sliders
  const Reordenar_Sliders = async (sliders: Slider[]): Promise<boolean> => {
    // Crear la estructura para el endpoint
    const listaOrden: SliderOrdenRequest[] = sliders.map((slider, index) => ({
      sliderId: slider.id,
      nuevoOrden: index + 1 // El orden comienza en 1
    }));

    const requestData: ReordenarSlidersRequest = {
      listaOrden
    };

    const resultado = await ejecutar(
      () => WebSliderService.reordenarSliders(requestData),
      {
        indicadorCarga: isLoadingReorder,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Slider_Ordenados();
          } else {
            throw new Error(response.message || 'Error al reordenar los sliders');
          }
        },
        mensajeExito: 'Sliders reordenados con éxito'
      }
    );

    return !!resultado;
  };
  
  //Elimina un slider
  const Eliminar_Slider = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar este slider?',
      'Esta acción no se puede deshacer.'
    );

    if (!isConfirmado) return;

    return ejecutar(
      () => WebSliderService.eliminar(id),
      {
        indicadorCarga: isLoading_Slider,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Slider();
          } else {
            throw new Error(response.message || 'Error al eliminar el slider');
          }
        },
        mensajeExito: 'Slider eliminado con éxito'
      }
    );
  };  
    // Carga un slider específico por ID para edición
  const Obtener_Slider = async (id: number) => {
    return ejecutar(
      () => WebSliderService.obtener(id),
      {
        indicadorCarga: isLoadingEdit,
        onExito: (response: any) => {
          if (response.success && response.data) {
            editandoSlider.value = { ...response.data };
          } else {
            throw new Error('No se pudo cargar el slider');
          }
        }
      }
    );
  };
  
  // Actualiza el estado de un slider usando el servicio actualizarEstado
  const actualizarEstado = async (id: number, nuevoSliderValor: any) => {
    return ejecutar(
      () => WebSliderService.actualizarEstado(id, nuevoSliderValor),
      {
        indicadorCarga: isLoading_Slider,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Slider();
          } else {
            throw new Error(response.message || 'Error al actualizar el estado del slider');
          }
        },
        mensajeExito: 'Estado del slider actualizado con éxito'
      }
    );
  };
  // Función de reset del formulario
  const resetFormulario = () => {
    nuevoSlider.value = initializeSlider();
    errors.value = initializeSliderErrors();
  };

  // Reset específico para crear
  const resetFormularioCrear = () => {
    nuevoSlider.value = initializeSlider();
    errors.value = initializeSliderErrors();
  };

  // Reset específico para editar
  const resetFormularioEditar = () => {
    editandoSlider.value = initializeSlider();
    errors.value = initializeSliderErrors();
  };

  // Preparar modal de creación
  const prepararModalCrear = () => {
    resetFormularioCrear();
  };

  // Preparar modal de edición
  const prepararModalEditar = async (id: number) => {
    resetFormularioEditar();
    await Obtener_Slider(id);
  };

  // Sliders ordenados (computada)
  const slidersOrdenados = computed(() => {
    return [...listaSliders.value].sort((a, b) => {
      // Si el orden no está definido, usar el ID como fallback
      const ordenA = a.orden || a.id;
      const ordenB = b.orden || b.id;
      return ordenA - ordenB;
    });
  });

  // Operaciones principales
  return {
    // Estados reactivos
    listaSliders,
    nuevoSlider,
    editandoSlider,
    slider,
    errors,
    slidersOrdenados,
    
    // Estados de carga
    isLoading_Slider,
    isLoadingModal,
    isLoadingCreate,
    isLoadingEdit,
    isLoadingReorder,
    
    // Operaciones
    Listar_Slider,
    Listar_Slider_Activos,
    Listar_Slider_Ordenados,
    Crear_Slider,
    Actualizar_Slider,
    Eliminar_Slider,
    Obtener_Slider,
    actualizarEstado,
    Reordenar_Sliders,
    
    // Utilidades de formulario
    resetFormulario,
    resetFormularioCrear,
    resetFormularioEditar,
    prepararModalCrear,
    prepararModalEditar,
  };
}
