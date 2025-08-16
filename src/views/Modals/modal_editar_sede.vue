<template>
  <div class="modal modal-lg fade" id="edit_SedeModal" tabindex="-1" aria-labelledby="edit_SedeModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Loader -->
        <ModalLoader :loading="isLoadingModal" message="Cargando datos de la sede..." />
        
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-map-marked p-r-15"></i> Ubicación
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingEdit"></button>
        </div>
        <div class="modal-body py-1" :class="{ 'opacity-50': isLoadingEdit }">
          <form>
            <div class="row g-1 mb-3">
              <div class="col-md-12">
                <label class="form-label">Ubigeo:</label>
                <input readonly type="text" class="form-control" v-model="localSede.ubigeo" />
                <ErrorMessage :error="errors.ubigeo" />
              </div>
              <div class="col-md-12">
                <label class="form-label">Dirección:</label>
                <input type="text" class="form-control" v-model="localSede.direccion" />
                <ErrorMessage :error="errors.direccion" />
              </div>
            </div>

            <div class="row g-1 mb-1">
              <div class="col-md-12">
                <label class="form-label">Nombre Local:</label>
                <input type="text" class="form-control" v-model="localSede.nombre" />
                <ErrorMessage :error="errors.nombre" />
              </div>
            </div>
           
            <div class="row">
                <div class="col-md-12">
                    <div class="rounded-2 b-gray overflow-hidden my-2">
                      <GoogleMap class="rounded-4"
                          :api-key="GoogleApi"
                          :style="googleMaps.mapConfig.style"
                          :center="googleMaps.center.value"
                          :zoom="googleMaps.mapConfig.zoom"
                          :streetViewControl="googleMaps.mapConfig.streetViewControl"
                          :disable-default-ui="googleMaps.mapConfig.disableDefaultUI"
                          :gestureHandling="googleMaps.mapConfig.gestureHandling"
                      >
                          <Marker :options="googleMaps.markerOptions.value" @dragend="googleMaps.updatePosition" />
                      </GoogleMap>
                    </div>
                </div>
            </div>
             <div class="row g-1 mb-1">
              <div class="col-md-2">
                <label class="form-label">Latitud:</label>
              </div>
              <div class="col-md-3">
                <input readonly type="number" class="form-control" v-model="localSede.latitud" />
                <ErrorMessage :error="errors.latitud" />
              </div>
              <div class="col-md-2"></div>
              <div class="col-md-2">
                <label class="form-label">Longitud:</label>
              </div>
              <div class="col-md-3">
                <input readonly type="number" class="form-control" v-model="localSede.longitud" />
                <ErrorMessage :error="errors.longitud" />
              </div>
            </div>
          </form>
        </div>        <div class="modal-footer py-0">
          <button 
            type="submit" 
            class="btn btn-success" 
            @click="actualizarSedeModal" 
            :disabled="isLoadingEdit"
          >
            <span v-if="isLoadingEdit" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span v-if="isLoadingEdit">Actualizando...</span>
            <span v-else>Actualizar</span>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isLoadingEdit">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, nextTick } from 'vue';
import { Modal, Notif } from '../../utils/_utils';
import { ErrorMessage, ModalLoader } from '../../components/_components';
import { Sede, initializeSedeErrors } from '../../interfaces/_interface';
import { useSedes } from '../../composables/_composables';
import { GoogleMap, Marker } from 'vue3-google-map';
import { GoogleApi } from '../../config';

// Props y emisores
const props = defineProps<{
  sede: Sede;
}>();

const emit = defineEmits<{
  updated: []
}>();

// Estados de carga separados
const isLoadingModal = ref(false);
const isLoadingEdit = ref(false);

// Composables
const { 
  localSede, 
  errors, 
  isLoadingSede,
  Actualizar_Sede, 
  establecerPosicionMapa,
  googleMaps 
} = useSedes();

// Preparar formulario automáticamente
const prepararFormulario = async () => {
  try {
    isLoadingModal.value = true;
    
    // Copiar datos de la sede al formulario
    localSede.value = { ...props.sede };
    
    // Establecer posición del mapa si hay coordenadas
    if (localSede.value.latitud && localSede.value.longitud) {
      establecerPosicionMapa(localSede.value.latitud, localSede.value.longitud);
    }
    
    // Limpiar errores
    errors.value = initializeSedeErrors();
    
    await nextTick();
  } catch (error) {
    console.error('Error preparando formulario:', error);
    Notif.Error('Error al cargar los datos de la sede');
  } finally {
    isLoadingModal.value = false;
  }
};

// Observar cambios en la sede
watch(() => props.sede, prepararFormulario, { immediate: true });

// Observar cambios en las coordenadas del mapa para actualizar la sede
watch(() => [googleMaps.center.value.lat, googleMaps.center.value.lng], 
  ([lat, lng]) => {
    if (lat && lng) {
      localSede.value.latitud = lat;
      localSede.value.longitud = lng;
    }
  }
);

// Función principal para actualizar sede
const actualizarSedeModal = async () => {
  // Prevenir múltiples clicks
  if (isLoadingEdit.value) return;
  
  try {
    isLoadingEdit.value = true;
    
    const success = await Actualizar_Sede();
    if (success) {
      Notif.Success('Sede actualizada correctamente');
      emit("updated");
      closeModal();
    }
  } catch (error) {
    console.error('Error actualizando sede:', error);
    Notif.Error('Error al actualizar la sede');
  } finally {
    isLoadingEdit.value = false;
  }
};

// Cerrar modal
const closeModal = () => {
  try {
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingEdit.value = false;
    
    // Cerrar modal
    const modalElement = document.getElementById("edit_SedeModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};

// Preparar formulario al montar
onMounted(() => {
  if (props.sede) {
    prepararFormulario();
  }
});
</script>

<style>
input, select, textarea {
  background-color: #c2d1d238 !important;
}
</style>
