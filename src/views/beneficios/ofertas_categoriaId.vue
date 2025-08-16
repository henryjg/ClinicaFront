<template>
  
  <div class="row pb-3">
    <div class="col-lg-12">
      <div class="container">
        <div class="row my-5">          <!-- ---------------- -->
          <div class="col-md-3 text-center">
            <ImgLazy v-if="categoria.imagenUrl && categoria.imagenUrl !== ''"
                     class="w-75 rounded-5 m-auto justify-content-center rounded-3"
                              :src="categoria.imagenUrl" aspectRatio="1 / 1" ></ImgLazy>              <div class="alert b-gray d-flex flex-column mt-4">
                  <h4 class="text-gray-600">Categorías</h4>
                  <template v-for="(categoria,index) in listaCategorias" :key="categoria.id">
                      <div class="btn hvr-forward btn-link-hover-primary text-start"
                          @click="recargar_dato_de_categoria(categoria.id)">
                          <i class="ph-duotone ph-caret-circle-right p-r-5"></i>{{ categoria.nombre }}
                      </div>
                  </template>
              </div>
          </div>          <div class="col-md-9">
              <h4 class="text-gray-600">Ofertas:</h4>
              <div class="row">
                <Divloading v-if="isloading_ofertas" class="pt-5"/>
                <div v-else
                    class="col-md-4 f-20 text-center"
                    v-for="(oferta, index) in ofertasFiltradas"
                    :key="oferta.id"                >
                  <CardOferta
                      :item="oferta"
                      :linkTo="`/beneficios/ofertadetalle/${oferta.id}`"
                      subtitulo="Nuevo lanzamiento"
                  />
                </div>
                <div v-if="ofertasFiltradas.length === 0" class="text-center w-100 mt-3">
                    <p>No se encontraron ofertas.</p>
                </div>
              </div>
          </div>
          <!-- ------------------- -->
        </div>
      </div>
    </div>
  </div>

  
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Centralized imports
import { CardOferta, Divloading, ImgLazy } from '../../components/_components';
import { useOfertas, useCategorias } from '../../composables/_composables';


export default defineComponent({
  components: {
    CardOferta,
    Divloading,
    ImgLazy
  },

  setup() {
    const route = useRoute();
    const { isloading_ofertas, listaOfertas, Listar_Ofertas_porCategoria } = useOfertas();
    const { listaCategorias, categoria, Obtener_Categoria, Listar_Categorias } = useCategorias();

    const busqueda = ref('');

    onMounted(async () => {
      const idCategoria = Number(route.params.id);
      await Obtener_Categoria(idCategoria);
      await Listar_Ofertas_porCategoria(idCategoria);
      await Listar_Categorias();
    });

    const ofertasFiltradas = computed(() => {
        const termino = busqueda.value.toLowerCase().trim();
        
        return listaOfertas.value.filter(oferta => 
          oferta.nombreOferta.toLowerCase().includes(termino) || 
          oferta.tipoOferta.toLowerCase().includes(termino) 
        );
    });

    const recargar_dato_de_categoria = async (idCategoria: number) => {
      await Listar_Ofertas_porCategoria(idCategoria);
      await Obtener_Categoria(idCategoria)
    }
    return {
      listaOfertas,
      CardOferta,
      busqueda,
      ofertasFiltradas,
      isloading_ofertas,
      categoria,listaCategorias,
      Listar_Ofertas_porCategoria,
      recargar_dato_de_categoria
    };
  },
  mounted() {
    AOS.init({
      easing: 'ease-in-out-sine',
      duration: 700
    });
  }
});
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.top150 {
  margin-top: 35vh;
}

.top10vh {
  margin-top: 10vh;
}


.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Ocupa toda la altura de la pantalla */
  text-align: center;
  flex-direction: column; /* Asegura que los elementos estén en columna */
}

.pad_pant {
  margin-top: 0; /* Asegúrate de que no haya margen superior que desplace el contenido */
}

@media (max-width: 768px) {
  .center-content {
    height: 100vh; /* También ocupa toda la pantalla en dispositivos móviles */
  }
}

</style>
