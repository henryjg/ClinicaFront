<template>
    <div class="image-container">
      <!-- Imagen está cargando -->
      <div v-if="isLoading" class="brillo-div">
        <div class="loading"></div>
      </div>
  
      <!-- Imagen cargada -->
      <img 
        v-else 
        :src="imageSrc" 
        alt="Imagen" 
        class="card-img" 
        loading="lazy" 
        @load="onImageLoad" 
        @error="onImageError"
      />
    </div>
  </template>
  
  <script lang="ts">
  import { ref } from 'vue';
  
  export default {
    props: {
      url: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const isLoading = ref(true); // Inicialmente la imagen no está cargada
      const imageSrc = ref(props.url); // La URL de la imagen a cargar
  
      // Imagen por defecto en caso de error
      const defaultImage = '/path/to/default-image.jpg'; // Cambia esto a tu imagen por defecto
  
      // Función que se ejecuta cuando la imagen se ha cargado correctamente
      const onImageLoad = () => {
        console.log('Imagen cargada');  // Puedes verificar en la consola si la imagen cargó correctamente
        isLoading.value = false; // Cuando la imagen se ha cargado, ocultamos el brillo y el spinner
      };
  
      // Función para manejar errores de carga de la imagen
      const onImageError = () => {
        console.error('Error al cargar la imagen');  // Puedes verificar si hubo error
        imageSrc.value = defaultImage; // Cambiar la URL a una imagen por defecto si ocurre un error
        isLoading.value = false; // Ocultamos el brillo y el spinner
      };
  
      return {
        isLoading,
        onImageLoad,
        onImageError,
        imageSrc
      };
    }
  };
  </script>
  
  <style scoped lang="scss">
  .image-container {
    position: relative;
    width: 800px; /* Tamaño proporcional a 800px */
    height: 600px; /* Tamaño proporcional a 600px */
    overflow: hidden;
  }
  
  .brillo-div {
    width: 100%;
    height: 100%;
    background-color: #ebebeb;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* El brillo animado */
  .brillo-div::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(247, 247, 247, 0.8), rgba(145, 145, 145, 0));
    animation: brillo 2s infinite;
  }
  
  /* Animación del brillo */
  @keyframes brillo {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
  
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    margin-top: -25px;
    margin-left: -25px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #c9c8c8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Estilo para la imagen cuando ya ha sido cargada */
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Asegura que la imagen cubra completamente el contenedor */
  }
  </style>
  