<template>
  <div class="modal modal-lg fade" id="edit_NegocioModal" tabindex="-1" aria-labelledby="edit_NegocioModalLabel">
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
                    <input type="text" class="form-control" id="ruc" v-model="negocio.ruc" @change="onRucChange" />
                  </div>
              </div>
              <div class="col-md-8">
                  <div class="mb-1">
                    <label for="razonSocial" class="form-label mb-0">Razón Social:</label>
                    <input type="text" class="form-control" id="razonSocial" v-model="negocio.razonSocial" :disabled="isLoadingRuc"/>
                  </div>
              </div>
            </div>
            <!-- ---------- -->
            <div class="row g-1">
                  <div class="col-md-4">
                      <label class="form-label mb-0 f-13">Estado</label>
                      <div class="d-flex mb-1">
                              <input  v-model="negocio.estado"
                                      class="btn-check" checked type="radio" name="group5" value="Activo" id="customCheckinlh3">
                              <label class=" btn btn-outline-secondary b-gray py-1 px-2 m-r-5 w-100 f-w-600" for="customCheckinlh3"> Activo </label>
        
                              <input  v-model="negocio.estado"
                                      class="btn-check"  type="radio" name="group5" value="Inactivo" id="customCheckinlh1">
                              <label class=" btn btn-outline-danger b-gray px-2 py-1 m-r-5 w-100 f-w-600" for="customCheckinlh1"> Inactivo </label>
                      </div>
                  </div>
                  <div class="col-md-8">
                    <div class="mb-1">
                      <label for="nombreComercial" class="form-label mb-0">Nombre Comercial:</label>
                      <input type="text" class="form-control" id="nombreComercial" v-model="negocio.nombreComercial" />
                    </div>
                  </div>
            </div>
            <!-- ---------- -->
            <div class="row g-1">
              <div class="col-md-4">
                <div class="mb-1">
                    <label for="dniRepresentante" class="form-label mb-0">DNI Representante:</label>
                    <input type="text" class="form-control" id="dniRepresentante" v-model="negocio.dniRepresentante" @change="validarDNI" />
                  </div>
              </div>
              <div class="col-md-8">
                  <div class="mb-1">
                    <label for="nombreRep" class="form-label mb-0">Nombre del Representante:</label>
                    <input type="text" class="form-control" id="nombreRep" v-model="negocio.nombreRep" :disabled="isLoadingDni"/>
                  </div>
              </div>
            </div>
            <!-- ---------- -->
             <!-- ---------- -->
            <div class="row g-1">
              <div class="col-md-4">
                <div class="mb-1">
                  <label class="form-label text-primary">Categoria</label>                      <select class="form-control" id="genero" v-model="negocio.categoriaId">
                          <option v-for="categoria in listaCategorias" 
                              :value="categoria.id">{{categoria.nombre}}</option>
                      </select>
                      <ErrorMessage :error="errors.categoriaId" />
                </div>
              </div>
                 <div class="col-md-4">
                <div class="mb-1">
                    <label for="celular" class="form-label mb-0">Celular:</label>
                    <input type="text" class="form-control" v-model="negocio.celular" />
                  </div>
              </div>
                 <div class="col-md-4">
                <div class="mb-1">
                    <label for="correo" class="form-label mb-0">Correo:</label>
                    <input type="text" class="form-control" v-model="negocio.correo" />
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
              <input type="text" class="form-control" id="sitioWeb" v-model="negocio.sitioWeb" />
            </div>
            <div class="mb-1">
              <label for="facebook" class="form-label mb-0">Facebook:</label>
              <input type="text" class="form-control" id="facebook" v-model="negocio.facebook" />
            </div>
            <div class="mb-1">
              <label for="instagram" class="form-label mb-0">Instagram:</label>
              <input type="text" class="form-control" id="instagram" v-model="negocio.instagram" />
            </div>
            
          </form>
        </div>
        <div class="modal-footer py-0 modal_head_bg">
          <button 
            type="submit" 
            class="btn btn-primary" 
            @click="GuardaCambios"
            :disabled="isLoadingEdit || isLoadingDni || isLoadingRuc"
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
import { QuillEditor, ErrorMessage, ModalLoader } from '../../components/_components';
import { useNegocios, useCategorias, Sunat } from '../../composables/_composables';
import { initializeCrearNegocioErrors } from '../../interfaces/negocio.interface';
import type { Negocio } from '../../interfaces/_interface';
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
const isLoadingDni = ref(false);
const isLoadingRuc = ref(false);

// Composables
const { negocio, errors, Actualizar_Negocio } = useNegocios();
const { listaCategorias, Listar_Categorias } = useCategorias();
const { Validar_RUC, Validar_DNI, PersonaData, EmpresaData } = Sunat();

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
    
    // Verificar que props.negocio existe y tiene datos
    if (props.negocio && props.negocio.id) {
      // Copiar datos del negocio al formulario de forma segura
      negocio.value = JSON.parse(JSON.stringify(props.negocio));
      editorDescripcion.value = props.negocio.descripcion || '';
    }
    
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

// Observar cambios en el negocio - Usar solo el id para evitar problemas de inicialización
watch(() => props.negocio?.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    prepararFormulario();
  }
}, { immediate: true });

const validarDNI = async () => {
  if (!negocio.value.dniRepresentante || negocio.value.dniRepresentante.length !== 8) return;
  
  // Prevenir múltiples llamadas
  if (isLoadingDni.value) return;
  
  isLoadingDni.value = true;
  try {
    const respuesta = await Validar_DNI(negocio.value.dniRepresentante);
    if (respuesta) {
      negocio.value.nombreRep = `${PersonaData.value.nombres} ${PersonaData.value.apellidoPaterno} ${PersonaData.value.apellidoMaterno}`.trim();
      Notif.Success('DNI válido - Datos cargados');
    }
  } catch (error) {
    console.error('Error validando DNI:', error);
    Notif.Error('Error al validar DNI');
  } finally {
    isLoadingDni.value = false;
  }
};

const onRucChange = async () => {
  if (!negocio.value.ruc || negocio.value.ruc.length !== 11) return;
  
  // Prevenir múltiples llamadas
  if (isLoadingRuc.value) return;
  
  isLoadingRuc.value = true;
  try {
    NProgress.start();
    const respuesta = await Validar_RUC(negocio.value.ruc);
    if (respuesta) {
      negocio.value.razonSocial = EmpresaData.value.razonSocial;
      Notif.Success('RUC válido - Datos cargados');
    }
  } catch (error) {
    console.error('Error validando RUC:', error);
    Alerta.Error('Error', 'No se pudo obtener los datos del negocio.');
  } finally {
    isLoadingRuc.value = false;
    NProgress.done();
  }
};

const GuardaCambios = async () => {
  if (isLoadingEdit.value || isLoadingDni.value || isLoadingRuc.value) return;

  try {
    isLoadingEdit.value = true;

    // Actualizar la descripción desde el editor
    negocio.value.descripcion = editorDescripcion.value;
    console.log('Descripción actualizada:', negocio.value.descripcion);

    const resultado = await Actualizar_Negocio(negocio.value.id, negocio.value);
    if (resultado) {
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
    isLoadingDni.value = false;
    isLoadingRuc.value = false;
    
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
  const modalElement = document.getElementById('edit_NegocioModal');
  if (modalElement) {
    modalElement.removeAttribute('aria-hidden');
  }

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
