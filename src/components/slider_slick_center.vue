<template>
  <div class="slider-container">
    <div ref="slickSlider" class="slider center">
      <div v-for="(item, index) in items" :key="index" class="slider-item p-2">
        <router-link :to="item.linkRouter">
            <img :src="item.urlimagen" :alt="'Image ' + index" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css'; // Importar los estilos de Slick
import 'slick-carousel/slick/slick-theme.css'; // Importar los estilos del tema de Slick
import { ItemSlider } from '../interfaces/slider.interface';
import imglazy from '../components/Elementos/lazyimg.vue';

// Definir la interfaz para el tipo de datos que se enviarán como items

export default defineComponent({
  components: {
    imglazy
  },
  name: 'SlickSlider',
  props: {
    items: {
      type: Array as PropType<ItemSlider[]>, // Definir los items como un array de tipo Item
      required: true,
    },
  },
  mounted() {
    // Solo inicializar el slider si hay elementos
    if (this.items && this.items.length > 0) {
      const slickElement = this.$refs.slickSlider as HTMLElement;
      $(slickElement).slick({
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 8,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '5px',
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '0px',
              slidesToShow: 3,
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
