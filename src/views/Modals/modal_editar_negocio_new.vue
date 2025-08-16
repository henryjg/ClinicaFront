<template>
  <div class="modal modal-lg fade" id="edit_NegocioModal" tabindex="-1" aria-labelledby="edit_NegocioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Loader -->
        <ModalLoader :loading="isLoadingModal" message="Cargando datos del negocio..." />
        
        <div class="modal-header py-2 modal_head_bg">
          <h5 class="modal-title py-0" id="edit_NegocioModalLabel">
            <i class="fa fa-edit p-r-5 "></i> Editar Negocio
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingEdit"></button>
        </div>
        <div class="modal-body py-1" :class="{ 'opacity-50': isLoadingEdit }">
          <form>
            <!-- ---------- -->
            <div class="row g-1">
              <div class="col-md-4">
                  <div class="mb-1">
                    <label for="ruc" class="form-label mb-0">RUC:</label>
                    <input type="text" class="form-control" id="ruc" v-model="nuevoNegocio.ruc" @change="onRucChange" />
                  </div>
              </div>
              <div class="col-md-8">
                  <div class="mb-1">
                    <label for="razonSocial" class="form-label mb-0">Razón Social:</label>
                    <input type="text" class="form-control" id="razonSocial" v-model="nuevoNegocio.razonSocial" :disabled="isValidatingRuc"/>
                  </div>
              </div>
            </div>
            <!-- ---------- -->
            <div class="row g-1">
                  <div class="col-md-4">
                      <label class="form-label mb-0 f-13">Estado</label>
                      <div class="d-flex mb-1">
                              <input  v-model="nuevoNegocio.estado"
                                      class="btn-check" checked type="radio" name="group5" value="Activo" id="customCheckinlh3">
                              <label class=" btn btn-outline-secondary b-gray py-1 px-2 m-r-5 w-100 f-w-600" for="customCheckinlh3"> Activo </label>
        
                              <input  v-model="nuevoNegocio.estado"
                                      class="btn-check"  type="radio" name="group5" value="Inactivo" id="customCheckinlh1">
                              <label class=" btn btn-outline-danger b-gray px-2 py-1 m-r-5 w-100 f-w-600" for="customCheckinlh1"> Inactivo </label>
                      </div>
                  </div>
                  <div class="col-md-8">
                    <div class="mb-1">
                      <label for="nombreComercial" class="form-label mb-0">Nombre Comercial:</label>
                      <input type="text" class="form-control" id="nombreComercial" v-model="nuevoNegocio.nombreComercial" />
                    </div>
                  </div>
            </div>
            <!-- ---------- -->
            <div class="row g-1">
              <div class="col-md-4">
                  <div class="mb-1">
                    <label for="dniRepresentante" class="form-label mb-0">DNI Representante:</label>
                    <input type="text" class="form-control" id="dniRepresentante" v-model="nuevoNegocio.dniRepresentante" @change="validarDNI" />
                  </div>
              </div>
              <div class="col-md-8">
                  <div class="mb-1">
                    <label for="nombreRep" class="form-label mb-0">Nombre del Representante:</label>
                    <input type="text" class="form-control" id="nombreRep" v-model="nuevoNegocio.nombreRep" :disabled="isValidatingDni"/>
                  </div>
              </div>
            </div>
            <!-- ---------- -->
             <!-- ---------- -->
            <div class="row g-1">
              <div class="col-md-4">
                <div class="mb-1">
                  <label class="form-label text-primary">Categoria</label>
                      <select class="form-control" id="genero" v-model="nuevoNegocio.categoriaId">
                          <option v-for="categoria in listaCategorias" 
                              :value="categoria.id">{{categoria.nombre}}</option>
                      </select>
                      <ErrorMessage :error="errors.categoriaId" />
                </div>
              </div>
             
            </div>
            <!-- ---------- -->

           
            
            <div class="mb-1">
              <label for="descripcion" class="form-label mb-0">Descripción:</label>
               <div>
                  <QuillEditor content-type="html" v-model:content="editorDescripcion" :options="editorOption" toolbar="minimal" theme="snow" />
                </div>
            </div>
            <div class="mb-1">
              <label for="sitioWeb" class="form-label mb-0">Sitio Web:</label>
              <input type="text" class="form-control" id="sitioWeb" v-model="nuevoNegocio.sitioWeb" />
            </div>
            <div class="mb-1">
              <label for="facebook" class="form-label mb-0">Facebook:</label>
              <input type="text" class="form-control" id="facebook" v-model="nuevoNegocio.facebook" />
            </div>
            <div class="mb-1">
              <label for="instagram" class="form-label mb-0">Instagram:</label>
              <input type="text" class="form-control" id="instagram" v-model="nuevoNegocio.instagram" />
            </div>
            
          </form>
        </div>        <div class="modal-footer py-0 modal_head_bg">
          <button 
            type="submit" 
            class="btn btn-primary" 
            @click="GuardaCambios"
            :disabled="isLoadingEdit || isValidatingDni || isValidatingRuc"
          >
            <span v-if="isLoadingEdit" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span v-if="isLoadingEdit">Actualizando...</span>
            <span v-else>Guardar</span>
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

// Components
import { QuillEditor, ErrorMessage, ModalLoader } from '../../components/_components';

// Composables
import { useNegocios, useCategorias, Sunat } from '../../composables/_composables';

// Interfaces
import { initializeCrearNegocioErrors } from '../../interfaces/negocio.interface';
import type { Negocio } from '../../interfaces/negocio.interface';

// Utils
import { Alerta, NProgress, BlotFormatter, Modal, Notif } from '../../utils/_utils';

const props = defineProps<{
  negocio: Negocio;
}>();

const emit = defineEmits<{
  updated: []
}>();

// Estados de carga separados
const isLoadingModal = ref(false);
const isLoadingEdit = ref(false);

// Composables
const { Actualizar_Negocio, errors } = useNegocios();
const { listaCategorias, Listar_Categorias } = useCategorias();
const { Validar_RUC, Validar_DNI, PersonaData, EmpresaData, isValidatingRuc, isValidatingDni } = Sunat();

// Local state for editing
const nuevoNegocio = ref<Negocio>({ ...props.negocio });

// Estados locales
const editorDescripcion = ref('');

// Editor configuration for Quill
const editorOption = ref({
  theme: 'snow',
  placeholder: 'Escriba aquí su descripción...',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link'],
      ['image']
    ],
    blotFormatter: {
      name: 'blotFormatter',
      module: BlotFormatter,
    },
  },
});

// Preparar formulario automáticamente
const prepararFormulario = async () => {
  try {
    isLoadingModal.value = true;
    
    // Cargar categorías si no están cargadas
    if (!listaCategorias.value || listaCategorias.value.length === 0) {
      await Listar_Categorias();
    }
    
    // Copiar datos del negocio al formulario
    nuevoNegocio.value = { ...props.negocio };
    editorDescripcion.value = props.negocio.descripcion || '';
    
    // Limpiar errores
    errors.value = initializeCrearNegocioErrors();
    
    await nextTick();
  } catch (error) {
    console.error('Error preparando formulario:', error);
    Notif.Error('Error al cargar los datos del negocio');
  } finally {
    isLoadingModal.value = false;
  }
};

// Observar cambios en el negocio
watch(() => props.negocio, prepararFormulario, { immediate: true });

const validarDNI = async () => {
  if (!nuevoNegocio.value.dniRepresentante || nuevoNegocio.value.dniRepresentante.length !== 8) return;
  
  try {
    const respuesta = await Validar_DNI(nuevoNegocio.value.dniRepresentante);
    if (respuesta) {
      nuevoNegocio.value.nombreRep = `${PersonaData.value.nombres} ${PersonaData.value.apellidoPaterno} ${PersonaData.value.apellidoMaterno}`.trim();
      Notif.Success('DNI válido - Datos cargados');
    }
  } catch (error) {
    console.error('Error validating DNI:', error);
    Notif.Error('Error al validar DNI');
  }
};

const onRucChange = async () => {
  if (!nuevoNegocio.value.ruc || nuevoNegocio.value.ruc.length !== 11) return;
  
  try {
    NProgress.start();
    const respuesta = await Validar_RUC(nuevoNegocio.value.ruc);
    if (respuesta) {
      nuevoNegocio.value.razonSocial = EmpresaData.value.razonSocial;
      Notif.Success('RUC válido - Datos cargados');
    }
  } catch (error) {
    console.error('Error validating RUC:', error);
    Alerta.Error('Error', 'No se pudo obtener los datos del negocio.');
  } finally {
    NProgress.done();
  }
};

const GuardaCambios = async () => {
  // Prevenir múltiples clicks
  if (isLoadingEdit.value || isValidatingDni.value || isValidatingRuc.value) return;
  
  try {
    isLoadingEdit.value = true;
    
    // Update description from editor
    nuevoNegocio.value.descripcion = editorDescripcion.value;
    
    const success = await Actualizar_Negocio(nuevoNegocio.value.id, nuevoNegocio.value);
    if (success) {
      Notif.Success('Negocio actualizado correctamente');
      emit('updated');
      closeModal();
    }
  } catch (error) {
    console.error('Error al guardar negocio:', error);
    Notif.Error('Error al actualizar el negocio');
  } finally {
    isLoadingEdit.value = false;
  }
};

const closeModal = () => {
  try {
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingEdit.value = false;
    
    // Reset del editor
    editorDescripcion.value = '';
    
    // Cerrar modal
    const modalElement = document.getElementById('edit_NegocioModal');
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
  if (props.negocio) {
    prepararFormulario();
  }
});
</script>

<style lang="css" scoped>
input, select, textarea {
  background-color: #cad9ea38 !important;
}
</style>
