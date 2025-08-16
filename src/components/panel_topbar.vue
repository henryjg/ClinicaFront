<template>
  <!-- [ Header Topbar ] start -->
  <header class="pc-header">
    <div class="header-wrapper">
      <!-- [Mobile Media Block] start -->
      <div class="me-auto pc-mob-drp">
        <ul class="list-unstyled">
          <!-- ======= Menu collapse Icon ===== -->
          <li class="pc-h-item pc-sidebar-collapse">
            <a href="#" class="pc-head-link ms-0" id="sidebar-hide">
              <i class="ti ti-menu-2"></i>
            </a>
          </li>
          <li class="pc-h-item pc-sidebar-popup">
            <a href="#" class="pc-head-link ms-0" id="mobile-collapse">
              <i class="ti ti-menu-2"></i>
            </a>
          </li>
          <li class="pc-h-item ">
            <div class="mx-1 d-none d-sm-block d-sm-none d-md-block">

              <div class="badge bg-blue-700 f-13 p-r-10 px-3" >Bienvenido
                 {{ Usuario!.nombreusuario }}</div>
                 <!-- {{ Usuario }} -->
            </div>
          </li>
        </ul>
      </div>
      <!-- [Mobile Media Block end] -->
      <div class="ms-auto p-0 m-0" style="line-height:0px" >
        <ul class="list-unstyled">
          
          <div class="d-none d-sm-block d-sm-none d-md-block">
            <li class="pc-h-item ">
              <a class="pc-head-link " href="#" @click.prevent="openFullscreen" role="button">
                <i class="fas fa-tv"></i>
              </a>
            </li>
          </div>
         
          <li class="dropdown pc-h-item">
            <a class="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
              aria-haspopup="false" aria-expanded="false">
              <i class="ph-duotone ph-sun-dim"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-end pc-h-dropdown">
              <a href="#!" class="dropdown-item" @click="() => layoutChange('dark')">
                <i class="ph-duotone ph-moon"></i>
                <span>Dark</span>
              </a>
              <a href="#!" class="dropdown-item" @click="() => layoutChange('light')">
                <i class="ph-duotone ph-sun-dim"></i>
                <span>Light</span>
              </a>
            </div>
          </li>
          
          <li class="pc-h-item">
            <a class="pc-head-link pct-c-btn" href="#" @click.prevent="goToHomeAdmin" role="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_pc_layout">
              <i class="ph-duotone ph-gear-six"></i>
            </a>
          </li>
          <!-- **************************** -->
          <boxPerfil/>
          <!-- **************************** -->
          <!-- <li class="pc-h-item">
            <a class="pc-head-link" href="#" @click.prevent="goToHomeAdmin" role="button">
              <i class="ti ti-home"></i>
            </a>
          </li> -->
        </ul>
      </div>
    </div>
  </header>
  <!-- [ Header ] end -->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import boxPerfil from "../components/dash_CampoPerfil.vue";
import { Dropdown } from 'bootstrap';
import { useAuthStore } from '../stores/authStore';
import { UsuarioLogueado } from '../interfaces/usuario.interface';

export default defineComponent({
  components: {
    boxPerfil
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const layoutChange = (layout: string) => {
        document.getElementsByTagName('body')[0].setAttribute('data-pc-theme', layout);
        const btnControl = document.querySelector('.theme-layout .btn[data-value="default"]');

        if (btnControl) {
            btnControl.classList.remove('active');
        }
        const isDark = layout === 'dark';
       
        const control = document.querySelector('.theme-layout .btn.active');
        if (control) {
            control.classList.remove('active');
            const activeBtn = document.querySelector(`.theme-layout .btn[data-value='${!isDark}']`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
    };

    const initializeSidebarToggle = () => {
      const sidebarHide = document.querySelector('#sidebar-hide');
      const mobileCollapse = document.querySelector('#mobile-collapse');

      if (sidebarHide) {
        sidebarHide.addEventListener('click', () => {
          const sidebar = document.querySelector('.pc-sidebar');
          if (sidebar) {
            sidebar.classList.toggle('pc-sidebar-hide');
          }
        });
      }

      if (mobileCollapse) {
        mobileCollapse.addEventListener('click', () => {
          const tempSidebar = document.querySelector('.pc-sidebar');
          if (tempSidebar) {
            if (tempSidebar.classList.contains('mob-sidebar-active')) {
              rm_menu();
            } else {
              tempSidebar.classList.add('mob-sidebar-active');
              tempSidebar.insertAdjacentHTML('beforeend', '<div class="pc-menu-overlay"></div>');
              document.querySelector('.pc-menu-overlay')?.addEventListener('click', () => {
                rm_menu();
              });
            }
          }
        });
      }
    };

    const rm_menu = () => {
      const tempList = document.querySelector('.pc-sidebar');
      if (tempList) {
        tempList.classList.remove('mob-sidebar-active');
      }
      if (document.querySelector('.topbar')) {
        document.querySelector('.topbar')?.classList.remove('mob-sidebar-active');
      }
      document.querySelector('.pc-sidebar .pc-menu-overlay')?.remove();
      document.querySelector('.topbar .pc-menu-overlay')?.remove();
    };

    const openFullscreen = () => {
      const elem = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari y Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // Internet Explorer/Edge
        elem.msRequestFullscreen();
      }
    };

    const closeFullscreen = () => {
      const doc = document as Document & {
        mozCancelFullScreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };

      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { // Firefox
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { // Chrome, Safari y Opera
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { // Internet Explorer/Edge
        doc.msExitFullscreen();
      }
    };

    const initializeDropdowns = () => {
      const dropdownElement = document.getElementById('dropdownMenuButton') as HTMLElement;
      if (dropdownElement) {
        new Dropdown(dropdownElement);
      }
    };

    onMounted(() => {
      initializeSidebarToggle();
      initializeDropdowns();
    });

    const goToHomeAdmin = () => {
      router.push({ name: 'Home_Admin' });
    };

    return {
      layoutChange,
      rm_menu,
      openFullscreen,
      closeFullscreen,
      Usuario,
      goToHomeAdmin
    };
  },
});
</script>

<style lang="scss" scoped>
/* Tu estilo aquí */
</style>
