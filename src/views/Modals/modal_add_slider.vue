<template>
  <div class="modal modal-lg fade" id="add_SliderModal" tabindex="-1" aria-labelledby="add_SliderModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-plus p-r-15"></i> Nuevo Slider
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
          <form v-else>
            <div class="row g-1">
              <!-- Campo Nombre del Slider -->
              <div class="col-md-12">
                <label class="form-label">Nombre del Slider:</label>
                <input type="text" class="form-control" v-model="nuevoSlider.nombreSlider" />
                <ErrorMessage :error="errors.nombreSlider" />
              </div>
              
              <!-- Subida de Imagen -->
              <FileUploader 
                titulo="Imagen del Slider"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoSlider.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(archivo: Adjunto) => nuevoSlider.urlFoto = archivo.url"
                @uploadingStatus="handleUploadStatus"
              />
            

              <!-- Campo Ubicación -->
              <div class="col-md-12">
                <label class="form-label">Ubicación:</label>
                <select class="form-control" v-model="nuevoSlider.ubicacion">
                  <option value="SliderPrincipal">Slider Principal</option>
                  <option value="SliderSecundario">Slider Secundario</option>
                </select>
                <ErrorMessage :error="errors.ubicacion" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="registrarSlider" :disabled="isLoadingCreate || isUploadingFile">
            <span v-if="isLoadingCreate">
              <i class="spinner-border spinner-border-sm me-2" role="status"></i>
              Guardando...
            </span>
            <span v-else-if="isUploadingFile">
              <i class="spinner-border spinner-border-sm me-2" role="status"></i>
              Subiendo archivo...
            </span>
            <span v-else>Crear</span>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isLoadingCreate">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

// Components
import { ErrorMessage, FileUploader } from '../../components/_components';
// Composables
import { useSliders, useSubirArchivo } from '../../composables/_composables';

// Interfaces
import { Adjunto } from '../../interfaces/_interface';

const emit = defineEmits(["updated"]);
const { 
  nuevoSlider, 
  errors, 
  Crear_Slider, 
  isLoadingCreate,
  isLoadingModal,
  prepararModalCrear 
} = useSliders();

const resetTrigger = ref(0);
const isUploadingFile = ref(false);

// ✅ USAMOS `useSubirArchivo` PARA LA IMAGEN
const archivoSlider = useSubirArchivo("loadingfile", "archivopdf");

// Manejar el estado de subida de archivos
const handleUploadStatus = (status: boolean) => {
  isUploadingFile.value = status;
};

// Preparar modal cuando se abre
const prepararModal = async () => {
  await prepararModalCrear();
  resetTrigger.value++; // Reset FileUploader
};

const registrarSlider = async () => {
  try {
    const success = await Crear_Slider(); // Guarda el slider usando `useSliders`
    if (success) {
      emit("updated");
      resetTrigger.value++;
      closeModal();
    }
  } catch (error) {
    console.error("Error al registrar el slider:", error);
  }
};

const closeModal = () => {
  const modalElement = document.getElementById("add_SliderModal");
  if (modalElement) {
    resetTrigger.value++;
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    if (modal) modal.hide();
  }
};

// Escuchar eventos del modal
onMounted(() => {
  const modalElement = document.getElementById("add_SliderModal");
  if (modalElement) {
    modalElement.addEventListener('show.bs.modal', prepararModal);
  }
});
</script>

<style lang="css" scoped>
input, select, textarea {
  background-color: #d7edf738 !important;
}
</style>
