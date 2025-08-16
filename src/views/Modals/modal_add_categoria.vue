<template>
    <div class="modal modal-lg fade" id="add_CategoriaModal" tabindex="-1" aria-labelledby="add_CategoriaModalLabel"
         aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header modal_head_bg py-2">
            <h5 class="modal-title py-0">
              <i class="fa fa-plus p-r-15"></i> Nueva Categoría
            </h5>
            <button :disabled="isLoadingCreate || isUploadingFile" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
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
              <!-- Campo Nombre de la Categoría -->
              <div class="col-md-12">
                <label class="form-label">Nombre Categoría:</label>
                <input type="text" class="form-control" v-model="nuevaCategoria.nombre" />
                <ErrorMessage :error="errors.nombre" />
              </div>

              <!-- Subida de Imagen-- -->
              <FileUploader 
                titulo="Imagen de Categoría"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoCategoria.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(archivo: any) => nuevaCategoria.imagenUrl = archivo.url"
                @uploadingStatus="handleUploadStatus"
              />
              <!-- ------------------- -->
            </div>
          </form>
        </div>
        <div class="modal-footer py-0">
              <button type="submit" class="btn btn-primary" @click="registrarCategoria" :disabled="isLoadingCreate || isUploadingFile">
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
import { useCategorias, useSubirArchivo, useValidaCategoria } from '../../composables/_composables';
import { Adjunto } from '../../interfaces/_interface';

const emit = defineEmits(["updated"]);
const { nuevaCategoria, Crear_Categoria, errors, isLoading_Categoria } = useCategorias();
const { validarFormulario } = useValidaCategoria();

// Estados locales para el modal
const isLoadingModal = ref(false);
const isLoadingCreate = ref(false);
const isUploadingFile = ref(false);
const resetTrigger = ref(0);

//USAMOS `useSubirArchivo` PARA LA IMAGEN
const archivoCategoria = useSubirArchivo("loadingfile", "archivopdf");

// Manejar el estado de subida de archivos
const handleUploadStatus = (status: boolean) => {
  isUploadingFile.value = status;
};

// Preparar modal cuando se abre
const prepararModal = async () => {
  isLoadingModal.value = true;
  try {
    // Reset del formulario
    nuevaCategoria.value = { id: 0, nombre: '', imagenUrl: '' };
    archivoCategoria.reset_formUpload();
    resetTrigger.value++; // Reset FileUploader
  } finally {
    isLoadingModal.value = false;
  }
};

const registrarCategoria = async () => {
  if (!validarFormulario(nuevaCategoria.value)) return;
  
  isLoadingCreate.value = true;
  try {
    const success = await Crear_Categoria();
    if (success) {
      emit("updated");
      archivoCategoria.reset_formUpload();
      resetTrigger.value++;
      closeModal();
    }
  } catch (error) {
    console.error("Error al registrar la categoría:", error);
  } finally {
    isLoadingCreate.value = false;
  }
};

const closeModal = () => {
  const modalElement = document.getElementById("add_CategoriaModal");
  if (modalElement) {
    archivoCategoria.reset_formUpload();
    resetTrigger.value++;
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    if (modal) modal.hide();
  }
};

// Escuchar eventos del modal
onMounted(() => {
  const modalElement = document.getElementById("add_CategoriaModal");
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
