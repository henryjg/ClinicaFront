<template>
  <div v-if="isloading==='NO'" class="d-flex justify-content-center my-5">
    <div class="lds-ellipsis">
      <div></div><div></div><div></div><div></div>
    </div>
  </div>
  <div v-else>
    <div class="row pb-3">
      <div class="col-lg-12">
        <div class="container">
          <!-- Usa <img> en vez de <imglazy> -->
            <div class="row">
              <div class="col-12">
                <div class="img-container" style="width: 100%; z-index: 1; border-radius: 5px; aspect-ratio: 5 / 2; max-height: 40vh; overflow: hidden; background: #f5f5f5; position: relative;">
                  <img
                    class="img-fluid d-block"
                    v-if="negocio.imgPrincipalUrl && negocio.imgPrincipalUrl !== ''"
                    :src="getFullUrl(negocio.imgPrincipalUrl)"
                    style="object-fit: cover; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
                    alt="Imagen principal"
                  />
                </div>
              </div>
            </div>
            

          <!-- Logoo ----------------------------------------------- -->
          <div class="row px-3 g-0"  >
            <div class="col-md-2 col-xs-6 p-1 ">
                <img  
                  class="w-100 rounded-4 shadow bg-white "
                  v-if="negocio.logoUrl && negocio.logoUrl !== ''"
                  :src="getFullUrl(negocio.logoUrl)"
                  style="z-index: 999; aspect-ratio: 4 / 4; "
                  alt="Logo"
                />
            </div>
            <div class="col-md-10" :class="isResponsive ? 'p-1' : 'p-4'">
              <br>
              <h3 class="text-gray-700" :class="isResponsive ? 'pt-1' : 'pt-5'"> {{negocio.nombreComercial}}</h3>
            
              <div class="d-flex w-100  ">
                <button class="btn b-primary btn-sm btn-light-secondary m-r-5">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="dropdown ">
                    <button
                      class="btn btn-sm btn-light-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                    <i class="fas fa-share-alt"></i> Compartir
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <li>
                        <a class="dropdown-item" href="#" @click="copyLink">
                          <i class="fas fa-link"></i> Copiar link
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" @click="shareByEmail">
                          <i class="fas fa-envelope"></i> Mail
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" @click="shareOnWhatsApp">
                          <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" @click="shareOnFacebook">
                          <i class="fab fa-facebook"></i> Facebook
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" @click="shareOnLinkedIn">
                          <i class="fab fa-linkedin"></i> LinkedIn
                        </a>
                      </li>
      
                    </ul>
                </div>
            </div>
        
            <div  v-html="negocio.descripcion" class="mt-2 text-justify"></div>
            <!-- <inmueble_fotos :fotos="inmueble.fotos" v-if="inmueble && inmueble.fotos" /> -->
          </div>
          
        </div>
      </div>
    </div>
    <!-- -------------------------------------------------------------------------- -->
   
     <!-- -------------------------------------------------------------------------- -->
    
    <div class="container">   
      <div class="row">        
        <div class="col-12">
          <h3 class="pt-4 text-gray-700 pb-4"> Ofertas Limitadas</h3>
          <div class="row">
            <div 
              class="col-md-3 col-xs-12 col-sm-6 f-20 text-center" 
              v-for="(oferta, index) in listaOfertasFiltradas" 
              :key="oferta.id"
            >
              <CardOferta 
                :item="oferta"
                :linkTo="`/beneficios/ofertadetalle/${oferta.id}`"
                subtitulo="Nuevo lanzamiento"
              />
            </div>
          </div>
          
          <!-- -------------------------------------- -->
          <hr class="mt-4">
          <div class="container" v-if="listaSedes.length>0">
            <h3 class="pt-2">Sedes</h3>
            <div class="row" >
              <div v-for="sede in listaSedes" class="col-6">
                <div class="alert alert-secondary">
                  <div class="row ">
                    <div class="col-10 d-flex">
                        <i class="fa fa-location-arrow p-r-15"></i> 
                        <p>Ubícanos en {{ sede.direccion }} <br>
                        {{ sede.ubigeo }}</p>
                    </div>
                    <div class="col-2">
                  
                    </div>
                  </div>
                </div>
              </div>
            </div>                <div  class="rounded-4 shadow b-light border-5 overflow-hidden my-2">
                  
                  <GoogleMap
                      :api-key="GoogleApi"
                      :style="googleMaps.mapConfig.style"
                      :center="googleMaps.center.value"
                      :zoom="googleMaps.mapConfig.zoom"
                      :streetViewControl="googleMaps.mapConfig.streetViewControl"
                      :disable-default-ui="googleMaps.mapConfig.disableDefaultUI"
                      :gestureHandling="googleMaps.mapConfig.gestureHandling"
                  >
                  <Marker v-for="sede in listaSedes" :key="sede.id" :options="{ position: { lat: sede.latitud, lng: sede.longitud }, draggable: false }"/>
                  </GoogleMap>
            </div>
          </div>
          <!-- -------------------------------------- -->
          <hr class="mt-4">
          <!-- <h3 class="pt-2">Realiza tus consultas:</h3>
          <div class="my-2">
                <div class="d-flex">
                  <input type="text" class="form form-control py-3">
                  <button class="btn btn-danger m-l-10 wid-120">
                      <i class="fa fa-mail-bulk"></i> 
                      Enviar
                  </button>
                </div>
          </div> -->
        </div>
        <div class="col-3">
          <div class="sticky-md-top top-80">
            <formulario class='mt-5' />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import 'nprogress/nprogress.css';
import { GoogleMap, Marker } from 'vue3-google-map';

// Centralized imports
import { CardOferta } from '../../components/_components';
import ImgLazy from '../../components/Elementos/lazyimg.vue';
import { useOfertas, useNegocios, useSedes, useGoogleMaps, useAuthStore } from '../../composables/_composables';
import { Notif, NumberFormat } from '../../utils/_utils';
import { GoogleApi } from '../../config';
import { getFullUrl } from '../../utils/getFullUrl';

export default {
  components: {
    GoogleMap,
    Marker,
    imglazy: ImgLazy,
    CardOferta
  },
  setup() {
    const route = useRoute();
    const { listaOfertas, Listar_Ofertas_porIdNegocio } = useOfertas(); 
    const { negocio, Obtener_Negocio } = useNegocios(); 
    const { listaSedes, Listar_Sedes } = useSedes(); 
    const googleMaps = useGoogleMaps();    ///------------------------------------------------------------------------
    const url = ref(''); // Declara la variable `url` como una referencia reactiva
    onMounted(() => {
        url.value = `${window.location.origin}${route.fullPath}`; // Asigna la URL actual del negocio
    });
    const windowWidth = ref(window.innerWidth);
    const breakpoint = 768; // Punto de quiebre para "responsivo"
    const isResponsive = computed(() => windowWidth.value < breakpoint);
   

    // --- Lógica de usuario y descuentos igual que en inicio/oferta_categorias ---
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    function descuentoValido(valor: string | null | undefined): boolean {
      if (valor == null) return false;
      const v = String(valor).replace(/\s+/g, '').toLowerCase();
      if (!v) return false;
      if (v === '0' || v === '0%' || v === '0.0%' || v === '0.00%') return false;
      if (/^0+(\.0+)?%?$/.test(v)) return false;
      return true;
    }
    const listaOfertasFiltradas = computed(() => {
      const hoy = new Date();
      let ofertas = listaOfertas.value.filter(
        oferta => new Date(oferta.fechaFin) >= hoy && oferta.estado !== 'Inactivo'
      );
      if (Usuario.value && Usuario.value.idrol === 1) {
        ofertas = ofertas.filter(oferta => descuentoValido(oferta?.valordscto_cliente));
      } else if (Usuario.value && Usuario.value.idrol === 2) {
        ofertas = ofertas.filter(oferta => descuentoValido(oferta?.valordscto_trabajador));
      } else {
        ofertas = ofertas.filter(oferta => descuentoValido(oferta?.valordscto_cliente));
      }
      return ofertas;
    });

    watch(windowWidth, (newWidth, oldWidth) => {
    });

    const isloading = ref('');

    //---------------------------------------------------
    function truncateText(text: String, maxLength:number) {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
    }//---------------------------------------------------
    onMounted(async () => {
      const idNegocio = Number(route.params.id);
      await Listar_Ofertas_porIdNegocio(idNegocio); // Cargar la lista de ofertas del negocio
      await Obtener_Negocio(idNegocio);
      await Listar_Sedes(idNegocio);
        // Establecer posición del mapa si hay sedes disponibles
      if (listaSedes.value.length > 0) {
        const firstSede = listaSedes.value[0];
        googleMaps.setPosition(firstSede.latitud, firstSede.longitud);
      }
    });    ///------------------------------------------------------------------------
    const defaultCenter = { lat: -5.192700526416363, lng: -80.62846284179687 };
    // Removed duplicate Google Maps logic - now using useGoogleMaps composable

    ///------------------------------------------------------------------------
    const copyLink = () => {
        navigator.clipboard.writeText(url.value).then(
            () => {
                Notif.Success('Se copió Link al portapapeles');
            },
            (err) => {
                Notif.Error('Error al copiar el link');
            }
        );
    };

    const shareByEmail = () => {
      const subject = encodeURIComponent('La casa de tus sueños esta aquí ');
      const body = encodeURIComponent(`¡Hola!, La casa de tus sueños está aquí: ${url.value}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const shareOnWhatsApp = () => {
      const text = encodeURIComponent(`¡Hola!, Comparto contigo este maravilloso inmueble: ${url.value}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareOnFacebook = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.value)}`, '_blank');
    };
    const shareOnLinkedIn = () => {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url.value)}`, '_blank');
    };

    return {
      // Google Maps from composable
      googleMaps,
      NumberFormat,
      url,
      // Social sharing functions
      copyLink,
      shareByEmail,
      shareOnWhatsApp,
      shareOnFacebook,
      shareOnLinkedIn,
      // Loading state
      isloading,
      // Business data
      negocio,
      listaOfertas,
      CardOferta,
      listaSedes,
      Listar_Sedes,
      GoogleApi,
      isResponsive,
      listaOfertasFiltradas,
      getFullUrl
    };
  }
};
</script>

<style lang="scss" scoped>


</style>
