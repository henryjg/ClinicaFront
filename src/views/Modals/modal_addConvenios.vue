<template>
  <div class="modal modal-xl fade" id="add_ConvenioModal" tabindex="-1" aria-labelledby="add_ConvenioModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-plus p-r-15"></i> Nuevo Convenio
          </h5>          
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingCreate || isUploadingFile"></button>
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
          <form v-else @submit.prevent="registrarConvenio">
            <div class="row g-1">
              <div class="col-md-3">
                <label class="form-label">Tipo:</label>
                <select class="form-control" v-model="localConvenio.tipo">
                  <option value="">Seleccionar...</option>
                  <option value="Trabajadores">Trabajadores</option>
                  <option value="Clientes">Clientes</option>
                  <option value="Ambos">Ambos</option>
                </select>
                <ErrorMessage :error="errors.tipo" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Fecha Inicio:</label>
                <input type="date" class="form-control" v-model="localConvenio.fechaInicio" />
                <ErrorMessage :error="errors.fechaInicio" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Fecha Fin:</label>
                <input type="date" class="form-control" v-model="localConvenio.fechaFin" />
                <p v-if="localConvenio.fechaFin && localConvenio.fechaFin < localConvenio.fechaInicio" class="text-danger">
                    La fecha de fin no puede ser menor que la fecha de inicio.
                  </p>
                <ErrorMessage :error="errors.fechaFin" />
              </div>

              <div class="col-md-12">
                <label class="form-label">Descripción:</label>
                <textarea class="form-control" v-model="localConvenio.descripcion"></textarea>
                <ErrorMessage :error="errors.descripcion" />
              </div>

              <div class="col-md-12">
                <label class="form-label">Observación:</label>
                <textarea class="form-control" v-model="localConvenio.observacion"></textarea>
                <ErrorMessage :error="errors.observacion" />
              </div>

              <!-- <div class="col-md-12">
                <label class="form-label">Observación:</label>
                <textarea class="form-control" v-model="localConvenio.observacion"></textarea>
                <ErrorMessage :error="errors.observacion" />
              </div> -->

              <!-- Checkboxes para activar los FileUploader -->
              <div class="d-flex">
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
                elementoLoader="loadingfile_convenio_add"
                tipoArchivo="archivopdf"
                :archivoTemporal="archivoConvenio.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(adjunto) => localConvenio.doc_url = adjunto.url"
                @uploadingStatus="handleUploadStatus"
              />

              <!-- Adjunto 1 -->
              <FileUploader 
                v-if="mostrarAdjunto1"
                titulo="Adjunto 1"
                elementoLoader="loadingfile_anexo1_add"
                tipoArchivo="archivopdf"
                :archivoTemporal="archivoAdjunto1.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(adjunto) => localConvenio.adjunto1 = adjunto.url"
                @uploadingStatus="handleUploadStatus"
              />

              <!-- Adjunto 2 -->
              <FileUploader 
                v-if="mostrarAdjunto2"
                titulo="Adjunto 2"
                elementoLoader="loadingfile_anexo2_add"
                tipoArchivo="archivopdf"
                :archivoTemporal="archivoAdjunto2.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(adjunto) => localConvenio.adjunto2 = adjunto.url"
                @uploadingStatus="handleUploadStatus"
              />
            </div>
          </form>
        </div>        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="registrarConvenio" :disabled="isLoadingCreate || isUploadingFile">
            <span v-if="isLoadingCreate">
              <i class="spinner-border spinner-border-sm me-2" role="status"></i>
              Guardando...
            </span>
            <span v-else-if="isUploadingFile">
              <i class="spinner-border spinner-border-sm me-2" role="status"></i>
              Subiendo archivos...
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
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { Notif, Alerta, Modal } from '../../utils/_utils';
import { ErrorMessage, FileUploader } from '../../components/_components';
import { useSubirArchivo, useValidaConvenio, useConvenios } from '../../composables/_composables';
import { ConvenioService } from '../../services/_services';
import { initializeConvenio } from '../../interfaces/medico.interface';
import type { Adjunto, Convenio } from '../../interfaces/_interface';

const props = defineProps<{ 
  id: number 
}>();

const emit = defineEmits<{
  updated: []
}>();

// Estados locales para el modal
const isComponentMounted = ref(false);
const isLoadingModal = ref(false);
const isLoadingCreate = ref(false);
const isUploadingFile = ref(false);
const resetTrigger = ref(0);

// Composables con instancias separadas
const archivoConvenio = useSubirArchivo("loadingfile_convenio_add", "archivopdf");
const archivoAdjunto1 = useSubirArchivo("loadingfile_anexo1_add", "archivopdf");
const archivoAdjunto2 = useSubirArchivo("loadingfile_anexo2_add", "archivopdf");

const { validarFormulario, errors } = useValidaConvenio();
const { cargarConveniosNegocio } = useConvenios();

// Estado local completamente independiente
const localConvenio = ref<Convenio>(initializeConvenio());

// Estados de UI
const mostrarDocumento = ref(false);
const mostrarAdjunto1 = ref(false);
const mostrarAdjunto2 = ref(false);

// Manejar el estado de subida de archivos
const handleUploadStatus = (status: boolean) => {
  if (isComponentMounted.value) {
    isUploadingFile.value = status;
  }
};

// Watch para actualizar negocioId solo cuando cambie realmente
watch(() => props.id, (newId, oldId) => {
  if (isComponentMounted.value && newId && newId !== oldId && newId > 0) {
    localConvenio.value.negocioId = newId;
  }
}, { immediate: true });

// Función para preparar el modal
const prepararModal = async (convenioToEdit: Convenio | null = null) => {
  if (!isComponentMounted.value) return;
  
  isLoadingModal.value = true;
  try {
    if (convenioToEdit) {
      // Editar convenio existente
      localConvenio.value = JSON.parse(JSON.stringify(convenioToEdit));
      mostrarDocumento.value = !!convenioToEdit.doc_url;
      mostrarAdjunto1.value = !!convenioToEdit.adjunto1;
      mostrarAdjunto2.value = !!convenioToEdit.adjunto2;
    } else {
      // Nuevo convenio
      ResetConvenio();
      mostrarDocumento.value = false;
      mostrarAdjunto1.value = false;
      mostrarAdjunto2.value = false;
    }
    
    await nextTick();
    resetTrigger.value++; // Reset FileUploader
  } catch (error) {
    console.error('Error preparando modal:', error);
  } finally {
    if (isComponentMounted.value) {
      isLoadingModal.value = false;
    }
  }
};

// Función de registro mejorada
const registrarConvenio = async () => {
  if (!isComponentMounted.value || isLoadingCreate.value || isUploadingFile.value) return;

  // Validaciones
  if (localConvenio.value.fechaFin && localConvenio.value.fechaInicio && 
      localConvenio.value.fechaFin < localConvenio.value.fechaInicio) {
    Notif.Error("La fecha de fin no puede ser menor que la fecha de inicio.");
    return;
  }

  if (!validarFormulario(localConvenio.value)) {
    Notif.Error("Por favor, complete todos los campos obligatorios.");
    return;
  }

  isLoadingCreate.value = true;
  try {
    // Asegurar que el negocioId esté asignado
    if (!localConvenio.value.negocioId && props.id) {
      localConvenio.value.negocioId = props.id;
    }

    const response = await ConvenioService.crear(localConvenio.value);

    if (response && isComponentMounted.value) {
      Notif.Success('Convenio registrado con éxito.');
      emit("updated");
      closeModal();
    }
  } catch (error) {
    console.error("Error al registrar el convenio:", error);
    if (isComponentMounted.value) {
      Notif.Error('Error al registrar el convenio');
    }
  } finally {
    if (isComponentMounted.value) {
      isLoadingCreate.value = false;
    }
  }
};

// Reset del convenio
const ResetConvenio = () => {
  try {
    // Reset completo usando la función de inicialización
    localConvenio.value = initializeConvenio();
    
    // Asegurar que se asigna el negocioId si está disponible
    if (props.id && props.id > 0) {
      localConvenio.value.negocioId = props.id;
    }
    
    // Reset archivos si están montados
    if (isComponentMounted.value) {
      archivoConvenio.reset_formUpload();
      archivoAdjunto1.reset_formUpload();
      archivoAdjunto2.reset_formUpload();
    }
  } catch (error) {
    console.error('Error reseteando convenio:', error);
  }
};

// Estados de referencia para eventos
let modalShowHandler: (() => void) | null = null;
let modalHideHandler: (() => void) | null = null;

// Cerrar modal con limpieza completa
const closeModal = () => {
  if (!isComponentMounted.value) return;
  
  try {
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingCreate.value = false;
    isUploadingFile.value = false;
    
    // Reset de checkboxes
    mostrarDocumento.value = false;
    mostrarAdjunto1.value = false;
    mostrarAdjunto2.value = false;
    
    // Cerrar modal
    const modalElement = document.getElementById('add_ConvenioModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    isComponentMounted.value = true;
    
    // Inicializar con el ID si está disponible
    if (props.id && props.id > 0) {
      localConvenio.value.negocioId = props.id;
    }
    
    // Configurar evento del modal después de que el componente esté listo
    await nextTick();
    
    const modalElement = document.getElementById("add_ConvenioModal");
    if (modalElement) {
      // Crear handlers con referencias fijas
      modalShowHandler = () => {
        if (isComponentMounted.value) {
          prepararModal();
        }
      };
      
      modalHideHandler = () => {
        if (isComponentMounted.value) {
          ResetConvenio();
        }
      };
      
      modalElement.addEventListener('show.bs.modal', modalShowHandler);
      modalElement.addEventListener('hidden.bs.modal', modalHideHandler);
    }
  } catch (error) {
    console.error('Error en mounted hook:', error);
  }
});

onUnmounted(() => {
  try {
    isComponentMounted.value = false;
    
    // Limpiar eventos del modal
    const modalElement = document.getElementById("add_ConvenioModal");
    if (modalElement && modalShowHandler && modalHideHandler) {
      modalElement.removeEventListener('show.bs.modal', modalShowHandler);
      modalElement.removeEventListener('hidden.bs.modal', modalHideHandler);
    }
    
    // Reset referencias
    modalShowHandler = null;
    modalHideHandler = null;
    
    // Reset estados
    isLoadingModal.value = false;
    isLoadingCreate.value = false;
    isUploadingFile.value = false;
  } catch (error) {
    console.error('Error en unmounted hook:', error);
  }
});
</script>