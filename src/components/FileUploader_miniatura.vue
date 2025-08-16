<template>
  <div class="col-md-12">
    <label class="form-label">{{ titulo }}:</label>
    <div :id="elementoLoader" style="position: relative; height: 4px;"></div>
  
    <!-- Indicador de carga -->
    

    <!-- Si no hay archivo cargado -->
    <div v-if="!ArchivoTemporal.url && !isUploading" class="file-input-wrapper b-gray rounded-1 py-2 bg-gray-100 text-center w-100">
      <input type="file" @change="handleFileSelected" @dragover.prevent @drop.prevent="handleDrop" :accept="determineAcceptType()" class="file-input">
      <div class="p-1">
        <i class="ph-duotone ph-file f-30"></i>
        <div v-if="fileDocumento" class="uploaded-files">
          <p>{{ fileDocumento.name }}</p>
        </div>
        <p v-else class="f-14 f-w-600">Arrastre o seleccione un archivo</p>
      </div>
    </div>

    <!-- Si ya hay un archivo cargado -->
    <div v-else class="px-3 alert alert-secondary mt-1 mb-1">
      <div class="d-flex  mb-2">
        <div class="w-100 align-content-center">
          <div v-if="isUploading" class="text-primary f-14">Subiendo archivo...</div>
          <a v-else :href="ArchivoTemporal.url" class="text-secondary f-w-500 f-13" target="_blank">
            <i class="fa fa-chevron-right"></i> {{ ArchivoTemporal.nombrefile }}
          </a>
        </div>
        <div class="flex-shrink-1">
          <button class="btn f-4 btn-outline-danger btn-sm py-1" @click="removeArchivo">
            <i class="fa fa-trash" style="font-size:12px"></i>
          </button>
        </div>
        
      </div>
      <div v-if="ArchivoTemporal.url!==''" class="image-container mt-0 pt-0">
            <img class="img-fluid rounded-4 d-block mx-auto w-100" :src="ArchivoTemporal.url" />
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSubirArchivo } from "../composables/useSubirArchivo";
import { Adjunto } from "../interfaces/_interface";

const props = defineProps<{
  titulo: string;
  elementoLoader: string;
  tipoArchivo: "archivopdf" | "fotografia";
  archivoTemporal: Adjunto;
}>();

const emit = defineEmits(["archivoSubido", "uploadingStatus"]);

const isUploading = ref(false); // Estado para saber si se está subiendo un archivo

const {ArchivoTemporal, fileDocumento, onFileSelected, handleDropFile, subirArchivo, reset_formUpload } = useSubirArchivo(props.elementoLoader, props.tipoArchivo);

const determineAcceptType = () => {
  return props.tipoArchivo === "archivopdf" ? ".pdf" : "image/*";
};

// Manejar la selección del archivo y subirlo
const handleFileSelected = async (event: Event) => {
  onFileSelected(event);
  isUploading.value = true;  // Indica que está subiendo
  emit("uploadingStatus", true);

  const archivoSubido = await subirArchivo();
  
  if (archivoSubido && archivoSubido.value) {
    emit("archivoSubido", archivoSubido.value);
  }

  isUploading.value = false; // Indica que la subida terminó
  emit("uploadingStatus", false);
};

// Manejar el arrastre del archivo y subirlo
const handleDrop = async (event: DragEvent) => {
  handleDropFile(event);
  isUploading.value = true;
  emit("uploadingStatus", true);

  const archivoSubido = await subirArchivo();
  
  if (archivoSubido && archivoSubido.value) {
    // archivo.value = archivoSubido.value;
    emit("archivoSubido", archivoSubido.value);
  }

  isUploading.value = false;
  emit("uploadingStatus", false);
};

// Eliminar archivo
const removeArchivo = () => {
  // archivo.value = initialize_Adjunto();
  reset_formUpload();
  // emit("archivoSubido", archivo.value);
};

</script>
