<template>
  <Divloading v-if="isloading" class="pt-5"/>
  <div v-else>
    <div class="container pt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 px-5 text-center"> 
          <h2 class="pt-4" v-if="noticia">{{ noticia.titulo }}</h2>

          <!-- ------------------------ -->
          <p class=" text-yellow-800 text-end justify-content-center">
            {{ FormatFecha.fecha_dddd_mmmm_yyyy(noticia.fechaRegistro) }}</p>

          <!-- ------------------------ -->
          <div class="image-container">
            <img class="img-fluid rounded-4 d-block mx-auto w-100" :src="noticia.url_ImagenDestacada" />
          </div>
          <!-- ------------------------ -->

          <h4 class="pt-4" v-if="noticia.subtitulo!==''">{{ noticia.subtitulo }}</h4>
          <!-- ------------------------ -->

          <div v-if="noticia.curpohtml_box1!==''"
              v-html="noticia.curpohtml_box1" class="my-4 text-justify"></div>

          <!-- ------------------------ -->
          <div v-if="noticia.url_Imagen2!==''" class="image-container my-5">
            <img class="img-fluid rounded-4 d-block mx-auto w-100" :src="noticia.url_Imagen2" />
          </div>

          <!-- ------------------------ -->
          <div  v-if="noticia.curpohtml_box2!==''" 
                v-html="noticia.curpohtml_box2" class="my-4 text-justify"></div>

          <!-- ------------------------ -->
          <div v-if="noticia.url_Imagen3!==''"  class="image-container my-5">
            <img class="img-fluid rounded-4 d-block mx-auto w-100" :src="noticia.url_Imagen3" />
          </div>

          <!-- ------------------------ -->
          <div v-if="noticia.url_video!==''" class="my-5">
            <videotubeplayer :videoId="noticia.url_video" class="rounded-4 overflow-hidden" />
          </div>
          <!-- ------------------------ -->

          <div v-if="noticia.seoMetatag!==''"
              v-html="noticia.seoMetatag" class="my-4 text-justify"></div>

          <!-- ------------------------ -->

          <div v-if="noticia.seoDescripcion!==''"
              v-html="noticia.seoDescripcion" class="my-4 text-justify"></div>

          <!-- ------------------------ -->
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import 'nprogress/nprogress.css';
import { GoogleMap, Marker } from 'vue3-google-map';
// Centralized imports
import { Divloading, VideotubePlayer } from '../../components/_components';
import { useNoticias } from '../../composables/_composables';
import { FormatFecha } from '../../utils/_utils';

export default {
  components: {
    GoogleMap,
    Marker,
    Divloading,
    VideotubePlayer
  },
  setup() {
    const route = useRoute(); 
    const idnoticia = Number(route.params.id);
    const titulonoticia = Number(route.params.titulo);

    const { isloading, cargarDatosNoticia,noticia } = useNoticias();

    onMounted(async () => {
     await cargarDatosNoticia(idnoticia);
      
    });

    return {
     
      isloading,idnoticia,titulonoticia,noticia,FormatFecha
     
    };
  },
};
</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  background-color: #f0f0f0;
}

.image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
