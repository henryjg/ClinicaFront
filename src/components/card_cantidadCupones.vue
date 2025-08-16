<template>
  <div class="col-md-6 col-xxl-3 col-lg-3 mt-2">
    <div class="card statistics-card-1 mb-1">
      <div class="card-body p-3">
        <div class="d-flex align-items-center">
          <div class="avtar bg-brand-color-3 text-white me-3">
            <i :class="icono" class="f-26"></i>
          </div>
          <div>
            <p class="text-muted mb-0">{{ titulo }}</p>
            <div class="d-flex align-items-end">
              <h2 class="mb-0 f-w-500">{{ cantidad }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  titulo: string;
  cantidad: number;
  icono: string;
}>();
</script>

<style scoped>

</style>