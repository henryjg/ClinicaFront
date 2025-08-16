<template>
  <router-link :to="linkTo">
    <div class="shadow-none p-2 rounded-0">
      <imglazy v-if="noticia.url_ImagenDestacada && noticia.url_ImagenDestacada !== ''" class="noticia-imagen rounded-3"
                            :src="noticia.url_ImagenDestacada" aspectRatio="16 / 7" ></imglazy>
      <div class="card-body py-2 px-3  text-start rounded-0">
        <h6 class="card-title text-blue-800 mt-0">{{ noticia.titulo }}</h6>
        <p class=" text-yellow-800 text-end justify-content-center">
          {{ FormatFecha.fecha_dddd_mmmm_yyyy(noticia.fechaRegistro) }}</p>
      </div>
    </div>
  </router-link>
</template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Noticias } from '../interfaces/noticias.interface';
  import { FormatFecha } from '../utils/FormatFecha';
  import imglazy from '../components/Elementos/lazyimg.vue';

  
  export default defineComponent({
    components: {
      imglazy
    },
    name: 'CardMarca',
      props: {
        noticia: {
          type: Object as PropType<Noticias>,
          required: true,
        },
        linkTo: {
          type: String,
          required: true,
        },
      },
      setup() {
        return {
          FormatFecha
        }
      }
  });
  
  </script>
  
  <style scoped>
  .card {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
  }
  .card:hover {
    transform: scale(1.03);
  }
  .card-img-top {
    height: 220px;
    object-fit: cover;
  }
  </style>
  