<template>
  <div class="modal modal-lg fade" id="edit_CategoriaModal" tabindex="-1" aria-labelledby="edit_CategoriaModalLabel"
       aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title py-0" id="edit_CategoriaModalLabel">
            <i class="fa fa-edit p-r-15"></i> Editar Categoría
          </h5>          <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingEdit || isUploadingFile"></button>
        </div>
        <div class="modal-body py-1">
          <!-- Loader mientras se cargan los datos -->
          <div v-if="isLoadingEdit && !nuevaCategoria.id" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando datos de la categoría...</p>
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

              <!-- Imagen actual (si existe) -->
              <div v-if="nuevaCategoria.imagenUrl && !archivoCategoria.ArchivoTemporal.value.url" class="col-md-12">
                <label class="form-label">Imagen actual:</label>
                <div class="mb-2">
                  <img :src="nuevaCategoria.imagenUrl" alt="Imagen actual" class="img-thumbnail" style="max-height: 150px;">
                </div>
              </div>

              <!-- Subida de Imagen -->              
               <FileUploader 
                titulo="Cambiar Imagen de Categoría"
                elementoLoader="loadingfile"
                tipoArchivo="fotografia"
                :archivoTemporal="archivoCategoria.ArchivoTemporal.value"
                :resetTrigger="resetTrigger"
                @archivoSubido="(archivo:Adjunto) => nuevaCategoria.imagenUrl = archivo.url"
                @uploadingStatus="handleUploadStatus"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer py-0">
          <button type="submit" class="btn btn-primary" @click="formActualizarCategoria" :disabled="isLoadingEdit || isUploadingFile">
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { ErrorMessage, FileUploader } from '../../components/_components';
import { useCategorias, useSubirArchivo } from '../../composables/_composables';
import type { Adjunto } from '../../interfaces/_interface';

const props = defineProps<{ categoriaId: number | null }>(); // Recibe el ID de la categoría a editar
const emit = defineEmits(["updated"]);

const { errors, Actualizar_Categorias, nuevaCategoria, Obtener_Categoria } = useCategorias();

// Estados locales para el modal
const isLoadingEdit = ref(false);
const isUploadingFile = ref(false);
const resetTrigger = ref(0);

// USAMOS `useSubirArchivo` PARA LA IMAGEN
const archivoCategoria = useSubirArchivo("loadingfile", "archivopdf");

// Manejar el estado de subida de archivos
const handleUploadStatus = (status: boolean) => {
  isUploadingFile.value = status;
};

// Cargar la categoría cuando el ID cambie
watch(() => props.categoriaId, async (newId) => {
  if (newId) {
    isLoadingEdit.value = true;
    try {
      await Obtener_Categoria(newId);
      resetTrigger.value++; // Reset FileUploader
    } finally {
      isLoadingEdit.value = false;
    }
  }
});

// Función para actualizar la categoría
const formActualizarCategoria = async () => {
  // Usa el ID de props para evitar undefined
  if (!props.categoriaId) return; // Protección extra
  
  isLoadingEdit.value = true;
  try {
    const success = await Actualizar_Categorias(props.categoriaId, nuevaCategoria.value);
    if (success) {
      emit("updated");
      closeModal();
    }
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
  } finally {
    isLoadingEdit.value = false;
  }
};

// Cerrar el modal después de actualizar
const closeModal = () => {
  const modalElement = document.getElementById("edit_CategoriaModal");
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

.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  background-color: #ffffff;
  background: url("../assets/images/default_categoria.avif");
  background-size: cover;
}

.card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
