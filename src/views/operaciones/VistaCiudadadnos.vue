<template>
  <PlantillaAdmin>
        <!-- [ Main Content ] start -->
        <RouterView></RouterView>
        <!-- [ Main Content ] end -->
  </PlantillaAdmin>
</template>


<script lang="ts" >
  import { onMounted} from 'vue';
  import { useRoute } from 'vue-router';
  import PlantillaAdmin from "../../layout/dashboard_layout.vue"
  
  export default {
    components: {
      PlantillaAdmin
    },
    setup() {
      const route = useRoute();
      // const images = [
      //     { nombre: 'Banner 1', url: '/src/assets/banner1.jpg' },
      //     { nombre: 'Banner 2', url: '/src/assets/banner2.jpg' }
      //   ];

      // Verificar la ruta para determinar si se debe mostrar el carousel
      onMounted(() => {
        document.body.classList.remove('landing-page');
      });
      return {
        // showCarousel,images
      };
    }
  };
</script>

