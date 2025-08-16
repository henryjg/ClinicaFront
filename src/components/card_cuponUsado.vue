<!-- filepath: d:\vue_proyectos\nuevo\impBeneficios\src\components\card_cuponUsado.vue -->
<template>
  <div class="card border-0 product-card">
    <div class="card-img-top p-0">
      <div class="image-container position-relative mt-3">
        <!-- Badge de descuento -->
        <img v-if="currentCupon.negocioLogoUrl" class="img-fluid" :src="currentCupon.negocioLogoUrl" />
        <img v-else class="img-fluid" src="../assets/img_card_default.avif" />
      </div>
    </div>
    <hr class="border_lineaspunteadas">
    <div class="card-body px-3 pb-0 pt-2 m-auto text-center" style="min-height: 170px;">
      <span v-if="descuento" class="badge bg-red-300 top-0 py-1 mb-3">
        {{ descuento }}% dscto
      </span>
      <h6 class="text-dark mb-1 text-uppercase text-sm" style="min-height: 50px;">{{ currentCupon.ofertaNombre }}</h6>
      <h6 class="mb-1 text-primary" style="min-height: 30px;">{{ currentCupon.negocioNombre }}</h6>
      <p class="mt-0 mb-2 text-gray-500 text-sm">(Utilizado el {{ FormatFecha.fecha_dd_mm_yyyy(currentCupon.fechaFin) }})</p>
      <div class="d-flex justify-content-between align-currentCupons-center mt-1 mb-3" style="justify-content: center !important;">
        <button class="btn btn-success" @click="$emit('openModal', currentCupon)">Calificar</button>
      </div>
    </div>
    <div class="card-footer bgdegradado text-center text-white">
      <i class="fa fa-check-circle text-success h6"></i> {{ currentCupon.estado }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { Cupones } from '../interfaces/paciente.interface';
import { FormatFecha } from '../utils/FormatFecha';
import { useAuthStore } from '../stores/authStore';

export default defineComponent({
  name: 'CardCupon',
  props: {
    currentCupon: {
      type: Object as PropType<Cupones>,
      required: true,
    },
  },
  setup(props) {
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);

    const descuento = computed(() => {
      if (Usuario.value?.idrol === 2) {
        return props.currentCupon.valordsctoTrabajador;
      }
      return props.currentCupon.valordsctoCliente;
    });

    return {
      FormatFecha,
      descuento,
    };
  },
});
</script>

<style lang="scss" scoped>
.badge {
  font-size: 1.08rem;
  z-index: 10;
}

.image-container {
  margin: auto;
  background-color: azure;
  width: 110px;
  height: 110px;
  border-radius: 250px;
  overflow: hidden;
  justify-content: center;
}

.image-container img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.border_lineaspunteadas {
  border-style: dotted;
  border-top: 2px sienna dashed;
  width: 50%;
  margin: auto;
  margin-top: 10px;
}

.bgdegradado {
  background: rgb(0, 36, 91);
  background: linear-gradient(90deg, rgba(0, 36, 91, 1) 0%, rgba(12, 71, 124, 1) 76%, rgba(47, 112, 185, 1) 100%);
}
</style>