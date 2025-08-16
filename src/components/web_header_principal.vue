
<template>
  <div class="loader-bg">
    <div class="loader-track">
      <div class="loader-fill"></div>
    </div>
  </div>
  <!-- [ Pre-loader ] End -->

  <!-- [ Header ] start -->
  <header id="home" class="">
    <!-- [ Nav ] start -->
    <nav class="navbar navbar-expand-md ">
      <div class="container">
        <a class="pc-navbar-brand " href="#">
          <div class=" text-white f-w-200 f-24">
            <img v-if="!isModeDark" src="../assets/imp-logo.png" alt="logo" class="logo-lg " height="40px">
            <img v-if="isModeDark" src="../assets/imp-logo-white-238x63.png" alt="logo" class="logo-lg " height="40px">
          </div>
        </a>
        <div class="navbar-toggler rounded btn bg-opacity-10 bg-info" type="button" data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" aria-expanded="false"
          aria-label="Toggle navigation">
          <i class="fa fas fa-bars text-white"></i>
        </div>
        
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul class="navbar-nav me-auto p-l-20 mt-lg-0 mt-5 mb-2 mb-lg-0 align-items-start ">
            <li class="nav-item  px-1">
              <router-link to="/" class="nav-link f-16 d-flex">
                <i class="fa fa-home f-18  p-r-5 align-content-center mb-1"></i> Inicio
              </router-link>
            </li>
            <li class="nav-item f-16  px-1">
              <router-link  to="/beneficios/" class="nav-link d-flex ">
                <i class="fa fa-caret-right p-r-5 align-content-center"></i> Portal Beneficios
              </router-link>
            </li>

            <li class="nav-item f-16  px-1">
              <router-link  to="/portal/pagosenlinea" class="nav-link d-flex">
                <i class="fa fa-caret-right p-r-5 align-content-center"></i>Pagos en Linea
              </router-link>
            </li>

            <li class="nav-item f-16  px-1">
              <router-link  to="/portal/tramites" class="nav-link d-flex">
                <i class="fa fa-caret-right p-r-5 align-content-center"></i>Trámites
              </router-link>
            </li>

            <li class="nav-item f-16  px-1">
              <router-link  to="/beneficios/novedades" class="nav-link  d-flex">
                <i class="fa fa-caret-right p-r-5 align-content-center"></i>Novedades
              </router-link>
            </li>

          


          </ul>
          <ul class="navbar-nav mb-2 mb-lg-0 align-items-start">
            <li v-if="isLoggedIn" class="nav-item align-content-center m-auto text-primary">
              Bienvenido, {{Usuario.nombreusuario}}
            </li>
            
            <li class="nav-item">
              <a href="#" class="btn p-2 mx-2 " @click="toggleTheme">
                <i v-if="!isModeDark" class="ph-duotone ph-sun-dim text-warning "></i>
                <i v-else class="ph-duotone ph-moon text-info "></i>
              </a>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link  to="/beneficios/loggin" class="nav-link f-18 ">
                <i class="ph-duotone ph-user"></i>
              </router-link>
            </li>
            <li class="nav-item" v-else>
              <router-link  
                 v-if="Usuario.idrol === 1 || Usuario.idrol === 2"
                to="/beneficios/cuenta/misdatos" class="nav-link f-18 ">
                <i class="ph-duotone ph-user"></i>
              </router-link>
              <router-link  
                v-else
                to="/office" class="nav-link f-18 ">
                <i class="ph-duotone ph-user"></i>
              </router-link>
            </li>

            
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <div class="offcanvas offcanvas-start bg-blue-700" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title text-white" id="offcanvasExampleLabel">IMP Beneficios</h5>
    <a href="#" class="btn p-2 mx-2 " @click="toggleTheme">
      <i v-if="!isModeDark" class="ph-duotone ph-sun-dim text-warning "></i>
      <i v-else class="ph-duotone ph-moon text-info "></i>
    </a>
    <div class="nav-item" v-if="!isLoggedIn">
        <router-link  to="/beneficios/loggin" class="nav-link f-18 ">
          <i class="ph-duotone ph-user"></i>
        </router-link>
    </div>
    <div class="nav-item text-white" v-else>
      <router-link  
          v-if="Usuario.idrol === 1 || Usuario.idrol === 2"
        to="/beneficios/cuenta/misdatos" class="nav-link f-18 ">
        <i class="ph-duotone ph-user"></i>
      </router-link>
      <router-link  
        v-else
        to="/office" class="nav-link f-18 ">
        <i class="ph-duotone ph-user"></i>
      </router-link>
    </div>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    
  </div>
  <div class="offcanvas-body customer-body">
    <!-- ------------------- -->
    <ul class="navbar-nav text-white me-auto p-l-20 mb-2 mb-lg-0 align-items-start ">
      <li v-if="isLoggedIn" class="nav-item mb-4 text-white">
        Bienvenido, {{Usuario.nombreusuario}}
      </li>
      <li class="nav-item">
        <router-link to="/" class="nav-link f-16 d-flex">
          <div data-bs-dismiss="offcanvas">
            <i class="fa fa-caret-right f-18 text-white p-r-5 align-content-center mb-0"></i> Inicio
          </div>
        </router-link>
      </li>
      <li class="nav-item f-16">
        <router-link  to="/beneficios/" class="nav-link d-flex " >
          <div data-bs-dismiss="offcanvas">
            <i class="fa fa-caret-right p-r-5 align-content-center"></i>Beneficios
          </div>
        </router-link>
      </li>

      <li class="nav-item f-16">
        <router-link  to="/portal/pagosenlinea" class="nav-link d-flex">
          <div data-bs-dismiss="offcanvas">
            <i class="fa fa-caret-right p-r-5 align-content-center"></i>Mis Pagos en Linea
          </div>
        </router-link>
      </li>

      <li class="nav-item f-16">
        <router-link  to="/portal/tramites" class="nav-link d-flex">
          <div data-bs-dismiss="offcanvas">
            <i class="fa fa-caret-right p-r-5 align-content-center"></i>Mis Trámites
          </div>
        </router-link>
      </li>


      <!-- ---------------- -->
              
     
              
    </ul>
    
  </div>
</div>
  
</template>

<script lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { usarCarritoStore } from '../stores/OfertaCarrito';
  import { useAuthStore } from '../stores/authStore'; 
  import { UsuarioLogueado } from '../interfaces/usuario.interface';
  import Alerta from '../utils/alertas';
  import { usarAutenticacion } from '../composables/AuthValidate';
  

  export default {
    setup() {
      const isModeDark = ref(false);
      const carritoStore = usarCarritoStore();
      const authStore = useAuthStore(); 
      const Usuario = computed(() => authStore.usuarioLogueado);
      const { logout } = usarAutenticacion();
      const isLoggedIn = computed(() => authStore.isLoggedIn);

      onMounted(() => {
        document.body.classList.add('landing-page');

        const currentTheme = document.getElementsByTagName('body')[0].getAttribute('data-pc-theme');
        isModeDark.value = currentTheme === 'dark';

        let ost = 0;
        document.addEventListener('scroll', function () {
          let cOst = document.documentElement.scrollTop;
          const navbar = document.querySelector('.navbar');
          if (navbar) {
            if (cOst == 0) {
              navbar.classList.add('top-nav-collapse');
            } else if (cOst > ost) {
              navbar.classList.add('top-nav-collapse');
              navbar.classList.remove('default');
            } else {
              navbar.classList.add('default');
              navbar.classList.remove('top-nav-collapse');
            }
          }
          ost = cOst;
        });
      });

      const updateLogo = (selector: string, logoPath: string) => {
        const element = document.querySelector(selector);
        if (element) {
          element.setAttribute('src', logoPath);
        }
      };


      const toggleTheme = () => {
        const layout = isModeDark.value ? 'light' : 'dark';
        document.getElementsByTagName('body')[0].setAttribute('data-pc-theme', layout);
        isModeDark.value = !isModeDark.value;
        

        const btnControl = document.querySelector('.theme-layout .btn[data-value="default"]');
        if (btnControl) {
          btnControl.classList.remove('active');
        }

        const control = document.querySelector('.theme-layout .btn.active');
        if (control) {
          control.classList.remove('active');
          const activeBtn = document.querySelector(`.theme-layout .btn[data-value='${isModeDark.value}']`);
          if (activeBtn) {
            activeBtn.classList.add('active');
          }
        }
      };

      const showDropdown = ref(false);

      const toggleDropdown = () => {
        showDropdown.value = !showDropdown.value;
      };

      const confirmLogout = () => {
        Alerta.Confirmacion_CerrarSesion(
          '¿Estás seguro de que deseas cerrar sesión?',
          'Esta acción cerrará tu sesión actual.'
        ).then((confirmed) => {
          if (confirmed) {
            logout();
          }
        });
      };


      return {
        toggleTheme, isModeDark, showDropdown, toggleDropdown, carritoStore, Usuario,authStore,confirmLogout,
        isLoggedIn
      };
    }
  };
</script>

<style>
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 12rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #212529;
  text-decoration: none;
  background-color: transparent;
  border: 0;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item i {
  margin-right: 0.5rem;
}
</style>
