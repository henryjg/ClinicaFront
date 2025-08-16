<template>
  <CardLayout :title="'Sliders Principales'" :clase="'text-info'" :clasehead="'border-0'" class="pt-1">
    <!-- Botones de la parte superior derecha -->
    <template #buttons>
      <div class="d-flex columns justify-content-end">
        <button 
          v-if="isReordenarModeActive" 
          @click="guardarReordenamiento" 
          class="btn btn-success btn-sm me-2"
          :disabled="isLoadingReorder"
        >
          <span v-if="isLoadingReorder">
            <i class="spinner-border spinner-border-sm me-1" role="status"></i>
            Guardando...
          </span>
          <span v-else>
            <i class="fa fa-save"></i> Guardar Orden
          </span>
        </button>
        <button 
          v-if="isReordenarModeActive" 
          @click="cancelarReordenamiento" 
          class="btn btn-secondary btn-sm me-2"
          :disabled="isLoadingReorder"
        >
          <i class="fa fa-times"></i> Cancelar
        </button>
        <button 
          v-if="!isReordenarModeActive" 
          @click="activarModoReordenar" 
          class="btn btn-primary btn-sm me-2"
        >
          <i class="fa fa-sort"></i> Reordenar
        </button>
        <button @click="openAddModal" class="btn btn-success btn-sm">
          <i class="fa fa-plus"></i> Nuevo Slider
        </button>
      </div>
    </template>

    <!-- Contenido principal de la tarjeta -->
    <template #default>
      <Divloading v-if="isloading"/>
      <Transition>
        <div v-if="!isloading">
          <!-- Modo de reordenamiento -->
          <div v-if="isReordenarModeActive" class="mb-4">            <div class="alert alert-info">
              <i class="fa fa-info-circle me-2"></i>
              Arrastra y suelta los sliders para reordenarlos. Luego haz clic en "Guardar Orden" para confirmar los cambios.
            </div>
            
            <div ref="sortableContainer" class="list-group">
              <div 
                v-for="(element, index) in slidersReordenados" 
                :key="element.id"
                class="list-group-item d-flex align-items-center reorder-item mb-2"
                :data-id="element.id"
              >
                <div class="drag-handle me-2 cursor-move">
                  <i class="fa fa-grip-vertical text-muted"></i>
                </div>
                <div class="order-number me-3">{{ index + 1 }}</div>
                <div class="slider-img me-3">
                  <ImgLazy 
                    v-if="element.urlFoto && element.urlFoto !== ''" 
                    class="rounded-3 img-thumbnail"
                    :src="element.urlFoto" 
                    :style="{ width: '150px', height: '50px', objectFit: 'cover' }"
                  ></ImgLazy>
                </div>
                <div class="slider-name flex-grow-1">
                  <span class="f-14 f-w-600 text-gray">{{ element.nombreSlider }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Modo de vista normal -->
          <DataTable
            v-else
            :headers="headers"
            :items="slidersOrdenados"
            :filterKeys="['nombreSlider']"
            :clasehead="'bg-info-100'"
            class="w-75"
          >
            <template #default="{ item, index, currentPage, itemsPerPage }">
              <tr>
                <td class="align-content-start">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>                
                <td>
                  <ImgLazy v-if="item.urlFoto && item.urlFoto !== ''" class="rounded-3"
                           :src="item.urlFoto" aspectRatio="16 / 5"></ImgLazy>
                </td>
                <td class="align-content-start">
                  <div class="f-14 f-w-600 text-gray mb-0 mt-2 divb-0">{{ item.nombreSlider }}</div>
                </td>                
                <td>
                  <div class="form-check form-switch custom-switch-v1 mb-1">
                    <input type="checkbox"  
                           class="form-check-input input-success" 
                           :id="`customswitch-${item.id}`" 
                           :checked="item.estado === 'Activo'" 
                           :disabled="loadingStates[item.id]"
                           @change="cambiarEstado(item, ($event.target as HTMLInputElement).checked)" />
                      <div v-if="loadingStates[item.id]" class="d-flex align-items-center me-2 position-absolute">
                        <span class="spinner-border spinner-border-sm text-info me-2 " role="status" aria-hidden="true"></span>
                      </div>
                  </div>
                </td>
                <td class="text-wrap d-flex justify-content-around">
                  <button @click="openEditModal(item.id)" class="btn btn-primary btn-sm">
                    <i class="ti ti-edit"></i>
                  </button>
                  <button @click="Eliminar_Slider(item.id)" class="btn btn-danger btn-sm">
                    <i class="ti ti-trash"></i>
                  </button>
                </td>
              </tr>
            </template>
          </DataTable>
        </div>
      </Transition>
    </template>
  </CardLayout>

  <!-- El modal debe ir FUERA del CardLayout para evitar errores de reactividad -->
  <modal_add_slider @updated="Listar_Slider" />
  <modal_editar_slider :sliderId="selectedSliderId" @updated="Listar_Slider" />
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, computed, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';
import Sortable from 'sortablejs';
import type { SortableEvent } from 'sortablejs';

// Centralized imports
import { CardLayout, DataTable, Divloading, ImgLazy } from '../../components/_components';
import { useSliders } from '../../composables/_composables';
import { Notif, Alerta } from '../../utils/_utils';
import { Slider } from '../../interfaces/_interface';

// Modal imports (these are specific modal components)
import modal_add_slider from '../../views/Modals/modal_add_slider.vue';
import modal_editar_slider from '../../views/Modals/modal_edit_slide.vue';

export default defineComponent({  components: {
    CardLayout,
    DataTable,
    modal_add_slider,
    modal_editar_slider,
    Divloading,
    ImgLazy
  },
  setup() {
    const { 
      listaSliders, 
      Listar_Slider, 
      Listar_Slider_Ordenados,
      Eliminar_Slider, 
      actualizarEstado, 
      prepararModalCrear, 
      prepararModalEditar, 
      Reordenar_Sliders,
      slidersOrdenados,
      isLoadingReorder
    } = useSliders();
    
    const selectedSliderId = ref<number | null>(null);
    const isloading = ref(false);
    const loadingStates = ref<{ [key: number]: boolean }>({});    const isReordenarModeActive = ref(false);
    const slidersReordenados = ref<Slider[]>([]);
    const slidersOriginal = ref<Slider[]>([]);    const sortableContainer = ref<HTMLElement | null>(null);
    let sortableInstance: Sortable | null = null;

    // Manejo de modales optimizado
    const openAddModal = async () => {
      await prepararModalCrear(); // Preparar datos antes de mostrar modal
      const modalElement = document.getElementById('add_SliderModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.show();
      }
    };

    const openEditModal = async (id: number) => {
      selectedSliderId.value = id;
      // Preparar datos inmediatamente y mostrar modal
      const modalElement = document.getElementById('edit_SliderModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.show();
        // Los datos se cargarán automáticamente por el watch en el modal
      }
    };

    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      { text: 'IMAGEN', width: '25%', key: 'urlFoto' },
      { text: 'NOMBRE', width: '10%', key: 'nombreSlider' },
      { text: 'ESTADO', width: '10%', key: 'estado' },
      { text: 'ACCIONES', width: '10%', key: 'acciones' },
      { text: '', width: '50%', key: 'acciones' },
    ]);

    const cargar_sliders = async () => {
      isloading.value = true;
      try {
        await Listar_Slider_Ordenados();
      } finally {
        isloading.value = false; 
      }
    };
      onMounted(async () => {
      await cargar_sliders();
    });
    
    onBeforeUnmount(() => {
      // Asegurarse de destruir la instancia de Sortable al desmontar el componente
      if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
      }
    });

    const cambiarEstado = async (slider: Slider, nuevoEstado: boolean) => {
      const estadoOriginal = slider.estado;
      const nuevoEstadoStr = nuevoEstado ? 'Activo' : 'Inactivo';
      
      // Evitar múltiples clicks mientras se procesa
      if (loadingStates.value[slider.id]) {
        return;
      }
      
      // Mostrar indicador de carga para este slider específico
      loadingStates.value[slider.id] = true;
      
      try {
        // Encontrar el índice del slider en la lista
        const sliderIndex = listaSliders.value.findIndex(s => s.id === slider.id);
        if (sliderIndex === -1) {
          throw new Error('Slider no encontrado en la lista');
        }
        
        // Actualizar SOLO el estado en la UI inmediatamente (actualización optimista)
        listaSliders.value[sliderIndex] = {
          ...listaSliders.value[sliderIndex],
          estado: nuevoEstadoStr
        };
        
        // Intentar actualizar el estado en el servidor
        await actualizarEstado(slider.id, nuevoEstadoStr);
        Notif.Success('Estado actualizado correctamente');
      } catch (error) {
        // En caso de error, revertir SOLO el estado del item específico
        const sliderIndex = listaSliders.value.findIndex(s => s.id === slider.id);
        if (sliderIndex !== -1) {
          listaSliders.value[sliderIndex] = {
            ...listaSliders.value[sliderIndex],
            estado: estadoOriginal
          };
        }
        Alerta.Error('Error', 'No se pudo actualizar el estado.');
        console.error('Error al cambiar estado:', error);
      } finally {
        // Quitar indicador de carga
        loadingStates.value[slider.id] = false;
      }
    };    // Funciones para el reordenamiento
    const activarModoReordenar = () => {
      // Guardar copia del orden original para poder cancelar
      slidersOriginal.value = JSON.parse(JSON.stringify(slidersOrdenados.value));
      // Inicializar el array para reordenar
      slidersReordenados.value = JSON.parse(JSON.stringify(slidersOrdenados.value));
      isReordenarModeActive.value = true;
      
      // Inicializar Sortable.js después de que el DOM se actualice
      setTimeout(() => {
        if (sortableContainer.value) {
          sortableInstance = Sortable.create(sortableContainer.value, {            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'ghost',
            onEnd: (evt: SortableEvent) => {
              // Actualizar el orden en nuestro array reactivo después de arrastrar
              const itemEl = evt.item;
              const fromIndex = evt.oldIndex;
              const toIndex = evt.newIndex;
              
              if (
                typeof fromIndex === 'number' &&
                typeof toIndex === 'number' &&
                fromIndex !== toIndex
              ) {
                const item = slidersReordenados.value.splice(fromIndex, 1)[0];
                slidersReordenados.value.splice(toIndex, 0, item);
              }
            }
          });
        }
      }, 100);
    };

    const cancelarReordenamiento = () => {
      // Descartar los cambios
      isReordenarModeActive.value = false;
      slidersReordenados.value = [];
      
      // Destruir la instancia de Sortable
      if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
      }
    };    const guardarReordenamiento = async () => {
      try {
        // Llamar al servicio para guardar el nuevo orden
        const resultado = await Reordenar_Sliders(slidersReordenados.value);
        if (resultado) {
          // Limpiar y volver al modo normal
          if (sortableInstance) {
            sortableInstance.destroy();
            sortableInstance = null;
          }
          isReordenarModeActive.value = false;
          await Listar_Slider_Ordenados();
          Notif.Success('El orden de los sliders ha sido actualizado correctamente');
        }
      } catch (error) {
        console.error('Error al guardar el reordenamiento:', error);
        Alerta.Error('Error', 'No se pudo guardar el nuevo orden de los sliders');
      }
    };    return {
      headers,
      listaSliders,
      slidersOrdenados,
      openAddModal,
      openEditModal,
      isloading,
      loadingStates,
      Listar_Slider,
      Listar_Slider_Ordenados,
      Eliminar_Slider,
      selectedSliderId,
      cambiarEstado,
      // Reordenamiento
      isReordenarModeActive,
      activarModoReordenar,
      cancelarReordenamiento,
      guardarReordenamiento,
      slidersReordenados,
      isLoadingReorder,
      sortableContainer
    };
  },
});
</script>

<style scoped>
.text-sentence {
  text-transform: lowercase;
}

.text-sentence::first-letter {
  text-transform: uppercase;
}

/* Asegúrate de que las acciones estén alineadas horizontalmente */
.text-wrap.d-flex {
  gap: 0.5rem; /* Espaciado entre botones */
}

/* Estilos para el switch personalizado */
.custom-switch-v1 {
  position: relative;
}

.custom-switch-v1 .form-check-input {
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.custom-switch-v1 .form-check-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Posicionamiento del spinner para que aparezca sobre el switch */
.custom-switch-v1 .position-absolute {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 3;
  pointer-events: none;
}

/* Animación suave para el estado */
.transition-all {
  transition: all 0.3s ease;
}

/* Estilos para el drag & drop */
.reorder-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;
}

.reorder-item:hover {
  background-color: #f0f0f0;
}

.drag-handle {
  cursor: grab;
  padding: 0.5rem;
}

.drag-handle:active {
  cursor: grabbing;
}

.cursor-move {
  cursor: move;
}

.ghost {
  opacity: 0.5;
  background-color: #c8ebfb;
}

.order-number {
  font-weight: bold;
  width: 30px;
  text-align: center;
  background-color: #e9ecef;
  border-radius: 50%;
  padding: 5px;
  display: inline-block;
}
</style>
