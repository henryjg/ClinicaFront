<template>
  <div class="row">
    <div class="col-12">
      <div class="card table-card ">
        <div class="card-header py-0 card_default_bg" :class="clasehead">
          <div class="row align-items-center">
            <!-- Título dinámico pasado como prop -->
            <div class="d-flex ">
              <p :class="clase" class="f-w-500 p-r-30 py-0 my-0 f-16 align-content-center">
                  <i class="ph-duotone ph-grid-nine "></i>
                  {{ title }}
              </p>
              <div class="flex-grow-1 py-0">
                  <slot name="buttons"></slot>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cuerpo de la tarjeta con el contenido pasado a través de slot -->
        <div class="card-body  ">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardLayout',
  props: {
    title: {
      type: String,
      required: true,
    },
    clase: {
      type: String,
      required: true,
    },
    clasehead: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.text-primary {
  color: #007bff !important;
}

.text-end {
  text-align: end;
}
</style>
