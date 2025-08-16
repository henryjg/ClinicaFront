<template>
    <div class="row">
      <div class="col-12 bg-blue-700 align-content-center text-center" style="min-height: 100vh">
            <div class="m-auto align-content-center">
                <Vue3Lottie :animationData="construccion" :height="300" :width="300" />
            </div>
            <h1 class="text-white text-center">PÁGINA EN CONSTRUCCIÓN!</h1>
            <P class="f-18 text-gray-300 text-center">Estamos trabajando para mejorar la experiencia de uso en nuestros aplicativos.</P>
            <div class="m-auto align-content-center pt-5">
                <img src="../../assets/imp-logo-white-238x63.png" class="wid-150  m-auto">
            </div>
      </div>
    </div>
</template>


<script lang="ts">

import { Vue3Lottie } from 'vue3-lottie';
import construccion from '../../assets/lotties/enconstruccion.json';


// Define the interface for the exposed methods of Modal_CambiarPass.vue
interface ModalPasswordInstance {
  openChangePasswordModal: () => void;
}

export default {
  components: {
    Vue3Lottie
  },
  setup() {

    return {
      construccion
    };
  }
};
</script>

<style lang="scss" scoped>

</style>