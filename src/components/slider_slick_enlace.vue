<template>
  <div class="slider-container">
    <div ref="slickSlider" class="slider center">
      <div v-for="(item, index) in items" :key="index" class="slider-item p-2">
        <slot :item="item">
          
        </slot>
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
import { ItemSlider } from '../interfaces/slider.interface';

export default defineComponent({
  name: 'SlickEnlace',
  props: {
    items: {
      type: Array as PropType<ItemSlider[]>,
      required: true,
    },
  },

  mounted() {
    const slickElement = this.$refs.slickSlider as HTMLElement;
    $(slickElement).slick({
      centerMode: true,
      centerPadding: '0px',
      slidesToShow: 4,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '5px',
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '0px',
            slidesToShow: 1,
          },
        },
      ],
    });
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
  width: 100% !important;
}

.slider-item > * {
  width: 100%;
}
</style>

 