<template>
      <Divloading v-if="isLoading_Slider" class="pt-5"/>
      <Transition>
        <div  v-if="!isLoading_Slider">
          <div v-if="listaSliders.length>0" class="row pt-0 ">
            <div class="col-lg-12 bg-blue-700">
              <div class="container py-3">
                <carousel_fotos :sliders="listaSliders" id="SliderPrincipal"></carousel_fotos>
              </div>
            </div>
          </div>

          <div v-if="listaSliders_categoria.length>0" class="row pt-2 bg-blue-900">
            <div class="col-lg-12">
              <div class="container">
                <div class="row my-4">
                  <div class="col-12">
                    <h5 class=" pb-1 text-center" data-aos="fade-right">
                      <span class="text-white">DESCUENTOS POR </span> <span class="text-info">CATEGORIAS</span>  
                    </h5>
                    <!-- {{ Usuario }} -->
                    <hr class="b-info wid-145 m-auto mb-3">
                  </div>
                  <SlickSlider v-if="!isloading && listaSliders_categoria.length > 0" :items="listaSliders_categoria" />

                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      
      
      
    
      <!-- ----------------------------- -->
      <Divloading v-if="isLoading_Categoria" class="pt-5"/>
      <Transition>
        <div  v-if="!isLoading_Categoria" style="min-height: calc(60vh);">
          <div class="row pb-3 ">
            <div class="col-lg-12">
              <div class="container">
                <div class="row my-5">
                  <div class="col-12">
                    <h5 class=" pb-1 text-center" data-aos="fade-right">
                      <span class="text-primary">CUPONES</span> <span class="text-blue-700">DESTACADOS</span>  
                    </h5>
                    <hr class="b-info wid-145 m-auto mb-3">
                  </div>
                  <div  
                    class="col-md-3 col-12 f-20 " 
                    v-for="(oferta, index) in ofertasFiltradas" 
                    :key="oferta.id">
                    <card-product 
                      :item="oferta"
                      :linkTo="`/beneficios/ofertadetalle/${oferta.id}`"
                    />
                    <!-- Mostrar porcentaje de descuento según el tipo de usuario -->
                    <div>
                      <!-- Si está logueado como cliente -->
                      <template v-if="Usuario && Usuario.idrol === 1">
                        <p v-if="descuentoValido(oferta?.valordscto_cliente)">
                        </p>
                      </template>
                      <!-- Si está logueado como trabajador -->
                      <template v-else-if="Usuario && Usuario.idrol === 2">
                        <p v-if="descuentoValido(oferta?.valordscto_trabajador)">
                        </p>
                      </template>
                      <!-- Si no está logueado, mostrar solo el de cliente si existe -->
                      <template v-else>
                        <p v-if="descuentoValido(oferta?.valordscto_cliente)">
                        </p>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Slider de Marcas -->
      <div v-if="listaNegocios.length > 0" class="row pt-2 ">
        <div class="col-lg-12">
          <div class="container">
            <div class="row my-4">
              <div class="col-12">
                <h4 class="text-primary pb-1 text-center" data-aos="fade-right">
                    Empresas Afiliadas 
                </h4>
                <hr class="b-info wid-100 m-auto mb-3" />
              </div>
              <SliderSlickMarcas v-if="!isLoading_negocio && MarcasFiltradas.length > 0" :marcas="MarcasFiltradas" />
            </div>
          </div>
        </div>
      </div>

      <!-- PUBLICIDAD ------------------------------------------ -->
      <div v-if="publicidadItems.length > 0" class="row bg-blue-700 pt-2 pb-3">
        <div class="col-12">
          <h4 class="text-info pb-1 text-center pt-5" data-aos="fade-right">
            Proyectos Inmobiliarios
          </h4>
          <hr class="b-info wid-145 m-auto mb-3">
        </div>
        <div class="col-lg-12">
          <div class="container">
            <div class="row">

              <SlickEnlace v-if="publicidadItems.length > 0" :items="publicidadItems">
                <template v-slot:default="slotProps">
                  <card-publicidad :item="slotProps.item" />
                </template>
              </SlickEnlace>
            </div>
          </div>
        </div>
      </div>
      <!-- OTROS ---------------------- -->
    <!-- <ModalCambiaPass></ModalCambiaPass> -->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Importaciones centralizadas
import { 
    cardProduct, 
    carousel_fotos, 
    carousel_fotos2, 
    carousel, 
    Divloading, 
    SlickSlider, 
    SlickEnlace, 
    cardPublicidad, 
    Component 
} from '../../components/_components';
import { 
    useOfertas, 
    useSliders, 
    useCategorias, 
    usePublicidad, 
    useAuthStore, 
    useNegocios
} from '../../composables/_composables';
import { NumberFormat, Modal } from '../../utils/_utils';
import type { Precio } from '../../types/objetosweb';
import type { ItemSlider, Slider } from '../../interfaces/_interface';

// Imports específicos
// import ModalCambiaPass from '../../views/Modals/modal_CambiarPass.vue';
import { DOC_URL } from '../../config';
import SliderSlickMarcas from '../../components/slider_slick_marcas.vue';


export default defineComponent({
  components: {
    Divloading,
    SlickSlider,
    // ModalCambiaPass,
    SliderSlickMarcas,
    carousel_fotos, carousel, cardProduct, carousel_fotos2, SlickEnlace, cardPublicidad, Component // Register the offer component
  },
  setup() {
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    
    const ListaPrecios= ref<Precio[]>([]);
    const Preventa    = ref(false);
    const router      = useRouter();
    const FotoSlider  = ref<Slider[]>([]);
    const isloading   = ref(true);

    const { listaOfertas, Listar_Ofertas_Activas, isloading_ofertas } = useOfertas(); // Usa el composable
    const { listaSliders, Listar_Slider_Activos, isLoading_Slider } = useSliders(); // Usa el composable para sliders
    const { listaSliders_categoria, Listar_Categorias, isLoading_Categoria } = useCategorias();
    const { listaPublicidad, Listar_Publicidad } = usePublicidad();
    const { listaNegocios, Listar_Negocios,isLoading_negocio } = useNegocios();

    const ListaFotos = ref<Slider[]>([]);

    const CategoriaClick = (categoriaId: number) => {
      router.push(`/beneficios/oferta_categoria/${categoriaId}`);
    };
 
    onMounted(async () => {
      isloading.value = true; 
      await Listar_Slider_Activos(); // Cargar la lista de sliders
      await Listar_Categorias();
      await Listar_Ofertas_Activas(); // Cargar la lista de ofertas
      await Listar_Publicidad(); // Cargar la lista de publicidad
      await Listar_Negocios(); // Cargar la lista de negocios

      isloading.value = false; 

      // Solo mostrar el modal si el usuario y la contraseña son iguales
      const lastUser = localStorage.getItem('lastLoginUser') || '';
      const lastPass = localStorage.getItem('lastLoginPass') || '';
      if (Usuario.value && lastUser && lastPass && lastUser === lastPass) {
        // openModal_ChangePass();
      }
    });

    //---------------------------------------------------------------------    
    // Función para validar si un descuento es válido (string o porcentaje)
    function descuentoValido(valor: string | null | undefined): boolean {
      if (valor == null) return false;
      const v = String(valor).replace(/\s+/g, '').toLowerCase();
      if (!v) return false;
      // Filtrar variantes de cero: "0", "0%", "0.0%", "0.00%", "0 %", etc.
      if (v === '0' || v === '0%' || v === '0.0%' || v === '0.00%') return false;
      // También filtrar si es un número igual a 0 aunque tenga decimales
      if (/^0+(\.0+)?%?$/.test(v)) return false;
      return true;
    }
// -----------------------------------------------------------------------------------
    const ofertasFiltradas = computed(() => {
      const hoy = new Date();
      let ofertas = listaOfertas.value.filter(oferta => new Date(oferta.fechaFin) >= hoy);
      ofertas = ofertas.filter(oferta => {
        const negocio = listaNegocios.value.find(n => n.id === oferta.negocioId);
        return negocio && negocio.estado === 'Activo';
      });

      if (Usuario.value && Usuario.value.idrol === 1) {
        // Cliente: solo mostrar ofertas con descuento cliente válido
        ofertas = ofertas.filter(oferta => descuentoValido(oferta?.valordscto_cliente));
      } else if (Usuario.value && Usuario.value.idrol === 2) {
        // Trabajador: solo mostrar ofertas con descuento trabajador válido
        ofertas = ofertas.filter(oferta => descuentoValido(oferta?.valordscto_trabajador));
      } else {
        // No logueado: solo mostrar ofertas con descuento cliente válido
        ofertas = ofertas.filter(oferta => descuentoValido(oferta?.valordscto_cliente));
      }
      return ofertas;
    });

    const MarcasFiltradas = computed(() => {
      return listaNegocios.value.filter(marca => marca.logoUrl !== '').map((marca) => ({
        linkRouter: `/marca/${marca.id}`,
        id: String(marca.id),
        urlimagen: marca.logoUrl,
        nombre: marca.nombreComercial,
      }));
    });

    //---------------------------------------------------------------------    
    const publicidadItems = computed(() => {
      return listaPublicidad.value.map(publi => ({
        linkRouter: publi.link,
        urlimagen: publi.urlFoto,
        ...publi
      }));
    });
    
    //---------------------------------------------------------------------
    // const openModal_ChangePass = () => {
    //   const modalElement = document.getElementById('changePasswordModal');
    //   if (modalElement) {
    //     const modal = new Modal(modalElement);
    //     modal.show();
    //   }
    // };

    return {
      NumberFormat, isloading,
      ListaFotos, DOC_URL, FotoSlider,
      ListaPrecios, Preventa,listaSliders,
      listaOfertas, CategoriaClick, ofertasFiltradas,
      listaSliders_categoria, listaPublicidad, publicidadItems,Usuario, isLoading_Slider,isLoading_Categoria,isloading_ofertas,
      isLoading_negocio, listaNegocios, MarcasFiltradas,
      descuentoValido
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



