<template>
  <div :id="carouselId" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div
        v-for="(slider, index) in sliders"
        :key="index"
        class="carousel-item"
        :class="{ active: index === 0 }"
        data-bs-interval="4000"
      >
          <imglazy v-if="slider.urlFoto && slider.urlFoto !== ''" class="rounded-3"
                            :src="slider.urlFoto" aspectRatio="16 / 5" ></imglazy>
          <div class="carousel-caption d-none d-md-block">
        </div>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      :data-bs-target="'#' + carouselId"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      :data-bs-target="'#' + carouselId"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Slider } from '../interfaces/slider.interface';
import imglazy from '../components/Elementos/lazyimg.vue';

export default defineComponent({
  components: {
    imglazy
  },
  name: 'CarouselSliders',
  props: {
    sliders: {
      type: Array as () => Slider[],
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const carouselId = props.id;
    const sliders = ref<Slider[]>(props.sliders);

    onMounted(() => {
      initializeCarousel();
    });

    watch(() => props.sliders, (newSliders) => {
      sliders.value = newSliders;
      initializeCarousel();
    });

    const initializeCarousel = () => {
      const myCarouselElement = document.querySelector(`#${carouselId}`);
      if (myCarouselElement && window.bootstrap) {
        new window.bootstrap.Carousel(myCarouselElement, {
          interval: 2000,
          wrap: true
        });
      }
    };

    return {
      sliders,
      carouselId
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
