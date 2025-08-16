<template>
  <div class="modal modal-lg fade" id="edit_PublicidadModal" tabindex="-1" aria-labelledby="edit_PublicidadModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Loader -->
        <ModalLoader :loading="isLoadingModal" message="Cargando datos de la publicidad..." />
        
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0" id="edit_PublicidadModalLabel">
            <i class="fa fa-edit p-r-15"></i> Editar Publicidad
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingEdit || isUploadingFile"></button>
        </div>
        <div class="modal-body py-1" :class="{ 'opacity-50': isLoadingEdit }">
          <form>
            <div class="row g-1">

              <div class="col-md-12">
                <label class="form-label">Nombre Proyecto:</label>
                <input type="text" class="form-control" v-model="publicidad.nombreProyecto" />
                <ErrorMessage :error="errors.nombreProyecto" />
              </div>
      
              <!-- Estados -->
              <div class="col-md-12">
                <label class="form-label mb-0 f-13">Estado</label>
                <select class="form-control" v-model="publicidad.estado">
                  <option value="Lotes Disponibles">Lotes Disponibles</option>
                  <option value="Proyecto Entregado">Proyecto Entregado</option>
                </select>
                <ErrorMessage :error="errors.estado" />
              </div>              <!-- Subida de Imagen -->
              <FileUploader 
                titulo="Imagen del Publicidad"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoPublicidad.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(archivo: Adjunto) => publicidad.urlFoto = archivo.url"
                @uploadingStatus="archivoPublicidad.isUploading.value = $event"
              />
              
              <!-- Campo Ubicación -->
              <div class="col-md-12">
                <label class="form-label">Ubicacion:</label>
                <input type="text" class="form-control" v-model="publicidad.ubicacionProyecto" />
                <ErrorMessage :error="errors.ubicacionProyecto" />
              </div>
    
  
            <div class="col-md-12">
                <label class="form-label">Cuotas:</label>
                <input type="text" class="form-control" v-model="publicidad.cuotas" />
                <ErrorMessage :error="errors.cuotas" />
              </div>
 

            <div class="col-md-12">
                <label class="form-label">Areas:</label>
                <input type="text" class="form-control" v-model="publicidad.area" />
                <ErrorMessage :error="errors.area" />
            </div>
         
              <div class="col-md-12">
                <label class="form-label">Link:</label>
                <input type="text" class="form-control" v-model="publicidad.link" />
                <ErrorMessage :error="errors.link" />
              </div>
            </div>
          </form>
        </div>        <div class="modal-footer py-0">
          <button 
            type="submit" 
            class="btn btn-primary" 
            @click="formActualizarPublicidad" 
            :disabled="isLoadingEdit || isUploadingFile"
          >
            <span v-if="isLoadingEdit" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span v-if="isLoadingEdit">Actualizando...</span>
            <span v-else-if="isUploadingFile">Subiendo archivos...</span>
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
import { ref, watch, onMounted, nextTick } from 'vue';
import { Modal, Notif } from '../../utils/_utils';
import { ErrorMessage, FileUploader, ModalLoader } from '../../components/_components';
import { usePublicidad, useSubirArchivo } from '../../composables/_composables';
import { initializePublicidadErrors } from '../../interfaces/_interface';
import type { Adjunto } from '../../interfaces/_interface';

const props = defineProps<{ publicidadId: number | null }>(); 
const emit = defineEmits(["updated"]);

// Estados de carga separados
const isLoadingModal = ref(false);
const isLoadingEdit = ref(false);
const isUploadingFile = ref(false);

// Composables
const { publicidad, errors, Actualizar_Publicidad, Obtener_Publicidad } = usePublicidad();
const resetTrigger = ref(0);

// Manejo de archivos
const archivoPublicidad = useSubirArchivo("loadingfile", "archivopdf");

// Observar estado de carga de archivos
watch(() => archivoPublicidad.isUploading.value, (uploading) => {
  isUploadingFile.value = uploading;
});

// Preparar formulario automáticamente
const prepararFormulario = async () => {
  try {
    isLoadingModal.value = true;
    
    if (props.publicidadId) {
      // Cargar datos de la publicidad
      await Obtener_Publicidad(props.publicidadId);
    }
    
    // Limpiar errores
    errors.value = initializePublicidadErrors();
    
    // Reset trigger para archivos
    resetTrigger.value++;
    
    await nextTick();
  } catch (error) {
    console.error('Error preparando formulario:', error);
    Notif.Error('Error al cargar los datos de la publicidad');
  } finally {
    isLoadingModal.value = false;
  }
};

// Observar cambios en el ID de publicidad
watch(() => props.publicidadId, prepararFormulario, { immediate: true });

const formActualizarPublicidad = async () => {
  // Prevenir múltiples clicks
  if (isLoadingEdit.value || isUploadingFile.value) return;
  
  try {
    isLoadingEdit.value = true;
    
    const success = await Actualizar_Publicidad(); 
    if (success) {
      Notif.Success('Publicidad actualizada correctamente');
      emit("updated");
      closeModal();
    }
  } catch (error) {
    console.error('Error actualizando publicidad:', error);
    Notif.Error('Error al actualizar la publicidad');
  } finally {
    isLoadingEdit.value = false;
  }
};

const closeModal = () => {
  try {
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingEdit.value = false;
    isUploadingFile.value = false;
    
    // Reset trigger para archivos
    resetTrigger.value++;
    
    // Cerrar modal
    const modalElement = document.getElementById("edit_PublicidadModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};

// Preparar formulario al montar si hay ID
onMounted(() => {
  if (props.publicidadId) {
    prepararFormulario();
  }
});
</script>

<style lang="css" scoped>
input, select, textarea {
  background-color: #d7edf738 !important;
}
</style>
