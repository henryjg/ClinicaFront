<template>
    <div class="modal modal-lg fade" id="edit_SliderModal" tabindex="-1" aria-labelledby="edit_SliderModalLabel"
         aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header modal_head_bg py-2">
            <h5 class="modal-title py-0" id="edit_SliderModalLabel">
              <i class="fa fa-edit p-r-15"></i> Editar Slider
            </h5>
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingEdit"></button>
          </div>
          <div class="modal-body py-1">
            <!-- Loader mientras se cargan los datos -->
            <div v-if="isLoadingEdit && !editandoSlider.id" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2">Cargando datos del slider...</p>
            </div>
            
            <!-- Formulario -->
            <form v-else>
              <div class="row g-1">
                <!-- Campo Nombre del Slider -->
                <div class="col-md-12">
                  <label class="form-label">Nombre del Slider:</label>
                  <input type="text" class="form-control" v-model="editandoSlider.nombreSlider" />
                  <ErrorMessage :error="errors.nombreSlider" />
                </div>
                
                <!-- Estados -->
                <div class="col-md-12">
                  <label class="form-label mb-0 f-13">Estado</label>
                  <div class="d-flex mb-1">
                    <input v-model="editandoSlider.estado" class="btn-check" type="radio" name="estado" value="Activo" id="estadoActivo">
                    <label class="btn btn-outline-success b-gray py-1 px-2 m-r-5 w-100 f-w-600" for="estadoActivo">Activo</label>
                    <input v-model="editandoSlider.estado" class="btn-check" type="radio" name="estado" value="Inactivo" id="estadoInactivo">
                    <label class="btn btn-outline-danger b-gray px-2 py-1 m-r-5 w-100 f-w-600" for="estadoInactivo">Inactivo</label>
                  </div>
                </div>
  
                <!-- Imagen actual (si existe) -->
                <div v-if="editandoSlider.urlFoto && !archivoSlider.ArchivoTemporal.value.url" class="col-md-12">
                  <label class="form-label">Imagen actual:</label>
                  <div class="mb-2">
                    <img :src="editandoSlider.urlFoto" alt="Imagen actual" class="img-thumbnail" style="max-height: 150px;">
                  </div>
                </div>

                <!-- Subida de Imagen -->
                <FileUploader 
                  titulo="Cambiar Imagen del Slider"
                  elementoLoader="loadingfile"
                  tipoArchivo="fotografia"
                  :archivoTemporal="archivoSlider.ArchivoTemporal.value"
                  :resetTrigger="resetTrigger"
                  @archivoSubido="(archivo: Adjunto) => editandoSlider.urlFoto = archivo.url"
                  @uploadingStatus="handleUploadStatus"
                />
                
                <!-- Campo Ubicación -->
                <div class="col-md-12">
                  <label class="form-label">Ubicación:</label>
                  <select class="form-control" v-model="editandoSlider.ubicacion">
                    <option value="SliderPrincipal">Slider Principal</option>
                    <option value="SliderSecundario">Slider Secundario</option>
                  </select>
                  <ErrorMessage :error="errors.ubicacion" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer py-0">
            <button 
              type="submit" 
              class="btn btn-primary" 
              @click="formActualizarSlider" 
              :disabled="isLoadingEdit || isUploadingFile">
              <span v-if="isLoadingEdit">
                <i class="spinner-border spinner-border-sm me-2" role="status"></i>
                Actualizando...
              </span>
              <span v-else-if="isUploadingFile">
                <i class="spinner-border spinner-border-sm me-2" role="status"></i>
                Subiendo archivo...
              </span>
              <span v-else>Actualizar</span>
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isLoadingEdit">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>    <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  
  // Components
  import { ErrorMessage, FileUploader } from '../../components/_components';
  
  // Composables
  import { useSliders, useSubirArchivo } from '../../composables/_composables';
  
  // Interfaces
  import { Adjunto } from '../../interfaces/_interface';
  
  const props = defineProps<{ sliderId: number | null }>(); // Recibe el ID del slider a editar
  const emit = defineEmits(["updated"]);
  
  const { 
    editandoSlider, 
    errors, 
    Actualizar_Slider, 
    isLoadingEdit,
    prepararModalEditar 
  } = useSliders();
  
  const resetTrigger = ref(0);
  const isUploadingFile = ref(false);
  
  const archivoSlider = useSubirArchivo("loadingfile", "archivopdf");
  
  // Manejar el estado de subida de archivos
  const handleUploadStatus = (status: boolean) => {
    isUploadingFile.value = status;
  };

  // Watch para cargar datos cuando cambia el sliderId
  watch(() => props.sliderId, async (newId) => {
    if (newId) {
      await prepararModalEditar(newId);
      resetTrigger.value++; // Reset FileUploader
    }
  });
  
  const formActualizarSlider = async () => {
    const success = await Actualizar_Slider(); 
    if (success) {
      emit("updated");
      closeModal();
    }
  };
  
  const closeModal = () => {
    const modalElement = document.getElementById("edit_SliderModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  };
  </script>
  
  <style lang="css" scoped>
  input, select, textarea {
    background-color: #d7edf738 !important;
  }
  </style>
  