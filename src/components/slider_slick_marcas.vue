<template>
  <div>
    <div class="slider-container">
      <div ref="slickSlider" class="slider center">
        <div v-for="(marca, index) in marcas" :key="index" class="slider-item p-2">
          <router-link :to="{ name: 'OfertaDetalle', params: { id: marca.id } }">
            <img class="shadow" :src="marca.urlimagen" :alt="marca.nombre" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default defineComponent({
  name: 'SliderSlickMarcas',
  props: {
    marcas: {
      type: Array as PropType<{ id: string; urlimagen: string; nombre: string }[]>,
      required: true,
    },
  },
  mounted() {
    if (this.marcas && this.marcas.length > 0) {
      const slickElement = this.$refs.slickSlider as HTMLElement;
      $(slickElement).slick({
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 10,
        autoplay: true,
        autoplaySpeed: 2500,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '10px',
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '0px',
              slidesToShow: 4,
            },
          },
        ],
      });
    }
  },
});
</script>

<style scoped>
.slider-container {
  width: 100%;
  margin: 0 auto;
}

.slick-slider {
  width: 100%;
}

.slick-slide img {
  width: 100%;
  height: auto;
}

.slider-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px !important;
}

.slider-item img {
  border-radius: 40px !important;
}
</style>
