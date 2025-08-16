<template>
  <div class="row bg-blue-800" style="min-height: calc(100vh - 124px)">
<!-- ----------------------------------------------------------------------------------------------------------------------------------------------------- -->
   
<!-- ---------------------------------------------------------------------------------------------------------------------------------------------------------- -->
    <div class="col-md-12 d-none d-sm-block px-0">
      <!-- <carousel  :images="images"/> -->
      <div class="overflow-hidden d-flex align-items-center justify-content-center custom-div">
        <img src="/src/assets/images/banner/p2.avif" class="img-centered">
      </div>
    </div>
  </div>

  <!-- Modal para cambiar contraseña -->
  <ModalPassword  ref="changePasswordModal"/> 
</template>


<script lang="ts">
import { onMounted, ref } from 'vue';

// Centralized imports
import { Vue3Lottie, carousel } from '../../components/_components';

const isDarkTheme = ref(false);
import ModalPassword from '../Modals/modal_CambiarPass.vue';

export default {
  components: {
    Vue3Lottie,
    carousel,
    ModalPassword
  },
  setup() {
    const images = [
        { nombre: 'Banner 1', url: new URL('@/assets/images/banner/b1.avif', import.meta.url).href },
        { nombre: 'Banner 2', url: new URL('@/assets/images/banner/b2.avif', import.meta.url).href }
      ];

    let userId = ref<string | null>(null);

    onMounted(() => {
      isDarkTheme.value = checkIfDarkTheme();
    });

    const checkIfDarkTheme = () => {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    return {
      images
    };
  }
};
</script>

<style lang="scss" scoped>

/* El contenedor debe ocupar espacio y ocultar cualquier contenido que se desborde */
.custom-div {
  width: 100%;  
  height: calc(100vh - 124px); 
  display: flex;  
  justify-content: center; 
  align-items: center; 
  overflow: hidden;  
  background-color: #000;  
}

/* La imagen se ajustará dinámicamente */
.img-centered {
  width: 100%;  
  height: auto;
  min-height: 100%; 
  object-fit: cover; 
}

/* Opcional: asegúrate de que el body no tenga desplazamiento no deseado */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

</style>