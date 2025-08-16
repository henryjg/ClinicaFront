
<template>
  <div class="container mt-5">
    <!-- ------------------ -->
     <!-- {{ Usuario }} -->
    <div class="row">
      <!-- Listado de ofertas -->
      <div class="col-md-8">
        <h5 class="mb-3">Cupones Seleccionados</h5>
        <div class="div  rounded-3 mb-0 pb-0" >
            <div class="row g-2 p-1 f-w-500">
                <!-- -------------------- -->
                <div class="col-md-1 text-left"> N°</div>
                <div class="col-md-1 text-left"> </div>
                <div class="col-md-8 text-left  px-2">
                    Oferta
                </div>
                <div class="col-md-1 ">
                    Dscto.
                </div>
                <div class="col-md-1 ">
                </div>
                <!-- -------------------- -->
            </div>
        </div>
        <hr class="border m-0 mb-3">

        <div v-if="ofertas.length > 0">
          <div class="div bg-white rounded-3 mb-3" v-for="(oferta, index) in ofertas" :key="index">
            <div class="row g-2 p-2">
                <!-- -------------------- -->
                <div class="col-md-1 m-auto">
                  {{index + 1}}
                </div>
                <div class="col-md-1 m-auto">
                  
                  <!-- <h5 class="card-title text-red-400">{{ oferta.valordscto_cliente }} %</h5> -->
                  <!-- <h5 class="card-title">{{ oferta.valordscto_cliente }} %</h5> -->
                  <img :src="oferta.imagenUrl" class="img-fluid rounded-3" alt="Imagen de la oferta">
                </div>
                
                <div class="col-md-8 d-flex align-items-center m-auto">
                    <p class="card-title px-2">{{ oferta.nombreOferta }} </p>
                </div>

                <div class="col-md-1 m-auto">
                    <h5 v-if="Usuario.idrol===1" class="card-title text-red-400">{{ oferta.valordscto_cliente }} %</h5>
                  <h5 v-if="Usuario.idrol===2" class="card-title text-red-400">{{ oferta.valordscto_trabajador }} %</h5>
                  
                  <!-- <h5 class="card-title">{{ oferta.valordscto_cliente }} %</h5> -->
                  <!-- <img :src="oferta.imagenUrl" class="img-fluid rounded-3" alt="Imagen de la oferta"> -->
                </div>
                
                <div class="col-md-1 m-auto">
                    <button @click="eliminarOferta(oferta.id)" class="btn text-hover-danger">
                          <i class="ph-duotone ph-trash"></i> 
                    </button>
                </div>
                <!-- -------------------- -->
            </div>
          </div>
        </div>
        <div v-else class="alert alert-warning text-center">
          <i class="ph-duotone ph-warning"></i> No hay ofertas seleccionadas.
        </div>
      </div>

      <!-- Resumen del carrito -->
      <div class="col-md-4">
        <div class="card p-3">
          <h5 class="text-center">Resúmen</h5>
          <p class="text-center">Subtotal: {{ ofertas.length }} cupones</p>
          <button @click="realizarCompra" class="btn btn-primary w-100">Activar Cupones</button>
        </div>
      </div>
    </div>
    <!-- -------------------------------------- -->
   <!-- Modal Bootstrap -->
   <div class="modal fade" id="modalLogin" tabindex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLoginLabel">Debes iniciar sesión</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            Para activar los cupones, debes estar logueado como Cliente o Trabajador.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="redirigirLogin">Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';

// Centralized imports
import { CardCupon } from '../../components/_components';
import { useCupones, usarCarritoStore, useAuthStore } from '../../composables/_composables';
import { Notif, Alerta } from '../../utils/_utils';
import { initializeUsuarioLogueado, UsuarioLogueado } from '../../interfaces/_interface';


export default defineComponent({
  components: {
    CardCupon
  },
  name: 'ListaOfertasCupones',
  setup() {
    const carritoStore = usarCarritoStore();
    const router = useRouter();
    const { guardarCupon, NuevoCupon, listaCupones } = useCupones();
    const ofertas = ref(carritoStore.ListaOfertas);

    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);

    let modalInstance: any = null;


    const eliminarOferta = (id: number) => {
        carritoStore.eliminarOferta(id);
        ofertas.value = carritoStore.ListaOfertas;
    };

    const realizarCompra = async () => {
      if (!Usuario.value || (Usuario.value.idrol !== 1 && Usuario.value.idrol !== 2)) {
        mostrarModal();
        return;
      }
      const isConfirmado = await Alerta.ConfirmacionRegistro(
        'Confirmación',
        '¿Desa confirmar el registro de los cupones seleccionados?'
      );
      if (isConfirmado) {
          try {
              for (const oferta of ofertas.value) {
                // let nombreBeneficiario = '';                // if (Usuario.value.idrol === 2 && Usuario.value.trabajador) {
                //     nombreBeneficiario = Usuario.value.nombreusuario;
                // } else if (Usuario.value.idrol === 1 && Usuario.value.cliente) {
                //     nombreBeneficiario = Usuario.value.nombreusuario;
                // }
                if (Usuario.value) {
                  NuevoCupon.value = {
                      tipoUsuario: Usuario.value.idrol === 2 ? 'Trabajador' : 'Cliente',
                      idUsuario: Usuario.value.idusuario.toString(),
                      esfamiliar: 'Si',
                      idFamiliar: '0',
                      nombreBeneficiario: Usuario.value.nombreusuario,
                      ofertaId: oferta.id,
                  };
                }
                
                await guardarCupon();

              }
              // router.push({ name: 'MisCupones' }); 
              carritoStore.resetListaOferta(); // Limpia la lista de cupones seleccionados
              ofertas.value = carritoStore.ListaOfertas; // Actualiza la referencia de ofertas
              router.push({ name: 'MisCupones' }); // Redirige a la otra vista


              // carritoStore.resetListaOferta();
              // ofertas.value = carritoStore.ListaOfertas;
              // Notif.Success('Ofertas añadidas exitosamente.');
          } catch (error) {
              console.error('Error al añadir las ofertas:', error); // Mensaje de depuración
              Notif.Error('Error al añadir las ofertas.');
          }
      }
      
    };

    const mostrarModal = () => {
      if (!modalInstance) {
        modalInstance = new Modal(document.getElementById('modalLogin')!);
      }
      modalInstance.show();
    };

    const redirigirLogin = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
      router.push({ name: 'Loggin' });
    };

    // const cerrarModal = () => {
    //   mostrarModal.value = false;
    // };


    watch(
      () => authStore.usuarioLogueado,
      (nuevoUsuario) => {
        if (!nuevoUsuario) {
          router.push({ name: 'Loggin' });
        }
      }
    );

    

    return {
      ofertas,
      eliminarOferta,
      realizarCompra,
      Usuario,
      listaCupones,
      mostrarModal,
      redirigirLogin,
      // cerrarModal
    };
  },
});
</script>

<style scoped>
.card {
  border-radius: 10px;
}

.card img {
  width:100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 15px;
}

.btn {
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  transform: scale(1.05);
}
.alert {
  margin-top: 1rem;
}
</style>