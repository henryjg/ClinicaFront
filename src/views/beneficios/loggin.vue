<template>
  <div class="row bg-blue-800" style="min-height: calc(100vh - 124px)">
    <div class="col-md-4 justify-content-center align-content-center">
      <div class="p-5">
        <div class="text-center">
            <h3 class="f-w-500 mb-1 text-info">Iniciar Sesión</h3>
            <h5 class="f-w-500 mb-0 pt-2 text-gray-300">¡Bienvenido a nuestra plataforma de beneficios!</h5>
            <p class="text-white py-3 f-w-300">Descubre todos los lugares donde puedes disfrutar de promociones, compras, eventos, experiencias y mucho más.</p>
        </div>

        <div class="mb-3">
            <label class="form-label">Tipo de Usuario</label>
            <select v-model="tipoUsuario" class="form-control bg-white text-dark">
                <option value="" disabled selected>Selecciona tipo de usuario</option>
                <option value="Cliente">Cliente</option>
                <option value="Trabajador">Trabajador</option>
                <option value="Negocio">Negocio</option>
                <option value="Administrador">Control</option>
            </select>
        </div>
        
        <div class="mb-3">
            <label v-if="tipoUsuario!=='Negocio'" class="form-label">N° Documento de Identidad:</label>
            <label v-else class="form-label">Número de RUC:</label>
            <input type="text" v-model="usuario" class="form-control bg-white text-dark" >
        </div>
        
        <div v-if="tipoUsuario=='Administrador' || tipoUsuario=='Negocio'" class="mb-3">
            <input type="password" v-model="contrasena" class="form-control bg-white text-dark" placeholder="Contraseña">
        </div>

        <div class="d-grid mt-4">
            <button v-if="tipoUsuario=='Administrador' || tipoUsuario=='Negocio'" type="button" @click="IniciarSession" class="btn btn-primary"><i class="fas fa-user-lock m-r-10"></i> Ingresar</button>
            <button v-else type="button" @click="IniciarSession_solodocumento" class="btn btn-primary"><i class="fas fa-user-lock m-r-10"></i> Ingresar sin documento</button>
        </div>
        <div class="d-grid mt-4 text-center">
            <RouterLink to="/beneficios/GenerarPassword" class="text-hover-light btn btn-warning bg-yellow-900 border-0">
              <i class="fas fa-check"></i> Activar Acceso
            </RouterLink>
        </div>
        <!-- <div class="d-grid mt-2 text-center">
          <RouterLink to="/beneficios/RecuperarPassword" class="text-hover-warning">Recuperar Contraseña</RouterLink>
        </div> -->
      </div>
    </div>

    <div class="col-md-8 d-none d-sm-block">
      <div class="overflow-hidden d-flex align-items-center justify-content-center custom-div">
        <img src="/src/assets/images/bgcliente.avif" class="img-centered">
        
      </div>
    </div>
  </div>

  <!-- Modal para cambiar contraseña -->
  <ModalPassword  ref="changePasswordModal"/> 
</template>


<script lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Modal } from 'bootstrap';
import lock from '../../assets/lotties/lock.json';

// Centralized imports
import { carousel_fotos, Vue3Lottie } from '../../components/_components';
import { usarAutenticacion } from '../../composables/_composables';
import { Notif } from '../../utils/_utils';

const isDarkTheme = ref(false);
import ModalPassword from '../Modals/modal_CambiarPass.vue';


// Define the interface for the exposed methods of Modal_CambiarPass.vue
interface ModalPasswordInstance {
  openChangePasswordModal: () => void;
}

export default {
  components: {
    Vue3Lottie,
    carousel_fotos,
    ModalPassword
  },
  setup() {
    const { login, login_solodocumento } = usarAutenticacion();
    const usuario = ref('');
    const contrasena = ref('');
    const tipoUsuario = ref('Cliente');
    // Variables para el modal de cambio de contraseña
    const newPassword = ref('');
    const confirmPassword = ref('');
    const changePasswordModal = ref<ModalPasswordInstance | null>(null);
    // Creamos una variable para almacenar los estados de cada validación individual
    const passwordErrors = ref({
      hasUpperCase: false,
      hasNumbersAndLetters: false,
      hasMinLength: false,
      passwordsMatch: false
    });

    let userId = ref<string | null>(null);

    onMounted(() => {
      isDarkTheme.value = checkIfDarkTheme();
    });

    const checkIfDarkTheme = () => {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const IniciarSession = async () => {
      try {
        // Guardar usuario y contraseña en localStorage para validación en inicio.vue
        localStorage.setItem('lastLoginUser', usuario.value);
        localStorage.setItem('lastLoginPass', contrasena.value);
        const response = await login(usuario.value, contrasena.value);
      } catch (error) {
        console.error('Error al iniciar sesión', error);
      }
    };

    const IniciarSession_solodocumento = async () => {
      try {
        // Guardar usuario y contraseña en localStorage para validación en inicio.vue
        localStorage.setItem('lastLoginUser', usuario.value);
        const response = await login_solodocumento(usuario.value, tipoUsuario.value);
      } catch (error) {
        console.error('Error al iniciar sesión', error);
      }
    };

    return {
      IniciarSession,
      IniciarSession_solodocumento,
      usuario,
      contrasena,
      passwordErrors, 
      tipoUsuario
    };
  }
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