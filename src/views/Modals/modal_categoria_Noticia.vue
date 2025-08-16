<template>
  <div class="modal modal-lg fade" id="categoriaNoticiaModal" tabindex="-1" aria-labelledby="categoriaNoticiaModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-plus p-r-15"></i> Nueva Categoría
          </h5>          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingCreate"></button>
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
          <form v-else @submit.prevent="handleSubmit">
            <div class="row g-1">
              <!-- Campo Nombre de la Categoría -->
              <div class="col-md-12">
                <label class="form-label">Nombre Categoría:</label>
                <input type="text" class="form-control" v-model="categoriaNoti.nombre" />
                <ErrorMessage :error="errors.nombre" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="handleSubmit" :disabled="isLoadingCreate">
            <span v-if="isLoadingCreate">
              <i class="spinner-border spinner-border-sm me-2" role="status"></i>
              Guardando...
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
import { ErrorMessage } from '../../components/_components';

// Composables
import { useCategoriaNoticia, useValidaCategoria_noticia } from '../../composables/_composables';

// Utils
import { Notif } from '../../utils/_utils';

const emit = defineEmits(["updated"]);
const { categoriaNoti, Crear_CategoriasNoticias } = useCategoriaNoticia();
const { validarFormulario, errors } = useValidaCategoria_noticia();

// Estados locales para el modal
const isLoadingModal = ref(false);
const isLoadingCreate = ref(false);

// Preparar modal cuando se abre
const prepararModal = async () => {
  isLoadingModal.value = true;
  try {
    categoriaNoti.value = { id: 0, nombre: '' };
  } finally {
    isLoadingModal.value = false;
  }
};

const openModal = () => {
  categoriaNoti.value = { id: 0, nombre: '' };
  const modalElement = document.getElementById("categoriaNoticiaModal");
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
};

const handleSubmit = async () => {
  if (!validarFormulario(categoriaNoti.value)) return;
  
  isLoadingCreate.value = true;
  try {
    await Crear_CategoriasNoticias();
    Notif.Success('Categoría creada correctamente');
    emit("updated");
    closeModal();
  } catch (error) {
    console.error("Error al guardar la categoría:", error);
    Notif.Error('Error al guardar la categoría');
  } finally {
    isLoadingCreate.value = false;
  }
};

const closeModal = () => {
  const modalElement = document.getElementById("categoriaNoticiaModal");
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    if (modal) modal.hide();
  }
};

// Escuchar eventos del modal
onMounted(() => {
  const modalElement = document.getElementById("categoriaNoticiaModal");
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
