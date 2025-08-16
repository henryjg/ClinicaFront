<template>
  <div class="image-container" :style="{ aspectRatio: aspectRatio }">
    <!-- Imagen con lazyload -->
    <img
      :src="src"
      alt="Image"
      class="div-img"
      loading="lazy"
      @load="onImageLoad"
      :class="{'loaded': !loading}"  
    />
    <!-- Indicador de carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

export default defineComponent({
  name: 'LazyImage',
  props: {
    src: {
      type: String as PropType<string>,
      required: true,
    },
    aspectRatio: {
      type: String,
      default: '16 / 9', // Valor predeterminado si no se pasa uno
    },
  },
  setup(props) {
    const loading = ref(true);

    const onImageLoad = () => {
      loading.value = false;
    };

    return {
      loading,
      onImageLoad,
      aspectRatio: props.aspectRatio, // Se toma el valor pasado como prop
    };
  },
});
</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.div-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.div-img.loaded {
  opacity: 1;
}

/* Cubrir toda el área con el div de carga */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Cubrir toda la imagen */
  background-color: rgba(185, 205, 220, 0.3); /* Fondo gris */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease-out; /* Transición para desaparecer */
  z-index: 1; /* Asegura que el overlay esté sobre la imagen */
}

.loading {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #bbbec0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
