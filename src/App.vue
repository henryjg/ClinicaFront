
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
// ---------------------------------------------
import { useAuthStore } from './stores/authStore';
import { useTokenRefresh } from './composables/useTokenRefresh';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const tokenRefresh = useTokenRefresh();

onMounted(() => {
  // Verificar sesión al iniciar la aplicación
  authStore.checkSession();
  
  // El sistema de renovación automática se inicia automáticamente con useTokenRefresh
  // console.log('🚀 App iniciada con sistema de renovación automática de tokens');
});
// ---------------------------------------------
</script>


<style scoped>

</style>
