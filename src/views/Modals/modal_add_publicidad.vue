<template>
  <div class="modal modal-lg fade" id="add_PublicidadModal" tabindex="-1" aria-labelledby="add_PublicidadLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-plus p-r-15"></i> Nueva Publicidad
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingCreate || isUploadingFile"></button>
        </div>        <div class="modal-body py-1">
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
              <!-- Campo Nombre de la Publicidad -->
              <div class="col-md-12">
                <label class="form-label">Nombre Proyecto:</label>
                <input type="text" class="form-control" v-model="nuevaPublicidad.nombreProyecto" />
                <ErrorMessage :error="errors.nombreProyecto" />
              </div>
              <!-- Subida de Imagen -->
              <FileUploader 
                titulo="Imagen del Publicidad"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoPublicidad.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(archivo: Adjunto) => nuevaPublicidad.urlFoto = archivo.url"
                @uploadingStatus="handleUploadStatus"
              />
            <!-- Estados -->
            <div class="col-md-12">
                <label class="form-label mb-0 f-13">Estado</label>
                <select class="form-control" v-model="nuevaPublicidad.estado">
                  <option value="Lotes Disponibles">Lotes Disponibles</option>
                  <option value="Proyecto Entregado">Proyecto Entregado</option>
                </select>
                <ErrorMessage :error="errors.estado" />
              </div>


              <div class="col-md-12">
                <label class="form-label">Ubicación Proyecto:</label>
                <input type="text" class="form-control" v-model="nuevaPublicidad.ubicacionProyecto" />
                <ErrorMessage :error="errors.ubicacionProyecto" />
              </div>
              <div class="col-md-12">
                <label class="form-label">Cuotas:</label>
                <input type="text" class="form-control" v-model="nuevaPublicidad.cuotas" />
                <ErrorMessage :error="errors.cuotas" />
              </div>
              <div class="col-md-12">
                <label class="form-label">Área:</label>
                <input type="text" class="form-control" v-model="nuevaPublicidad.area" />
                <ErrorMessage :error="errors.area" />
              </div>
              <div class="col-md-12">
                <label class="form-label">Link:</label>
                <input type="text" class="form-control" v-model="nuevaPublicidad.link" />
                <ErrorMessage :error="errors.link" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="registrarPublicidad" :disabled="isLoadingCreate || isUploadingFile">
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
import { Modal } from '../../utils/_utils';
import { ErrorMessage, FileUploader } from '../../components/_components';
import { usePublicidad, useSubirArchivo } from '../../composables/_composables';
import type { Adjunto } from '../../interfaces/_interface';

const emit = defineEmits(["updated"]);
const { nuevaPublicidad, errors, Crear_Publicidad} = usePublicidad();

// Estados locales para el modal
const isLoadingModal = ref(false);
const isLoadingCreate = ref(false);
const isUploadingFile = ref(false);
const resetTrigger = ref(0);

// USAMOS `useSubirArchivo` PARA LA IMAGEN
const archivoPublicidad = useSubirArchivo("loadingfile", "archivopdf");

// Manejar el estado de subida de archivos
const handleUploadStatus = (status: boolean) => {
  isUploadingFile.value = status;
};

// Preparar modal cuando se abre
const prepararModal = async () => {
  isLoadingModal.value = true;
  try {
    // Reset del formulario - necesitamos conocer la estructura exacta
    archivoPublicidad.reset_formUpload();
    resetTrigger.value++; // Reset FileUploader
  } finally {
    isLoadingModal.value = false;
  }
};

const registrarPublicidad = async () => {
  const success = await Crear_Publicidad(); 
  if (success) {
    emit("updated");
    resetTrigger.value++;
    closeModal();
  }
};

const closeModal = () => {
  const modalElement = document.getElementById("add_PublicidadModal");
  if (modalElement) {
    resetTrigger.value++;
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    if (modal) modal.hide();
  }
};

// Escuchar eventos del modal
onMounted(() => {
  const modalElement = document.getElementById("add_PublicidadModal");
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
