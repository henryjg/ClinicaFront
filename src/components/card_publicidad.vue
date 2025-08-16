<template>
  <a :href="item.link" target="_blank">
    <div class="card border-0 product-card shadow mx-2">
      <div class="card-img-top p-0">
        <div class="image-container position-relative">
          <imglazy  class="img-fluid d-block w-100 rounded-3" v-if="item.urlFoto && item.urlFoto !== ''"
                            :src="item.urlFoto" aspectRatio="5 / 3" ></imglazy>
          <img v-else class="img-fluid d-block w-100" src="../assets/img_card_default.avif" />
        </div>
      </div>
      <div class="card-body">
        <P class="card-title pb-0">{{ item.nombreProyecto }}</P>
        <p class="card-text fw-bold" :class="estadoClass">
          <div  v-if="item.estado==='Proyecto Entregado'"
                  class="badge bg-light-warning f-13"><i class="bi bi-info-circle"></i> {{ item.estado }}</div>
          <div  v-else
                  class="badge bg-light-danger text-purple-900 f-13"><i class="bi bi-info-circle"></i> {{ item.estado }}</div>
        </p>
        <p class="card-text d-flex align-items-center border-bottom border-1">
          <i class="fas fa-map-marker-alt text-gray-500 me-2"></i> {{ item.ubicacionProyecto }}
        </p>
        <p class="card-text d-flex align-items-center border-bottom border-1">
          <i class="fas fa-money-bill-wave-alt text-gray-500 me-2"></i> {{ item.cuotas }}
        </p>
        <p class="card-text d-flex align-items-center border-bottom border-1">
          <i class="fas fa-expand-arrows-alt text-gray-500 me-2"></i> {{ item.area }}
        </p>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { Publicidad } from '../interfaces/historia.interface';
import imglazy from '../components/Elementos/lazyimg.vue';

export default defineComponent({
  components: {
    imglazy    
  },
  name: 'CardPublicidad',
  props: {
    item: {
      type: Object as PropType<Publicidad>,
      required: true,
    },
  },
  setup(props) {
    const estadoClass = computed(() => {
      return props.item.estado === 'Lotes Disponibles' ? 'text-success' : 'text-danger';
    });

    return {
      estadoClass,
    };
  },
});
</script>

<style lang="scss" scoped>

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1.21rem;
  font-weight: bold;
}

.card-text {
  margin-bottom: 0.5rem;
}

.text-primary {
  color: #007bff;
}
</style>