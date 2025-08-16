<template>
  <router-link :to="linkTo">
    <!-- NORMAL --------------- -----------------------------------  -->
    <div class="card border-0 product-card hvr-float d-none d-md-block">
      <div class="card-img-top p-0 ">
        <div class="image-container position-relative">
          <span v-if="descuento" class="badge  badge_nor bg-red-400  position-absolute top-0 start-0 m-2 px-2 py-1">
            <template v-if="isDescuentoNumerico">
              {{ descuento }}% <span class="text-md">Dscto</span>
            </template>
            <template v-else>
              {{ descuento }}
            </template>
          </span>
          <imglazy class="img-fluid d-block w-100 border_top_radios" v-if="item.imagenUrl && item.imagenUrl !== ''"
                            :src="item.imagenUrl" aspectRatio="5 / 3" ></imglazy>
          <img v-else class="img-fluid d-block w-100" src="../assets/img_card_default.avif" />
        </div>
      </div>
      <div class="card-body px-3 pb-0 pt-2 text-center " style="min-height: 10px;">
    
        <h6 class="text-dark mb-1" style="min-height: 33px;">{{ item.nombreOferta }}</h6>
        <p class="mt-0 mb-2 text-md ">(Válido hasta el {{ FormatFecha.fecha_dd_mm_yyyy(item.fechaFin) }})</p>
        <div class="d-flex justify-content-between align-items-center mt-1 mb-3 ">
          <router-link :to="linkTo" class="m-auto">
            <button class="btn btn-link-secondary btn-prod-card b-warning mb-3
             ">
               Mostrar Cupón
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <!-- RESPONSIVE --------------- -----------------------------------  -->
    <div class="mb-3 card shadow border-0 d-block d-md-none">
      <div class="row g-1 ">
        <div class="col-5 m-0 p-0">
            <imglazy class="img-fluid d-block w-100  border_left_radios "
                     v-if="item.imagenUrl && item.imagenUrl !== ''"
                            :src="item.imagenUrl" aspectRatio="7 / 6" ></imglazy>
            <img v-else class="img-fluid d-block w-100" src="../assets/img_card_default.avif" />
        </div>
        <div class="col-7 py-3 px-3 text-start" style="min-height: 10px;">
            <span v-if="descuento" class="badge badge_res bg-red-300 mb-2 px-2 start-0 py-1 position-relative">
              <template v-if="isDescuentoNumerico">
                {{ descuento }}% <span class="text-md">Dscto</span>
              </template>
              <template v-else>
                {{ descuento }}
              </template>
            </span>
            <h6 class="mb-1" style="min-height: 33px;">{{ item.negocio_nombrecom }}</h6>
            <h6 class="text-gray-600 mb-1  f-w-500" style="min-height: 33px;">{{ item.nombreOferta }}</h6>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { Oferta } from '../interfaces/citas.interface';
import { FormatFecha } from '../utils/FormatFecha';
import { useAuthStore } from '../stores/authStore';
import imglazy from '../components/Elementos/lazyimg.vue';

export default defineComponent({
  components: {
    imglazy
  },
  name: 'CardProduct',
  props: {
    item: {
      type: Object as PropType<Oferta>,
      required: true,
    },
    linkTo: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const authStore = useAuthStore();
    const usuarioLogueado = computed(() => authStore.usuarioLogueado);

    const descuento = computed(() => {
      if (usuarioLogueado.value?.idrol === 2) {
        return props.item.valordscto_trabajador;
      }
      return props.item.valordscto_cliente;
    });

    // Determina si el descuento es numérico (porcentaje)
    const isDescuentoNumerico = computed(() => {
      const val = descuento.value;
      if (val == null) return false;
      // Considera numérico si es un número o un string numérico
      return /^\d+(\.\d+)?$/.test(String(val).trim());
    });

    return {
      FormatFecha,
      descuento,
      isDescuentoNumerico,
    };
  },
});
</script>

<style lang="scss" scoped>
.badge_nor {
  font-size: 1.2rem;
  z-index: 10;
}

.badge_res {
  font-size: 1.1rem;
  z-index: 10;
}

.border_top_radios {
  border-start-start-radius: 8px !important;
  border-start-end-radius: 8px !important;
}

.border_left_radios {
  border-start-start-radius: 8px !important;
  border-start-end-radius: 0px !important;
  border-end-start-radius: 8px !important;
  border-end-end-radius: 0px !important;
}


</style>