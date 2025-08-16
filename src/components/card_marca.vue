<template>
  <router-link :to="linkTo">
    <imglazy v-if="item.logoUrl && item.logoUrl !== ''" class=" rounded-4 shadow-sm"
                            :src="item.logoUrl" aspectRatio="4 / 4" ></imglazy>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Negocio } from '../interfaces/negocio.interface';
import imglazy from '../components/Elementos/lazyimg.vue';


export default defineComponent({
  components: {
    imglazy
  },
  name: 'CardMarca',
  props: {
    item: {
      type: Object as PropType<Negocio>,
      required: true,
    },
    linkTo: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>

// .boxoperacion {
//   position: absolute;
//   z-index: 999;
//   background-color: rgb(255, 48, 48);
//   text-transform: capitalize !important;
//   color: rgb(255, 255, 255);
//   padding: 5px 15px;
//   width: 35%;
//   text-align: center;
//   font-size: 18px;
//   border-radius: 0 0 12px 0;
//   box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
// }
</style>
