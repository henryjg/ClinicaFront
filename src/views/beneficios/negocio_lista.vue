<template>
  <Divloading v-if="isLoading_negocio" class="pt-5"/>
  <Transition>
    <div  v-if="!isLoading_negocio">
  <div class="row pb-3">
    <div class="col-lg-12">
      <div class="container">
        
        <div class="row my-5 ">
          <div class="col-12">
            <h3 class="text-primary pb-1 text-center" data-aos="fade-right">
              Marcas Afiliadas
            </h3>
          </div>
          
          <div class="card shadow-sm col-md-6  col-12 sticky-top justify-content-center m-auto" style="top:73px" >
            <div class="card-body p-2 d-flex align-items-center gap-1">
              <i class="fa fa-search f-18 text-primary p-r-10"></i>
              <input 
                  type="text"  
                  class="form-control py-2" 
                  placeholder="¿Qué estás buscando?" 
                  v-model="searchQuery"
              >
            </div>
          </div>
          
          <Divloading v-if="isLoading_negocio" class="pt-5"/>
          <div class="row g-3" v-else>
            <div
              class="col-md-2 col-4 mb-0 f-20 text-center hvr-float pt-4"
              v-for="(negocio, index) in filteredNegocios"
              :key="negocio.id">
              <card-marca
                    :item="negocio"
                    :linkTo="`/beneficios/negociodetalle/${negocio.id}`" />
            </div>
            <div v-if="filteredNegocios.length === 0" class=" text-center text-muted">
                No se encontraron resultados.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</Transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Centralized imports
import { CardMarca } from '../../components/_components';
import { useNegocios } from '../../composables/_composables';

export default defineComponent({
  components: {
    CardMarca,
  },
  setup() {
    const { listaNegocios, Listar_Negocios,isLoading_negocio } = useNegocios();
    const searchQuery = ref('');

    const filteredNegocios = computed(() => {
      return listaNegocios.value.filter(negocio =>
        negocio.estado === 'Activo' &&
        negocio.razonSocial.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    onMounted(async () => {
      await Listar_Negocios();
      AOS.init({
        easing: 'ease-in-out-sine',
        duration: 300,
      });
    });

    return {
      listaNegocios,
      searchQuery,
      filteredNegocios,
      isLoading_negocio
    };
  },
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
