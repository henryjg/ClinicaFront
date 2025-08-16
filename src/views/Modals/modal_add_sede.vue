<template>
  <div class="modal modal-lg fade" id="add_SedeModal" tabindex="-1" aria-labelledby="add_SedeModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">        
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-plus p-r-15"></i> Nueva Sede
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingCreate"></button>
        </div>
        <div class="modal-body py-1">
          <!-- Loader mientras se prepara el modal -->
          <div v-if="isLoadingModal" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Preparando formulario...</p>
          </div>
          <!-- Formulario -->
          <div v-else>
            <div class="row g-1 mb-1">
              <div class="col-md-4">
                <label class="form-label">Departamento:</label>
                <select class="form-select" v-model="departamentoSeleccionado" id="departamento">
                  <option value="" disabled>Seleccione un departamento</option>
                  <option v-for="departamento in departamentos" :key="departamento" :value="departamento">
                    {{ departamento }}
                  </option>
                </select>
                <ErrorMessage :error="errors.ubigeo" />
              </div>
              <div class="col-md-4">
                <label v-if="provincias.length" class="form-label">Provincia:</label>
                <select class="form-select" v-model="provinciaSeleccionada" id="provincia" v-if="provincias.length">
                  <option value="" disabled>Seleccione una provincia</option>
                  <option v-for="provincia in provincias" :key="provincia" :value="provincia">
                    {{ provincia }}
                  </option>
                </select>
                <ErrorMessage :error="errors.ubigeo" />
              </div>
              <div class="col-md-4">
                <label v-if="distritos.length" class="form-label">Departamento:</label>
                <select class="form-select" id="distrito" v-model="distritoSeleccionado" v-if="distritos.length">
                  <option value="" disabled>Seleccione un distrito</option>
                  <option v-for="distrito in distritos" :key="distrito" :value="distrito">
                    {{ distrito }}
                  </option>
                </select>
                <ErrorMessage :error="errors.ubigeo" />
              </div>
            
            </div>
            
            <div class="row g-1 mb-1">
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
        </div>        
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="registrarSede" :disabled="isLoadingCreate">
            <span v-if="isLoadingCreate">
              <i class="spinner-border spinner-border-sm me-2" role="status"></i>
              Guardando...
            </span>
            <span v-else>Crear</span>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isLoadingCreate">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import { GoogleMap, Marker } from 'vue3-google-map';
import { GoogleApi } from '../../config';
import { Modal } from '../../utils/_utils';
import { ErrorMessage } from '../../components/_components';
import { useSedes, useUbigeo } from '../../composables/_composables';

// Props y emits
const props = defineProps<{ 
  id: number 
}>();

const emit = defineEmits<{
  updated: []
}>();

// Estados locales para el modal
const isLoadingModal = ref(false);
const isLoadingCreate = ref(false);

// Composables
const { 
  localSede, 
  errors, 
  Crear_Sede, 
  resetearSede, 
  googleMaps 
} = useSedes();

const {
  departamentoSeleccionado, 
  provinciaSeleccionada, 
  distritoSeleccionado,
  departamentos, 
  provincias, 
  distritos
} = useUbigeo();

// Estado local
const idnegocio = computed(() => props.id);

// Watcher para asignar el negocioId cuando cambie
watchEffect(() => {
  if (idnegocio.value !== undefined) {
    localSede.value.negocioId = idnegocio.value;
  }
});

// Preparar modal cuando se abre
const prepararModal = async () => {
  isLoadingModal.value = true;
  try {
    resetearFormulario();
  } finally {
    isLoadingModal.value = false;
  }
};

// Función principal para registrar sede
const registrarSede = async () => {
  // Construir ubigeo desde los selects
  localSede.value.ubigeo = `${departamentoSeleccionado.value} - ${provinciaSeleccionada.value} - ${distritoSeleccionado.value}`;
  
  isLoadingCreate.value = true;
  try {
    const success = await Crear_Sede();
    if (success) {
      resetearFormulario();
      emit("updated");
      closeModal();
    }
  } catch (error) {
    console.error("Error al registrar la sede:", error);
  } finally {
    isLoadingCreate.value = false;
  }
};

// Cerrar modal
const closeModal = () => {
  const modalElement = document.getElementById("add_SedeModal");
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    if (modal) modal.hide();
  }
};

// Resetear formulario completo
const resetearFormulario = () => {
  resetearSede();
  departamentoSeleccionado.value = "";
  provinciaSeleccionada.value = "";
  distritoSeleccionado.value = "";
};

// Escuchar eventos del modal
onMounted(() => {
  const modalElement = document.getElementById("add_SedeModal");
  if (modalElement) {
    modalElement.addEventListener('show.bs.modal', prepararModal);
  }
});
</script>

<style>
input, select, textarea {
  background-color: #c2d1d238 !important;
}
</style>
