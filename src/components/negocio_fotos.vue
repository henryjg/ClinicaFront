<template>
  <div>
    <div class="row g-2" v-if="fotos.length >= 5">
      <div class="col-md-6">
        <!-- PRINCIPAL --------------------------------------- -->
        <a class="img-post card mb-2" @click.prevent="showImage(DOC_URL + fotos[0].url)">
          <div class="image-container">
            <img :src="DOC_URL + fotos[0].url" alt="img" loading="lazy" class="card-img" @load="onImageLoad($event)">
            <div class="loading"></div>
          </div>
          <div class="card-img-overlay">
            <i class="ti ti-search"></i>
          </div>
        </a>
      </div>
      <div class="col-md-6">
        <!-- SECUNDARIAS---------------------------------------- -->
        <div class="row g-2 mb-2">
          <div class="col-md-6 col-xs-4" v-for="(photo, index) in fotos.slice(1, 5)" :key="index">
            <a class="img-post card" @click.prevent="showImage(DOC_URL + photo.url)">
              <div class="image-container">
                <img :src="DOC_URL + photo.url" alt="img" loading="lazy" class="card-img" @load="onImageLoad($event)">
                <div class="loading"></div>
              </div>
              <div class="card-img-overlay">
                <i class="ti ti-search"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-md-12">
      <div class="alert alert-warning" role="alert">
        No hay suficientes imágenes cargadas.
      </div>
    </div>

    <!-- Modal ---------------------------------------- -->
    <div class="modal fade modal-lightbox post-modal-lightbox" id="lightboxModal_foto" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered rounded-2">
        <div class="modal-content rounded-3">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          <div class="modal-body">
            <img :src="currentImage" alt="images" class="modal-image rounded-3  w-100 img-fluid">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Foto } from '../interfaces/_interface';
import { DOC_URL } from '../config';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'FotosInmueble',
  props: {
    fotos: {
      type: Array as PropType<Foto[]>,
      required: true
    }
  },
  setup(props) {
    const currentImage = ref('');
    const onImageLoad = (event: Event) => {
      const target = event.target as HTMLImageElement;
      const loading = target.nextElementSibling as HTMLElement;
      if (loading) {
        loading.style.display = 'none';
      }
      target.style.opacity = '1';
    };

    const showImage = (imageUrl: string) => {
      currentImage.value = imageUrl;
      const modalElement = document.getElementById('lightboxModal_foto');
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    };

    return { onImageLoad, DOC_URL, showImage, currentImage };
  }
});
</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* Aspect ratio 4:3 */
  overflow: hidden;
  background-color: #ffffff; /* Background color while loading */
  background: url("../assets/images/fondoimg.jpeg");
  background-size: cover;
}

.card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  margin-top: -25px;
  margin-left: -25px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #c9c8c8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
