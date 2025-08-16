<template>
  <div id="carouselFotosNegocio" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="(foto, index) in fotos" :key="foto.id" :class="['carousel-item', { active: index === 0 }]">
        <imglazy v-if="foto.url && foto.url !== ''"
                     class="d-block w-100 rounded-3"
                              :src="foto.url" aspectRatio="5 / 3" ></imglazy>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselFotosNegocio" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselFotosNegocio" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import imglazy from '../components/Elementos/lazyimg.vue';

export default defineComponent({
  components: {
    imglazy
  },
  props: {
    fotos: {
      type: Array as PropType<{ id: number, url: string }[]>,
      required: true
    }
  }
});
</script>

<style scoped>
.carousel-item img {
  object-fit: cover;
  height: 300px;
}
</style>
