<template>
  <PlantillaAdmin>
        <!-- [ Main Content ] start -->
        <RouterView></RouterView>
        <!-- [ Main Content ] end -->
        
        <!-- Panel de Debug de Autenticación (solo en desarrollo) -->
        <!-- <AuthDebugPanel v-if="isDev" /> -->
  </PlantillaAdmin>
</template>


<script lang="ts" >
  import { onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import PlantillaAdmin from "../layout/dashboard_layout.vue";
  import { AuthDebugPanel } from "../components/_components";
  
  export default {
    components: {
      PlantillaAdmin,
      AuthDebugPanel
    },
    setup() {
      const route = useRoute();
      const isDev = true; // Temporalmente activado para debug
      
      onMounted(() => {
        document.body.classList.remove('landing-page');
      });
      
      return {
        isDev
      };
    }
  };
</script>

