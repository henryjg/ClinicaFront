<template>
  <div class="row "  style="min-height: calc(100vh - 124px)"  >
    <div class="col-md-4 justify-content-center pt-5">
      <div class="p-5">
        <div class="text-center">
            <h3 v-if="secuencia === 1" class="f-w-500 mb-1 text-blue ">Recuperar Contraseña</h3>
            <h3 v-if="secuencia === 2" class="f-w-500 mb-1 text-blue-900 ">Verificación de cuenta</h3>
            <h3 v-if="secuencia === 3" class="f-w-500 mb-1 text-secondary ">Generar nueva contraseña</h3>
            <h3 v-if="secuencia === 4" :class="secuencia===4 ? 'text-success' : 'text-info'" class="f-w-500 mb-1">Recuperación Completado</h3>

            <div id="bar" class="progress mb-3 bg-light" style="height: 7px;">
              <div :class="secuencia===4 ? 'bg-success' : 'bg-info'"
                  class="bar progress-bar progress-bar-striped progress-bar-animated" :style="{ width: secuencia / 4*100 + '%' }"></div>
            </div>
        </div>
        <!-- -------------------------------------- -->
        <!-- VALIDACIÓN DNI ----- ----- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 1">
            <div class="col-md-12">
              <p class="f-14 f-w-500 mt-1 mb-2 ">Ingresa tu documento de identidad.</p>
              <!-- -------------------------------------------- -->       
            </div>  
            <div class="mb-3">
              <input type="text" v-model="dni" class="form-control" placeholder="Documento de Identidad">
            </div>
            <div class="col-lg-12 text-center">
                  <button @click="ValidarCliente" class="btn btn-info btn-lg mt-3 ">
                      <i class="fas fa-unlock p-r-5"></i>Siguiente</button>
            </div>
        </div>
        <!-- -------------------------------------- -->
        <!-- VERIFICAR DATOS CORREO --- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 2">
          
          <div class="col-lg-12 f-16 text-inter">
              <p>Verifica nuestro mensaje enviado a tu correo electrónico 
                (<span class="fw-bold"> juanperes@prueba.com </span>), 
                e ingresa el código de 4 dígitos.</p>
              <div class="d-flex w-100 m-auto py-3">
                <input type="text" v-model="codigo_generado.num1" maxlength="1" class="form-control form-control-lg mx-1 text-center f-22">
                <div class="align-content-center mx-1" >-</div>
                <input type="text" v-model="codigo_generado.num2" maxlength="1" class="form-control form-control-lg mx-1 text-center f-22">
                <div class="align-content-center mx-1">-</div>
                <input type="text" v-model="codigo_generado.num3" maxlength="1" class="form-control form-control-lg mx-1 text-center f-22">
                <div class="align-content-center mx-1">-</div>
                <input type="text" v-model="codigo_generado.num4" maxlength="1" class="form-control form-control-lg mx-1 text-center f-22">
              </div>
              <!-- -------------------------------------------- -->
          </div>
          <div class="col-lg-12 text-center">
                <button @click="ActivarUsuarioCodigo" class="btn btn-blue btn-lg mt-3 ">
                    <i class="fas fa-unlock p-r-5"></i>Validación Completada</button>
          </div>
        </div>

        <!-- -------------------------------------- -->
        <!-- GENERAR PASSWORD------ --- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 3">
            
            <div class="mb-3">
              <p class="f-14 f-w-500 mt-1 mb-1 ">Contraseña:</p>
              <input type="password" v-model="pass" class="form-control" placeholder="Documento de Identidad">
            </div>
            <div class="mb-3">
              <p class="f-14 f-w-500 mt-1 mb-1 ">Repetir Contraseña:</p>
              <input type="password" v-model="passrepet" class="form-control" placeholder="Documento de Identidad">
            </div>

            <div class="col-lg-12 text-center">
                  <button @click="GuardarContrasena" class="btn btn-info btn-lg mt-3 ">
                      <i class="fas fa-unlock p-r-5"></i>Cambiar Contraseña</button>
            </div>
        </div>

        <!-- -------------------------------------- -->
        <!-- REGISTRO COMPLETADO -- --- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 4">
          <div class="col-lg-12 f-16 text-inter">
              <p>Cambio de contraseña completado, ahora puede iniciar sesión con sus nuevas credenciales.</p>
              
              <!-- -------------------------------------------- -->
          </div>
          <div class="col-lg-12 text-center">
            <RouterLink to="GenerarPassword" class=" text-hover-light">
              <button class="btn btn-secondary btn-lg mt-3" @click="Finalizar">
                <i class="fas fa-unlock p-r-5"></i>Iniciar Sesión</button>
            </RouterLink>
                
          </div>
        </div>

        

      </div>
    </div>
    <!-- ------------------------ -->
    <div class="col-md-8 d-none d-sm-block">
      <div class="overflow-hidden d-flex align-items-center justify-content-center custom-div">
        <img src="/src/assets/images/banner/p2.avif" class="img-centered">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

// Centralized imports
import { carousel_fotos } from '../../components/_components';
import { usarAutenticacion } from '../../composables/_composables';
import { Foto } from '../../interfaces/_interface';

const isDarkTheme = ref(false);

interface codigo{
  num1:String;
  num2:String;
  num3:String;
  num4:String;
}

export default {
  components: {
    carousel_fotos
  },
  setup () {
    const { login } = usarAutenticacion();
      const secuencia = ref(0);
      const dni = ref("");
      const pass = ref("");
      const passrepet = ref("");
      const codigo_generado = ({
        num1:0,
        num2:0,
        num3:0,
        num4:0,
      });
      onMounted(() => {
        isDarkTheme.value = checkIfDarkTheme();
        secuencia.value=1;
        console.log(isDarkTheme.value);
      });

      const checkIfDarkTheme = () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      };  

      const ValidarCliente=()=>{
        secuencia.value=2;
      }

      const ActivarUsuarioCodigo=()=>{
        secuencia.value=3;
      }
      const GuardarContrasena=()=>{
        secuencia.value=4;
      }
      const Finalizar=()=>{
        secuencia.value=1;
      }

      

      return { secuencia, codigo_generado,dni,pass,passrepet,
               ValidarCliente, ActivarUsuarioCodigo,Finalizar,GuardarContrasena
      };
},
};
</script>

<style lang="scss" scoped>


/* El contenedor debe ocupar espacio y ocultar cualquier contenido que se desborde */
.custom-div {
  width: 100%; /* Ajusta al ancho total del contenedor */
  height: calc(100vh - 124px); /* Altura dinámica restando 124px (por el header, por ejemplo) */
  display: flex; /* Habilita flexbox para centrar */
  justify-content: center; /* Centra horizontalmente el contenido */
  align-items: center; /* Centra verticalmente el contenido */
  overflow: hidden; /* Oculta cualquier parte de la imagen que desborde */
  background-color: #000; /* Opcional: color de fondo */
}

/* La imagen se ajustará dinámicamente */
.img-centered {
  width: 100%; /* Imagen ocupa el 100% del ancho inicialmente */
  height: auto; /* Mantiene la proporción de la imagen */
  min-height: 100%; /* Asegura que siempre ocupe el alto del contenedor */
  object-fit: cover; /* Llena el espacio disponible del contenedor, recortando si es necesario */
}

/* Opcional: asegúrate de que el body no tenga desplazamiento no deseado */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}



</style>