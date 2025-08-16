<template>
  <div id="SliderHome" class="carousel slide carousel-fade carousel_home" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item"  data-bs-interval="2000">
        <img class="img-fluid d-block" src="../assets/images/banner/p2.avif">
        <img class="img-fluid d-block" src="../assets/images/banner/p3.jpg">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from 'vue';
import { Carousel } from 'bootstrap';

export interface Image {
  nombre: string;
  url: string;
}

export default defineComponent({
  name: 'SliderHome',
  props: {
    images: {
      type: Array as PropType<Image[]>,
      required: true
    }
  },
  setup() {
    onMounted(() => {
      const myCarouselElement = document.querySelector('#SliderHome');
      if (myCarouselElement) {
        // Inicializa el carrusel usando el import directo de Carousel
        new Carousel(myCarouselElement, {
          interval: 2000,
          wrap: true
        });
      }
    });
    // Función para establecer la altura dinámica basada en el tamaño real de la ventana
    const setFullHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Llamamos a la función una vez al montar el componente
    setFullHeight();

    // Escuchamos el evento de redimensionado para recalcular la altura
    window.addEventListener('resize', setFullHeight);
  }
});
</script>

<style lang="scss" scoped>
#SliderHome {
  width: 100%;
}




</style>
