<template>
  <Divloading v-if="isloading" class="pt-5"/>
  <Transition>
    <div  v-if="!isloading">
    <!-- -------------------------------------------------------------------------- -->
    <div class="container pt-5">
      <div class="row">
        <div class="col-md-3">
            <!-- Categorías -->
            <div class="b-gray rounded-3 px-3 py-2 mb-3 d-none d-sm-block">
              <h5 class="text-blue-600">Categorías</h5>
              
              <div v-for="categoria in listaCategoriaNoti" :key="categoria.id">
                <a href="#" @click.prevent="filtrarPorCategoria(categoria.id)">{{ categoria.nombre }}</a>
              </div>
              
            </div>
            <!-- Los Más Leidos -->
            <div class="b-gray rounded-3 px-3 py-2 d-none d-sm-block">
              <h5 class="text-blue-600">Ultimas Noticias</h5>
              <div>
                <div v-for="noticia in listaNoticias.slice(0, 5)" :key="noticia.id" class="noticia-item">
                  <a :href="`/beneficios/novedades/${noticia.id}/${CleanLink.LinkUrl(noticia.titulo)}`" class="d-flex align-items-center">
                    <!-- <imglazy v-if="noticia.url_ImagenDestacada && noticia.url_ImagenDestacada !== ''" class="img-thumbnail noticia-imagen"
                            :src="noticia.url_ImagenDestacada" aspectRatio="1 / 1" ></imglazy> -->
                    
                    <img :src="noticia.url_ImagenDestacada" alt="Imagen de la noticia" class="img-thumbnail noticia-imagen">
                        {{ noticia.titulo.length > 50 ? noticia.titulo.substring(0, 50) + '...' : noticia.titulo }}
                  </a>
                </div>
              </div>
            </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            
              <h3 class="text-primary">Principales Novedades</h3>
              <div 
                class="col-md-6 col-xs-12 col-sm-6 f-20 text-center " 
                v-for="(noticia, index) in listaNoticias" 
                :key="noticia.id"
              >
                <CardNoticia
                  :noticia = "noticia"
                  :linkTo="`/beneficios/novedades/${noticia.id}/${CleanLink.LinkUrl(noticia.titulo)}`"
                />
              </div>
          </div>
        </div>    
      </div>
    </div>
  </div>
</Transition>
</template>

<script lang="ts">
import { onMounted, ref, computed } from 'vue';
import 'nprogress/nprogress.css';
import { GoogleMap, Marker } from 'vue3-google-map';

// Centralized imports
import { Divloading, CardNoticia, ImgLazy } from '../../components/_components';
import { useNoticias, useCategoriaNoticia } from '../../composables/_composables';
import { CleanLink } from '../../utils/_utils';

export default {
  components: {
    GoogleMap,
    Marker,
    Divloading,
    CardNoticia,
    ImgLazy,
  },
  setup() {
    const { listaNoticias, cargar_listaNoticias } = useNoticias();
    const { listaCategoriaNoti, Listar_CategoriasNoticias } = useCategoriaNoticia();
 
    const isloading = ref(false);
    const categoriaSeleccionada = ref<number | null>(null);
    const mostrarCategorias = ref(false);
    const mostrarMasLeidos = ref(false);

    const noticiasFiltradas = computed(() => {
     
      return listaNoticias.value;
    });

    const filtrarPorCategoria = (categoriaId: number) => {
      categoriaSeleccionada.value = categoriaId;
    };

    const toggleCategorias = () => {
      mostrarCategorias.value = !mostrarCategorias.value;
    };

    const toggleMasLeidos = () => {
      mostrarMasLeidos.value = !mostrarMasLeidos.value;
    };

    onMounted(async () => {
      isloading.value = true;
      await cargar_listaNoticias();
      await Listar_CategoriasNoticias();
      isloading.value = false;
    });

    return {
      listaNoticias,
      isloading,
      CleanLink,
      listaCategoriaNoti,
      noticiasFiltradas,
      filtrarPorCategoria,
      mostrarCategorias,
      mostrarMasLeidos,
      toggleCategorias,
      toggleMasLeidos
    };
  },
};
</script>

<style lang="scss" scoped>

.noticia-item {
  margin-bottom: 10px;
}

.noticia-imagen {
  width: 50px !important;
  height: 50px !important;
  margin-right: 10px;
}
</style>
