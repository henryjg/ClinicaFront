<template>
  <div v-if="cupon" class="d-flex flex-column justify-content-center align-items-center min-vh-100 ">
    <!-- {{ cupon }} -->
     <!-- 1 VALIDACIÓN -->
     <div v-if="secuencia === 1" class="card mt-4" style="min-width: 85%;">
        <div class="card-header  text-center">
            <img  class="img-fluid" src="../../assets/logoimp.png" width="100px" />
        </div>
        <div class="card-body py-2" :class="cupon.estado === 'Utilizado' ? 'bg-red-700' : 'bg-green-900'">
              <h5 class=" my-0 py-0">
                <div class="text-center fw-bold text-white" >
                  {{ cupon.estado === 'Utilizado' ? 'CUPÓN UTILIZADO' : 'CUPÓN VÁLIDO' }}
                </div>
              </h5>
        </div>
        <div class="card-body   text-center px-4 py-2  rounded-lg mt-1">
            <div class="image-container position-relative mt-1">
                <img v-if="cupon.negocioLogoUrl" class="img-fluid" :src="cupon.negocioLogoUrl" />
                <img v-else class="img-fluid" src="../../assets/img_card_default.avif" />
            </div>
            <div class="px-2 bg-white text-blue pt-2 f-20 f-w-800">
                {{ cupon.negocioNombre }}
            </div>
             <div class="px-2 bg-white text-center">
                  <span class="badge bg-primary">
                    {{ Usuario.idrol === 2 ? 'Trabajador' : 'Cliente' }}
                  </span>
                </div>
            <div class="w-100 d-flex justify-content-center pt-4">
                <div class="badge bg-red-300 top-0 py-1 mb-3 f-24">
                  <template v-if="Usuario.idrol === 1"> {{ cupon.valordsctoCliente }} % </template>
                  <template v-if="Usuario.idrol === 2"> {{ cupon.valordsctoTrabajador }} % </template>
                </div>
            </div>
            <hr class="border_lineaspunteadas">
            <div class="p-2 bg-white text-blue f-16">
                En beneficio de:
            </div>
            <div class="px-2 bg-white text-blue f-20 f-w-800">
                {{ cupon.nombreBeneficiario }}
            </div>
            <div class="px-2 bg-white text-blue f-16">
                En:
            </div>
            <div class="p-2 bg-white text-blue f-20 f-w-800">
                {{ cupon.ofertaNombre }}
            </div>
            <div v-if="cupon.estado !== 'Utilizado'"  class="px-2 bg-white text-gray-500 f-16">
                (Válido hasta el {{ FormatFecha.fecha_dd_mm_yyyy(cupon.fecha_fin) }})
            </div>
            <div v-if="cupon.estado === 'Utilizado'"  class="px-2 bg-white text-gray-500 f-16">
                <p class="text-gray py-0 my-0">----------------------</p></br>
                Utilizado el :  {{ FormatFecha.fecha_dd_mm_yyyy(cupon.fechaUso) }}
                <p class="text-gray py-0 my-0">----------------------</p></br>
            </div>

            <div v-if="cupon.estado !== 'Utilizado'"  class="p-2 bg-white text-red-400 f-48 f-w-800">
                <button class="btn btn-danger" @click="btnCerrarCupon">Cerrar Cupón</button>
            </div>
        </div>
     </div>
     <!-- 2 LOGGIN -->
     <div v-if="secuencia === 2" class="card m-3">
       <div class="card-header bg-green-900 text-center h5 f-w-700">
           <i class="fas fa-user-lock"></i>   VALIDACIÓN DE NEGOCIO
       </div>
       <div class="card-body text-center ">
        <p>Por favor, inicie sesión para validar su identidad y acceder a su cupón.</p>
        <label for="username" class="text-primary f-w-500"> Usuario </label>
        <input type="text" v-model="usuario" class="form-control mb-2">

        <label for="password" class="text-primary f-w-500"> Contraseña </label>
        <input type="password" v-model="contrasena" class="form-control mb-2">

        <button class="btn  btn-success justify-content-center  mx-1" @click="IniciarSession">Iniciar Sesión</button>        
        <button class="btn  btn-secondary justify-content-center  mx-1" @click="btn_regresar">Regresar</button>        
        
        </div>
     </div>
     <!-- 3 CERRARCUPON  -->
     <div v-if="secuencia === 3" class="card">
       <div class="card-header bg-blue-800 text-center text-white h5">
        CERRAR CUPÓN
       </div>
       <div class="card-body text-center">
        <h6>Bienvenido {{ Usuario.nombreusuario }}</h6>
        <p>Por favor, ingrese un comentario para cerrar el cupón.</p>

        <label for="username" class=" f-w-800 pt-2"> COMENTARIO: </label>
        <textarea class="form-control mb-3" rows="4" v-model="comentario" ></textarea>
        <button class="btn btn-danger" @click="CerrarCupon">
          <i class="fas fa-check mx-2"></i> Cerrar Cupón</button>
       </div>
     </div>
     <!-- 3 CERRARCUPON  -->
     <div v-if="secuencia === 4" class="card p-5">
        <div class="card-body text-center py-5  f-16">
          <p><i class="fas fa-check-circle text-success f-48"></i></p>
           El cupón fue cerrado correctamente.

           <p class="text-gray py-0 my-0">----------------------</p></br>
           Comentario :</br>  {{ comentario }}
           <p class="text-gray py-0 my-0">----------------------</p></br>
           <button class="btn btn-warning bg-orange-500 border-0" @click="RecargarCupon">
            <i class="fas fa-sync mx-2"></i> Recargar Cupón</button>
        </div>
     </div>


  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import QRCode from "qrcode";
import { URL_DOMINIO } from "../../config";

// Centralized imports
import { useCupones, useAuthStore, usarAutenticacion } from '../../composables/_composables';
import { Alerta, FormatFecha } from '../../utils/_utils';
import { Cupones } from '../../interfaces/_interface';
import { Alert } from 'bootstrap';


export default defineComponent({
  setup() {
    const { login_sindireccionar } = usarAutenticacion();
    const {  cerrarCuponPorUso } = useCupones();
    const route = useRoute();
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const qrCode = ref("");

    const secuencia = ref(0);

    const usuario = ref('');
    const contrasena = ref('');
    const cuponId = ref<number | null>(null);
    const comentario = ref('');

    const { cargarCupon, cupon } = useCupones();
    const currentCupon = ref<Cupones | null>(null);

    onMounted(async () => {
      cuponId.value = Number(route.params.id);
      await cargarCupon(cuponId.value);
      currentCupon.value = cupon.value;
      secuencia.value = 1;
    });

    const btnCerrarCupon = async () => {
      secuencia.value=2
    }
    const btn_regresar = async () => {
      secuencia.value=1
    }

    const IniciarSession = async () => {
      try {
        // Guardar usuario y contraseña en localStorage para validación en inicio.vue
        localStorage.setItem('lastLoginUser', usuario.value);
        localStorage.setItem('lastLoginPass', contrasena.value);
        const response = await login_sindireccionar(usuario.value, contrasena.value);
        if(response.success) {
         secuencia.value=3;
        }
      } catch (error) {
        console.error('Error al iniciar sesión', error);
      }
    };
    const RecargarCupon = async () => {
      if(cuponId.value){
        await cargarCupon(cuponId.value);
        secuencia.value = 1;
      }
    }
   

    const CerrarCupon = async () => {
      if (!comentario.value) {
        Alerta.Advertencia("Advertencia", "Por favor Ingrese un Comentario");
        return;
      }
      if(cuponId.value){
        await cerrarCuponPorUso(cuponId.value, comentario.value);
        Alerta.Sucessfull_timer("Éxito","El cupón se cerró correctamente");
        secuencia.value=4
      }else{
        Alerta.Advertencia("Advertencia","No se pudo cerrar el cupón");
      }
      
    }

    

    return {
      cupon,
      FormatFecha,
      qrCode,
      Usuario,
      IniciarSession,
      usuario,
      contrasena,
      comentario,
      CerrarCupon,
      btnCerrarCupon,
      btn_regresar,
      secuencia,RecargarCupon
    };
  }
});
</script>

<style scoped>

.image-container {
  margin: auto;
  background-color: azure;
  width: 140px;
  height: 140px;
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

</style>