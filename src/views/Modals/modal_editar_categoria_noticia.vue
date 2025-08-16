<template>
  <div class="modal fade" id="editCategoriaNoticiaModal" tabindex="-1" aria-labelledby="editCategoriaNoticiaModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0">
            <i class="fa fa-edit p-r-15"></i> Editar Categoría de Noticia
          </h5>
          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body py-1">
          <form @submit.prevent="handleSubmit">
            <div class="row g-1">
              <div class="col-md-12">
                <label class="form-label">Nombre Categoría:</label>
                <input
                  v-if="categoriaNoti"
                  type="text"
                  class="form-control"
                  v-model="categoriaNoti.nombre"
                  ref="inputNombre"
                />
                <input
                  v-else
                  type="text"
                  class="form-control"
                  placeholder="Sin datos"
                />
                <ErrorMessage :error="errors && errors.nombre ? errors.nombre : ''" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="handleSubmit">
            Actualizar
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import { ErrorMessage } from '../../components/_components';
import { useCategoriaNoticia } from '../../composables/_composables';

const props = defineProps<{ categoria_Id: number | null }>();
const emit = defineEmits(["updated", "close"]);

const { categoriaNoti, Listar_CategoriasNoticias, Obtener_CategoriasNoticias, Actualizar_CategoriasNoticias, errors } = useCategoriaNoticia();
const isUploading = ref(false);
const inputNombre = ref<HTMLInputElement | null>(null);

// Cargar datos al cambiar el id
watch(() => props.categoria_Id, async (newId) => {
  if (newId) {
    await Obtener_CategoriasNoticias(newId);
    await nextTick();
    if (inputNombre.value) {
      inputNombre.value.focus();
    }
  }
});

const handleSubmit = async () => {
  if (!props.categoria_Id) {
    return;
  }
  const success = await Actualizar_CategoriasNoticias(props.categoria_Id, { ...categoriaNoti.value });
  if (success) {
    emit("updated");
    closeModal();
  }
};

const closeModal = () => {
  const modalElement = document.getElementById("editCategoriaNoticiaModal");
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    if (modal) modal.hide();
  }
  emit('close');
};
</script>

<style scoped>
input, select, textarea {
  background-color: #d7edf738 !important;
}
</style>
