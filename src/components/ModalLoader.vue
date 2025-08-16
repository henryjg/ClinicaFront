<template>
  <div class="modal-loader-overlay" v-if="loading">
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">{{ message || 'Cargando...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
  message?: string;
}

defineProps<Props>();
</script>

<style scoped>
.modal-loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  border-radius: 0.375rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
