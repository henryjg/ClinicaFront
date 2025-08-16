// ===================================================
// COMPONENTES CENTRALIZADOS
// ===================================================

// Componentes básicos y utilidades
export { default as Breadcrumb } from './breadcrumb.vue';
export { default as Divloading } from './Loading_circular.vue';
export { default as ErrorMessage } from './ErrorMessage.vue';
export { default as FileUploader } from './FileUploader.vue';
export { default as ImageLoader } from './img_loading.vue';
export { default as ImgLazy } from './Elementos/lazyimg.vue';
export { default as TreeView } from './tree_view.vue';
export { default as ModalLoader } from './ModalLoader.vue';
export { default as Component } from './component.vue';
export { default as AuthDebugPanel } from './AuthDebugPanel.vue';

// Layout y estructura
export { default as CardLayout } from '../layout/CardLayout.vue';
export { default as DataTable } from './table/DataTable.vue';
export { default as DataTablePaginacion } from './table/DataTablePaginacion.vue';

// Componentes de tarjetas (Cards)
// export { default as CardCupon } from './card_cupon.vue';
export { default as CardCuponUsado } from './card_cuponUsado.vue';
export { default as CardOferta } from './card_oferta.vue';
export { default as cardProduct } from './card_oferta.vue'; // Alias para retrocompatibilidad
export { default as CardNoticia } from './card_noticia.vue';
export { default as CardMarca } from './card_marca.vue';
export { default as CardPublicidad } from './card_publicidad.vue';  
export { default as CardCantidadCupones } from './card_cantidadCupones.vue';
export { default as cardPublicidad } from './card_publicidad.vue';

// Componentes de formularios y listas
// export { default as FormFotos } from './form_registrarFotos.vue';
export { default as ListOferta } from './list_oferta.vue';
// export { default as ListConvenios } from './listConvenios.vue';

// Componentes de modales y paneles
// export { default as PanelSede } from './Panel_Sede.vue';

// Componentes de carousels y multimedia
export { default as CarouselFotosNegocio } from './CarouselFotosNegocio.vue';
export { default as carousel_fotos } from './carousel_fotos.vue';
// export { default as carousel_fotos2 } from './carousel_variasFotos2.vue';
export { default as carousel } from './carousel.vue';
export { default as SlickSlider } from './slider_slick_center.vue';
export { default as SlickEnlace } from './slider_slick_enlace.vue';

// Componentes de formularios específicos
export { default as VideotubePlayer } from './form/videtube.vue';

// ===================================================
// LIBRERÍAS EXTERNAS COMUNES
// ===================================================
import { QuillEditor } from '@vueup/vue-quill';
import Multiselect from 'vue-multiselect';
import { GoogleMap, Marker } from 'vue3-google-map';
import { Vue3Lottie } from 'vue3-lottie';

export {
  QuillEditor,
  Multiselect,
  GoogleMap,
  Marker,
  Vue3Lottie
};