<template>
  <div class="modal modal-xl fade" id="add_OfertaModal" tabindex="-1" aria-labelledby="add_OfertaModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Loader -->
        <ModalLoader :loading="isLoadingModal" message="Preparando formulario de oferta..." />
        
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0 ">
            <i :class="isEditMode ? 'fa fa-edit' : 'fa fa-plus'" class="p-r-15"></i> 
            {{ isEditMode ? 'Editar Oferta' : 'Nueva Oferta' }}
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingCreate || isUploadingFile"></button>
        </div>
        <div class="modal-body py-1" :class="{ 'opacity-50': isLoadingCreate }">
          <form>
            <!-- Título de Oferta (dejado arriba como estaba) -->
            <div class="row g-1 mb-2">
              <div class="col-md-12">
                <label class="form-label">Título de Oferta:</label>
                <input type="text" class="form-control" v-model="localCita.nombre_paciente" />
                <!-- <ErrorMessage :error="errors.nombreOferta" /> -->
              </div>
            </div>
            
            <!-- Fila 2: N° de Cupos, Tipo Oferta, Fecha Inicio, Fecha Fin -->
            <div class="row g-1 mb-2">
              <div class="col-md-3">
                <label class="form-label">N° de Cupos:</label>
                <div class="input-group input-group-sm">
                  <!-- <button type="button" class="btn btn-secondary btn-sm" @click="localCita.numeroCupos > 1 && localCita.numeroCupos--">-</button> -->
                  <input
                    type="text"
                    min="1"
                    class="form-control text-center"
                    v-model="localCita.nro_cons"
                  />
                  <button type="button" class="btn btn-secondary btn-sm" @click="localCita.nro_cons++">+</button>
                </div>
                <!-- <ErrorMessage :error="errors.nro_cons" /> -->
              </div>
              <div class="col-md-3">
                <label class="form-label">Tipo Oferta:</label>
                <div class="d-flex mb-1">
                  <input
                      v-model="localCita.consultorio_id"
                      class="btn-check"
                      type="radio"
                      name="tipoOferta"
                      :value="'Permanente'"
                      id="tipoOfertaPermanente"
                  >
                  <label class="btn btn-outline-secondary b-gray py-1 px-2 m-r-5 w-100 f-w-600" for="tipoOfertaPermanente">
                      Permanente
                  </label>

                  <input
                      v-model="localCita.consultorio_id"
                      class="btn-check"
                      type="radio"
                      name="tipoOferta"
                      :value="'Especial'"
                      id="tipoOfertaEspecial"
                  >
                  <label class="btn btn-outline-secondary b-gray px-2 py-1 m-r-5 w-100 f-w-600" for="tipoOfertaEspecial">
                    Especial
                  </label>
                </div>
                <!-- <ErrorMessage :error="errors.tipoOferta" /> -->
              </div>
               <div class="col-md-3">
                <label class="form-label">Fecha Inicio:</label>
                <input type="date" class="form-control" v-model="localCita.hora_inicio" />
                <!-- <ErrorMessage :error="errors.fechaInicio" /> -->
              </div>
              <div class="col-md-3">
                <label class="form-label">Fecha Fin:</label>
                <input type="date" class="form-control" v-model="localCita.hora_fin" />
                <!-- <ErrorMessage :error="errors.hora_fin" /> -->
              </div>
              <!-- Tipo de Descuento y campos de descuentos alineados -->
              <div class="col-md-12">
                <div class="row g-2 align-items-center">
                  <div class="col-md-4">
                    <label class="form-label">Tipo de Descuento:</label>
                    <!-- <select v-model="localCita.tipoDescuento" class="form-select"> -->
                      <option value="Porcentual">Porcentual</option>
                      <option value="Texto">Texto</option>
                    <!-- </select> -->
                  </div>
                  <div class="col-md-4">
                    <div class="d-flex align-items-center">
                      <input type="checkbox" v-model="checkDsctoCliente" class="form-check me-2" id="checkCliente">
                      <label for="checkCliente" class="form-label mb-0 me-2" style="margin-bottom:0;white-space:nowrap;">
                        Descuento de Cliente
                      </label>
                      <!-- <template v-if="localCita.tipoDescuento === 'Porcentual'">
                        <div class="input-group input-group-sm ms-2" style="max-width: 140px;">
                          <button type="button" class="btn btn-warning btn-sm" @click="localCita.valordscto_cliente = Math.max(0, Number(localCita.valordscto_cliente || 0) - 1).toString()" :disabled="!checkDsctoCliente">-</button>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            class="form-control text-center"
                            v-model="localCita.valordscto_cliente"
                            placeholder="%"
                            :disabled="!checkDsctoCliente"
                          />
                          <button type="button" class="btn btn-warning btn-sm" @click="localCita.valordscto_cliente = Math.min(100, Number(localCita.valordscto_cliente || 0) + 1).toString()" :disabled="!checkDsctoCliente">+</button>
                        </div>
                      </template> -->
                      <!-- <template v-else>
                        <input
                          type="text"
                          class="form-control ms-2"
                          style="max-width: 140px;"
                          v-model="localCita.valordscto_cliente"
                          placeholder="Ej: 2x1, 3x2, etc."
                          :disabled="!checkDsctoCliente"
                        />
                      </template> -->
                    </div>
                    <!-- <ErrorMessage v-if="checkDsctoCliente" :error="errors.valordscto_cliente" /> -->
                  </div>
                  <div class="col-md-4">
                    <div class="d-flex align-items-center">
                      <input type="checkbox" v-model="checkDsctoTrabajador" class="form-check me-2" id="checkTrabajador">
                      <label for="checkTrabajador" class="form-label mb-0 me-2" style="margin-bottom:0;white-space:nowrap;">
                        Descuento de Trabajador
                      </label>
                      <!-- <template v-if="localCita.tipoDescuento === 'Porcentual'">
                        <div class="input-group input-group-sm ms-2" style="max-width: 140px;">
                          <button type="button" class="btn btn-danger btn-sm" @click="localCita.valordscto_trabajador = Math.max(0, Number(localCita.valordscto_trabajador || 0) - 1).toString()" :disabled="!checkDsctoTrabajador">-</button>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            class="form-control text-center"
                            v-model="localCita.valordscto_trabajador"
                            placeholder="%"
                            :disabled="!checkDsctoTrabajador"
                          />
                          <button type="button" class="btn btn-danger btn-sm" @click="localCita.valordscto_trabajador = Math.min(100, Number(localCita.valordscto_trabajador || 0) + 1).toString()" :disabled="!checkDsctoTrabajador">+</button>
                        </div>
                      </template> -->
                      <!-- <template v-else>
                        <input
                          type="text"
                          class="form-control ms-2"
                          style="max-width: 140px;"
                          v-model="localCita.valordscto_trabajador"
                          placeholder="Ej: 2x1, 3x2, etc."
                          :disabled="!checkDsctoTrabajador"
                        />
                      </template> -->
                    </div>
                    <!-- <ErrorMessage v-if="checkDsctoTrabajador" :error="errors.valordscto_trabajador" /> -->
                  </div>
                </div>
              </div>
              
            </div> 


            <!-- ----------------      ----------------- -->

            <!-- <div class="row g-1 mb-2 align-items-center"> -->
             

              
              <!-- Checkbox Trabajador y campo -->
              <!-- <div class="col-md-6 d-flex align-items-center   ">
                <input type="checkbox" v-model="checkDsctoTrabajador" class="form-check me-2" id="checkTrabajador" style="margin-top:2px;">
                <label for="checkTrabajador" class="form-label mb-0 me-2  " style="margin-bottom:0;white-space:nowrap;">
                  Descuento de Trabajador
                </label>
                <div class="input-group input-group-sm  ms-2">
                  <button type="button" class="btn btn-danger btn-sm" @click="localCita.valordscto_trabajador = Math.max(0, (localCita.valordscto_trabajador || 0) - 1)" :disabled="!checkDsctoTrabajador">-</button>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    class="form-control  text-center"
                    v-model.number="localCita.valordscto_trabajador"
                    placeholder="Descuento Trabajador"
                    :disabled="!checkDsctoTrabajador"
                  />
                  <button type="button" class="btn btn-danger btn-sm" @click="localCita.valordscto_trabajador = Math.min(100, (localCita.valordscto_trabajador || 0) + 1)" :disabled="!checkDsctoTrabajador">+</button>
                </div>
                <ErrorMessage v-if="checkDsctoTrabajador" :error="errors.valordscto_trabajador" />
              </div> -->

            <!-- </div> -->

            


            <div class="row g-1">
              <!-- Columna de Términos y Condiciones -->
              <div class="col-md-6">
                <label class="form-label">Términos y Condiciones:</label>
                <div class="">
                  <QuillEditor content-type="html" v-model:content="editorContent" :modules="modules" toolbar="minimal" theme="snow" />
                </div>
              </div>
     
              <!-- Columna de Descripcion -->
              <div class="col-md-6">
                <label class="form-label">Descripcion:</label>
                <div>
                  <QuillEditor content-type="html"  v-model:content="editorDescripcion" :modules="modules" toolbar="minimal" />
                </div>
              </div>
            </div> 
            <div class="row g-1 mt-2">
              <div class="col-md-2">
                  <label class="form-label">Imágen Actual:</label>
                  <div class="image-container card p-1 text-center rounded-1 mb-0 " >
                    <!-- <img v-if="localCita.estado!==''" :src="localCita.e" class="card-img pb-0"> -->
                    <!-- <img v-else src="../../assets/inmdefault.jpg" class="w-100 pb-0"> -->
                  </div>
              </div>
              <div class="col-md-10">                <FileUploader 
                  titulo="Imagen de Oferta"
                  elementoLoader="loadingfile"
                  tipoArchivo="fotografia"
                  :archivoTemporal="archivoOferta.ArchivoTemporal.value"
                  :resetTrigger="resetTrigger"
                  @archivoSubido="(archivo:Adjunto) => localCita.estado = archivo.url"
                  @uploadingStatus="archivoOferta.isUploading.value = $event"
                />
              </div>
            </div>
          </form>
        </div>        
        <div class="modal-footer  py-2 bd-highlight">
          <!-- <p v-if="localCita.estado && localCita.fechaFin < localCita.fechaInicio" class="alert alert-danger flex-fill bd-highlight">
            La fecha de fin no puede ser menor que la fecha de inicio.</p> -->
          <button 
            type="submit" 
            class="btn btn-primary" 
            @click="RegistrarOferta" 
            :disabled="isLoadingCreate || isUploadingFile"
          >
            <span v-if="isLoadingCreate" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span v-if="isLoadingCreate">{{ isEditMode ? 'Actualizando...' : 'Creando...' }}</span>
            <span v-else-if="isUploadingFile">Subiendo archivos...</span>
            <span v-else>{{ isEditMode ? 'Actualizar' : 'Crear' }}</span>
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isLoadingCreate">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Notif, Alerta, Modal } from '../../utils/_utils';
import { ErrorMessage, FileUploader, ModalLoader } from '../../components/_components';
import { useSubirArchivo, useCitas } from '../../composables/_composables';
import { Adjunto } from '../../interfaces/_interface';
import { QuillEditor } from '@vueup/vue-quill';
import BlotFormatter from 'quill-blot-formatter';

// Declarar los estados de los checkboxes al inicio para asegurar visibilidad
const checkDsctoCliente = ref(false);
const checkDsctoTrabajador = ref(false);

// Props y emit
const props = defineProps<{
  id?: number;
  oferta?: any; // Para edición
}>();

const emit = defineEmits<{
  updated: []
}>();

// Estados de carga separados
const isLoadingModal = ref(false);
const isLoadingCreate = ref(false);
const isUploadingFile = ref(false);

// Variables reactivas
const idnegocio = computed(() => props.id);
const resetTrigger = ref(0);

// Detectar si estamos en modo edición
const isEditMode = computed(() => !!props.oferta);

// Usar el composable que ya tiene la funcionalidad necesaria
const { 
  localCita, 
  // errors, 
  editorContent, 
  editorDescripcion,
  Crear_Cita,
  Actualizar_Cita,
  resetearFormulario,
  prepararEdicion,
  // limpiarErrores
} = useCitas();

// Validación de formulario ya incluida en useOfertas

// Manejo de archivos
const archivoOferta = useSubirArchivo("loadingfile", "archivopdf");

// Observar estado de carga de archivos
watch(() => archivoOferta.isUploading.value, (uploading) => {
  isUploadingFile.value = uploading;
});

// Asignar negocio ID cuando cambie
// watch(() => idnegocio.value, (newId) => {
//   if (newId !== undefined) {
//     localCita.value.negocioId = newId;
//   }
// }, { immediate: true });

// Preparar formulario automáticamente
const prepararFormulario = async () => {
  try {
    isLoadingModal.value = true;
    if (props.oferta) {
      // Modo edición: preparar con datos existentes
      prepararEdicion(props.oferta);
      checkDsctoCliente.value = (props.oferta.valordscto_cliente ?? 0) > 0;
      checkDsctoTrabajador.value = (props.oferta.valordscto_trabajador ?? 0) > 0;
    } else {
      // Modo creación: resetear formulario y editores
      resetearFormulario();
      checkDsctoCliente.value = false;
      checkDsctoTrabajador.value = false;
      // Asignar ID del negocio si está disponible
      if (idnegocio.value !== undefined) {
        // localCita.value.negocioId = idnegocio.value;
      }
      // Reiniciar los editores con <p></p> para evitar que se queden pegados
      editorContent.value = '<p></p>';
      editorDescripcion.value = '<p></p>';
      // localCita.value.valordscto_cliente = '';
      // localCita.value.valordscto_trabajador = '';
    }
    // Reset trigger para archivos
    resetTrigger.value++;
    await nextTick();
  } catch (error) {
    console.error('Error preparando formulario:', error);
    Notif.Error('Error al preparar el formulario');
  } finally {
    isLoadingModal.value = false;
  }
};

// Watch para checkboxes: si se desmarcan, poner el valor en 0
// watch(checkDsctoCliente, (val) => {
//   if (!val) {
//     localCita.value.valordscto_cliente = '';
//   }
// });
// watch(checkDsctoTrabajador, (val) => {
//   if (!val) {
//     localCita.value.valordscto_trabajador = '';
//   }
// });

// Observar cambios en los props
watch([() => props.oferta, () => props.id], prepararFormulario, { immediate: true });

const modules = {
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {}
};

const resetOnModalShow = () => {
  if (!isEditMode.value) {
    prepararFormulario();
  }
};

// Configurar listener para el evento de mostrar modal
onMounted(() => {
  const modalElement = document.getElementById("add_OfertaModal");
  if (modalElement) {
    modalElement.addEventListener('shown.bs.modal', resetOnModalShow);
  }
});

// Limpiar listener cuando el componente se desmonta
onUnmounted(() => {
  const modalElement = document.getElementById("add_OfertaModal");
  if (modalElement) {
    modalElement.removeEventListener('shown.bs.modal', resetOnModalShow);
  }
});

// Función para crear nueva oferta
const crearOferta = async () => {
  const success = await Crear_Cita();
  if (success) {
    Notif.Success('Oferta creada correctamente');
    emit('updated');
    closeModal();
  }
  return success;
};

// Función para actualizar oferta existente
const actualizarOferta = async () => {
  const success = await Actualizar_Cita();
  if (success) {
    Notif.Success('Oferta actualizada correctamente');
    emit('updated');
    closeModal();
  }
  return success;
};

// Función principal simplificada
const RegistrarOferta = async () => {
  if (isLoadingCreate.value || isUploadingFile.value) return;
  
  try {
    isLoadingCreate.value = true;
    
    // Sincronizar contenido del editor
    // localCita.value.terminosCondiciones = editorContent.value;
    // localCita.value.descripcion = editorDescripcion.value;

    // Validar formulario
    // limpiarErrores();
    // if (!validarFormulario(localCita.value)) {
    //   Alerta.Advertencia("Advertencia", "Por favor, complete todos los campos obligatorios.");
    //   return;
    // }

    // Ejecutar acción correspondiente
    console.log('isEditMode:', isEditMode.value);
    if (isEditMode.value) {
      await actualizarOferta();
    } else {
      await crearOferta();
    }
    
  } catch (error) {
    console.error('Error al guardar oferta:', error);
    Notif.Error('Error al guardar la oferta');
  } finally {
    isLoadingCreate.value = false;
  }
};

const closeModal = () => {
  try {
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingCreate.value = false;
    isUploadingFile.value = false;
    
    // Reset trigger para archivos
    resetTrigger.value++;
    
    // Cerrar modal
    const modalElement = document.getElementById("add_OfertaModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};
</script>