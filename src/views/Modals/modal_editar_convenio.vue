<template>
  <div class="modal modal-xl fade" id="edit_ConvenioModal" tabindex="-1" aria-labelledby="edit_ConvenioModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">        <!-- Modal Loader -->
        <ModalLoader :loading="isLoadingModal" message="Cargando datos del convenio..." />
        
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-edit p-r-15"></i> Editar Convenio
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingEdit"></button>
        </div>
        <div class="modal-body py-1" :class="{ 'opacity-50': isLoadingEdit }">
          <form @submit.prevent="actualizarConvenio">
            <div class="row g-1">              <div class="col-md-3">
                <label class="form-label">Tipo:</label>
                <select class="form-control" v-model="formData.tipo">
                  <option value="">Seleccionar...</option>
                  <option value="Trabajadores">Trabajadores</option>
                  <option value="Clientes">Clientes</option>
                  <option value="Ambos">Ambos</option>
                </select>
                <ErrorMessage :error="errors.tipo" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Fecha Inicio:</label>
                <input type="date" class="form-control" v-model="formData.fechaInicio" />
                <ErrorMessage :error="errors.fechaInicio" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Fecha Fin:</label>
                <input type="date" class="form-control" v-model="formData.fechaFin" />
                <p v-if="formData.fechaFin && formData.fechaFin < formData.fechaInicio" class="text-danger">
                    La fecha de fin no puede ser menor que la fecha de inicio.
                  </p>
                <ErrorMessage :error="errors.fechaFin" />
              </div>

              <div class="col-md-12">
                <label class="form-label">Descripción:</label>
                <textarea class="form-control" v-model="formData.descripcion"></textarea>
                <ErrorMessage :error="errors.descripcion" />
              </div>

              <div class="col-md-12">
                <label class="form-label">Observación:</label>
                <textarea class="form-control" v-model="formData.observacion"></textarea>
                <ErrorMessage :error="errors.observacion" />
              </div>

              <div class="col-md-12">
                <label class="form-label">Archivos Subidos:</label>
                <div class="d-flex">
                  <a v-if="formData.doc_url!=='' || formData.doc_url!==null" class="btn p-0 btn-light rounded-3 m-0" :href="formData.doc_url" target="_blank">
                      <img  src="../../assets/images/pdf_red.png" class="wid-30">
                      Convenio 
                  </a>
                  <a v-if="formData.adjunto1!==''" class="btn p-0 btn-light rounded-3 m-0" :href="formData.adjunto1" target="_blank">
                      <img  src="../../assets/images/pdf.png" class="wid-30">
                      Anexto 1
                  </a>
                  <a v-if="formData.adjunto2!==''" class="btn p-0 btn-light rounded-3 m-0" :href="formData.adjunto2" target="_blank">
                      <img  src="../../assets/images/pdf_gray.png" class="wid-30">
                      Anexo 2
                  </a>
                </div>
              </div>
              
              <!-- Checkboxes para activar los FileUploader -->
               <label class="form-label pt-4">Cambiar Documentos:</label>
              <div class="d-flex  mb-2">
                
                <div class=" d-flex px-2">
                  <input type="checkbox" v-model="mostrarDocumento" class="me-2 form-check "> ConvenioPDF
                </div>
                <div class=" d-flex px-2">
                  <input type="checkbox" v-model="mostrarAdjunto1" class="me-2 form-check"> Adjunto 1
                </div>
                <div class=" d-flex px-2">
                  <input type="checkbox" v-model="mostrarAdjunto2" class="me-2 form-check"> Adjunto 2
                </div>
              </div>     
              
              <!-- Documento Principal -->
              <FileUploader 
               v-if="mostrarDocumento"
                titulo="Documento"
                elementoLoader="loadingfile_convenio"
                tipoArchivo="archivopdf"
                :archivoTemporal="archivoConvenio.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(adjunto) => formData.doc_url = adjunto.url"
                @uploadingStatus="archivoConvenio.isUploading.value = $event"
              />

              <!-- Adjunto 1 -->
              <FileUploader 
                v-if="mostrarAdjunto1"
                titulo="Adjunto 1"
                elementoLoader="loadingfile_anexo1"
                tipoArchivo="archivopdf"
                :archivoTemporal="archivoAdjunto1.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(adjunto) => formData.adjunto1 = adjunto.url"
                @uploadingStatus="archivoAdjunto1.isUploading.value = $event"
              />

              <!-- Adjunto 2 -->
              <FileUploader 
                v-if="mostrarAdjunto2"
                titulo="Adjunto 2"
                elementoLoader="loadingfile_anexo2"
                tipoArchivo="archivopdf"
                :archivoTemporal="archivoAdjunto2.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(adjunto) => formData.adjunto2 = adjunto.url"
                @uploadingStatus="archivoAdjunto2.isUploading.value = $event"
              />
            </div>
          </form>
        </div>        <div class="modal-footer py-0">
          <button 
            type="submit" 
            class="btn btn-primary" 
            @click="actualizarConvenio" 
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
import { ref, watch, onMounted, nextTick, onUnmounted } from 'vue';
import { Notif, Alerta, Modal } from '../../utils/_utils';
import { ErrorMessage, FileUploader, ModalLoader } from '../../components/_components';
import { useSubirArchivo, useValidaConvenio } from '../../composables/_composables';
import { ConvenioService } from '../../services/_services';
import { initializeConvenioErrors, initializeConvenio } from '../../interfaces/medico.interface';
import type { Convenio } from '../../interfaces/_interface';

const props = defineProps<{ 
  convenio: Convenio 
}>();

const emit = defineEmits<{
  updated: []
}>();

// Estados de control del componente
const isComponentMounted = ref(false);
const isLoadingModal = ref(false);
const isLoadingEdit = ref(false);
const isUploadingFile = ref(false);

// Composables con identificadores únicos para evitar conflictos
const { validarFormulario, errors } = useValidaConvenio();

// Estado completamente local para este modal
const formData = ref<Convenio>(initializeConvenio());
const mostrarDocumento = ref(false);
const mostrarAdjunto1 = ref(false);
const mostrarAdjunto2 = ref(false);
const resetTrigger = ref(0);

// Manejo de archivos con IDs únicos
const archivoConvenio = useSubirArchivo("loadingfile_convenio_edit", "archivopdf");
const archivoAdjunto1 = useSubirArchivo("loadingfile_anexo1_edit", "archivopdf");
const archivoAdjunto2 = useSubirArchivo("loadingfile_anexo2_edit", "archivopdf");

// Función para preparar el formulario
const prepararFormulario = async () => {
  if (!isComponentMounted.value) return;

  try {
    isLoadingModal.value = true;

    // Validar que tenemos un convenio válido
    if (!props.convenio || !props.convenio.id) {
      console.warn('⚠️ No hay convenio válido para editar');
      return;
    }

    // Copiar datos del convenio al formulario local de forma segura
    formData.value = {
      ...props.convenio,
      fechaInicio: props.convenio.fechaInicio ? 
        new Date(props.convenio.fechaInicio).toISOString().split('T')[0] : '',
      fechaFin: props.convenio.fechaFin ? 
        new Date(props.convenio.fechaFin).toISOString().split('T')[0] : ''
    };

    // Configurar checkboxes basado en los archivos existentes
    mostrarDocumento.value = !!props.convenio.doc_url;
    mostrarAdjunto1.value = !!props.convenio.adjunto1;
    mostrarAdjunto2.value = !!props.convenio.adjunto2;

    // Limpiar errores
    errors.value = initializeConvenioErrors();

    await nextTick();
    console.log('✅ Formulario preparado para convenio ID:', props.convenio.id);
  } catch (error) {
    console.error('❌ Error preparando formulario:', error);
  } finally {
    if (isComponentMounted.value) {
      isLoadingModal.value = false;
    }
  }
};

// Watch para cambios en el convenio - con validaciones estrictas
watch(() => props.convenio?.id, async (newId, oldId) => {
  if (!isComponentMounted.value) return;
  
  console.log(`🔄 Convenio ID cambió: ${oldId} -> ${newId}`);
  
  if (newId && newId !== oldId && newId > 0) {
    await prepararFormulario();
  }
}, { immediate: false });

// Manejo de estados de carga de archivos
watch([
  () => archivoConvenio.isUploading.value,
  () => archivoAdjunto1.isUploading.value,
  () => archivoAdjunto2.isUploading.value
], ([uploadingConvenio, uploadingAdjunto1, uploadingAdjunto2]) => {
  if (isComponentMounted.value) {
    isUploadingFile.value = uploadingConvenio || uploadingAdjunto1 || uploadingAdjunto2;
  }
}, { immediate: true });

// Función de actualización mejorada
const actualizarConvenio = async () => {
  // Prevenir múltiples clicks y validar estado
  if (!isComponentMounted.value || isLoadingEdit.value || isUploadingFile.value) {
    console.log('⚠️ Actualización cancelada - estados:', {
      mounted: isComponentMounted.value,
      loading: isLoadingEdit.value,
      uploading: isUploadingFile.value
    });
    return;
  }
  
  try {
    // Validación de fechas
    if (formData.value.fechaFin && formData.value.fechaInicio && 
        formData.value.fechaFin < formData.value.fechaInicio) {
      Notif.Error("La fecha de fin no puede ser menor que la fecha de inicio.");
      return;
    }
    
    // Validación del formulario
    if (!validarFormulario(formData.value)) {
      Notif.Error("Por favor, complete todos los campos obligatorios.");
      return;
    }
    
    // Validar que tenemos un ID válido
    if (!props.convenio?.id || props.convenio.id <= 0) {
      console.error('❌ ID de convenio inválido:', props.convenio?.id);
      Notif.Error("Error: ID de convenio inválido");
      return;
    }
    
    isLoadingEdit.value = true;
    console.log('🔄 Actualizando convenio ID:', props.convenio.id);
    
    // Llamar al servicio de actualización
    const response = await ConvenioService.actualizar(props.convenio.id, formData.value);
    
    if (response && isComponentMounted.value) {
      Notif.Success('Convenio actualizado correctamente');
      emit("updated");
      closeModal();
    }
  } catch (error) {
    console.error('❌ Error actualizando convenio:', error);
    if (isComponentMounted.value) {
      Notif.Error('Error al actualizar el convenio');
    }
  } finally {
    if (isComponentMounted.value) {
      isLoadingEdit.value = false;
    }
  }
};

// Función de limpieza del modal
const closeModal = () => {
  if (!isComponentMounted.value) return;
  
  try {
    console.log('🚪 Cerrando modal de edición');
    
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingEdit.value = false;
    isUploadingFile.value = false;
    
    // Reset de checkboxes
    mostrarDocumento.value = false;
    mostrarAdjunto1.value = false;
    mostrarAdjunto2.value = false;
    
    // Reset de datos del formulario
    formData.value = initializeConvenio();
    
    // Reset trigger para archivos
    resetTrigger.value++;
    
    // Cerrar modal
    const modalElement = document.getElementById('edit_ConvenioModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  } catch (error) {
    console.error('❌ Error cerrando modal:', error);
  }
};

// Lifecycle hooks
onMounted(() => {
  // console.log('🚀 Montando modal de edición');
  isComponentMounted.value = true;
  
  // Configurar evento del modal
  const modalElement = document.getElementById("edit_ConvenioModal");
  if (modalElement) {
    modalElement.addEventListener('show.bs.modal', () => {
      if (isComponentMounted.value) {
        prepararFormulario();
      }
    });
    
    modalElement.addEventListener('hidden.bs.modal', () => {
      if (isComponentMounted.value) {
        // Reset solo visual, no los datos del convenio padre
        mostrarDocumento.value = false;
        mostrarAdjunto1.value = false;
        mostrarAdjunto2.value = false;
        resetTrigger.value++;
      }
    });
  }
  
  // Preparar formulario si ya hay un convenio
  if (props.convenio && props.convenio.id) {
    prepararFormulario();
  }
});

onUnmounted(() => {
  // console.log('🛑 Desmontando modal de edición');
  isComponentMounted.value = false;
  
  // Limpiar eventos del modal
  const modalElement = document.getElementById("edit_ConvenioModal");
  if (modalElement) {
    modalElement.removeEventListener('show.bs.modal', prepararFormulario);
  }
});
</script>
