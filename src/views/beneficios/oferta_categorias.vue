<template>
  <div class="row pb-3">
    <div class="col-lg-12">
      <div class="container">
          <div class="row my-5">

            <div class="col-12">
              <h3 class="text-primary pb-1 text-center" data-aos="fade-right">
                Descuentos y Promociones 
              </h3>
            </div>
            
            <div class="card shadow-sm  sticky-top justify-content-center m-auto" style="top:73px; width: 85%;">
              <div class="card-body p-2 d-flex align-items-center gap-1">
                <i class="fa fa-search f-18 text-primary p-r-10"></i>
                <input 
                  type="text"  
                  class="form-control py-2" 
                  placeholder="¿Qué estás buscando?" 
                  v-model="busqueda"
                >
                <select class="form-select wid-120 py-2" v-model="categoriaSeleccionada" @change="filtrarPorCategoria">
                  <option value="">Categoría</option>
                  <option v-for="categoria in listaCategorias" :key="categoria.id" :value="categoria.id">
                    {{ categoria.nombre }}
                  </option>
                </select>
              </div>
            </div>
         

          <Divloading v-if="isloading_ofertas" class="pt-5"/>
          <div class="row pt-5" v-else>
            <div 
              class="col-md-3 f-u2e0 text-center" 
              v-for="(oferta, index) in ofertasFiltradas" 
              :key="oferta.id"
            >              <CardOferta 
                :item="oferta"
                :linkTo="`/beneficios/ofertadetalle/${oferta.id}`"
                subtitulo="Nuevo lanzamiento"
              />
            </div>
            <div v-if="ofertasFiltradas.length === 0" class="text-center w-100 mt-3">
              <p>No se encontraron ofertas.</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>

  <!-- PRECIO ------------------------------------------ -->
  <div class="row bg-gray-200 pt-2 pb-3">
    <div class="col-lg-12">
      <div class="container">
        <div class="row my-5">
          <div class="col-12 f-20 ">
            <div class="w-75 text-center m-auto  text-inter ">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


   <!-- OTROS ---------------------- -->

  
  
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { carousel_fotos, carousel_fotos2, carousel, CardOferta, Divloading } from '../../components/_components';
import { NumberFormat } from '../../utils/_utils';
import { useOfertas, useCategorias, useAuthStore } from '../../composables/_composables';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePaginaStore } from '../../stores/paginaStore';

interface FotoOfe {
  id: number;
  url: string;
  nombre: string;
  principal: boolean;
  miniatura: string;
}

// Define la interfaz para el producto
interface Oferta {
  id: number;
  fotos: FotoOfe[];
  titulo: string;
  precio: number;
  moneda: string;
  tipooperacion: string;
}


export default defineComponent({
  components: {
    carousel_fotos, carousel, CardOferta, carousel_fotos2, Divloading
  },
  setup() {
    const pagStore = usePaginaStore();
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);

    const ListaFotos = ref<any[]>([]);    
    const { listaOfertas, Listar_Ofertas_Activas, Eliminar_Oferta, Listar_Ofertas_porCategoria, isloading_ofertas } = useOfertas();
    const { listaCategorias, Listar_Categorias } = useCategorias();
    const categoriaSeleccionada = ref('');

    const busqueda = ref('');    const filtrarPorCategoria = async () => {
      if (categoriaSeleccionada.value) {
        await Listar_Ofertas_porCategoria(Number(categoriaSeleccionada.value));
      } else {
        await Listar_Ofertas_Activas();
      }
    };    onMounted(async () => {
      await Listar_Categorias();
      await Listar_Ofertas_Activas();
    });

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

    const ofertasFiltradas = computed(() => {
      const hoy = new Date();
      let ofertas = listaOfertas.value.filter(oferta => new Date(oferta.fechaFin) >= hoy);
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
   return {
      NumberFormat,
      listaOfertas,
      busqueda,
      ofertasFiltradas,
      listaCategorias,
      categoriaSeleccionada,
      filtrarPorCategoria,
      isloading_ofertas
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
