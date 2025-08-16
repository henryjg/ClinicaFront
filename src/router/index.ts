import { createRouter, createWebHistory, RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import HomeView from '../views/VistaAdministrador.vue'
import { useAuthStore } from '../stores/authStore';
import { addStyle, removeStyle } from '../utils/stylesManager';
import { usePaginaStore } from '../stores/paginaStore';
import { useAuth } from '../composables/useAuth';
import { initializeUsuarioLogueado, UsuarioLogueado } from '../interfaces/usuario.interface';
import { computed, ref } from 'vue';
// import Operaciones from '../views/VistaOperacionesDigitales.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/office',
    name: 'office_admin',
    component: HomeView,
    meta: { requiresAuth: true, style: '' },
    children: [
      {
        path: 'home_admin',
        name: 'Home_Admin',
        component: () => import('../views/administrador/home_admin.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'usuarios_lista',
        name: 'ListaUsuarios',
        component: () => import('../views/administrador/usuarios_lista.vue'),
        // props: true,
        meta: { requiresAuth: true },
      },
         {
        path: 'agenda',
        name: 'Agenda',
        component: () => import('../views/administrador/agenda.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'citas_lista',
        name: 'ListaCitas',
        component: () => import('../views/administrador/citas_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'medico_lista',
        name: 'ListaMedicos',
        component: () => import('../views/administrador/medico_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'pacientes_lista',
        name: 'ListaPacientes',
        component: () => import('../views/administrador/pacientes_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'triaje_medico',
        name: 'TriajeMedico',
        component: () => import('../views/administrador/triaje_medico.vue'),
        meta: { requiresAuth: true },
      },
   
      //------------------------------------------------------------------------------------
      //CONFIGURACION---------------------------------------------------------------------
      //------------------------------------------------------------------------------------
    {
        path: 'antecedentes',
        name: 'Antecedentes',
        component: () => import('../views/administrador/configuracion/antecedentes_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'alergias',
        name: 'Alergias',
        component: () => import('../views/administrador/configuracion/alergias_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'vacunas',
        name: 'Vacunas',
        component: () => import('../views/administrador/configuracion/vacunas_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'funciones',
        name: 'Funciones',
        component: () => import('../views/administrador/configuracion/funcionesB_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'constantes',
        name: 'Constantes',
        component: () => import('../views/administrador/configuracion/constantesV_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'sintomas',
        name: 'Sintomas',
        component: () => import('../views/administrador/configuracion/sintomas_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'diagnosticos',
        name: 'Diagnosticos',
        component: () => import('../views/administrador/configuracion/diagnosticos_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'examenes',
        name: 'Examenes',
        component: () => import('../views/administrador/configuracion/examenes_lista.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'medicamentos',
        name: 'Medicamentos',
        component: () => import('../views/administrador/configuracion/medicamentos.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'servicios',
        name: 'Servicios',
        component: () => import('../views/administrador/configuracion/servicios_lista.vue'),
        meta: { requiresAuth: true },
      },

      //------------------------------------------------------------------------------------
      //MODULO TRABAJADOR ---------------------------------------------------------------------
      //------------------------------------------------------------------------------------
       {
        path: 'medico_editar',
        name: 'MedicoEditar',
        component: () => import('../views/administrador/medico_editar.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'SliderPrincipal',
        component: () => import('../views/administrador/slider_lista.vue'),
        meta: { requiresAuth: true },
      },
      
      // {
      //   path: 'editarslider/:id',
      //   name: 'EditarSlider',
      //   component: () => import('../components/modal_edit_slide.vue'),
      //   // props: true,
        // meta: { requiresAuth: true },
      // },
      // {
      //   path: 'editarcategoria/:id',
      //   name: 'EditarCategoria',
      //   component: () => import('../components/modal_editar_categoria.vue'),
      //   // props: true,
        // meta: { requiresAuth: true },
      // },
      // {
      //   path: 'EditarNegocio/:id',
      //   name: 'editarNegocio',
      //   component: () => import('../views/administrador/negocio_editar.vue'),
      //   props: true,
      // meta: { requiresAuth: true },
      // },
    ]
  },
  {
    path: '/beneficios',
    name: 'ApBeneficios',
    component: () => import('../views/VistaBeneficios.vue'),
    meta: { style: '/src/assets/css/landing.css' },
    beforeEnter: async (to, from, next) => {
      const paginaStore = usePaginaStore();
      if (!paginaStore.pagina) {
        await paginaStore.almacenaPagina();
      }
      next();
    },
    children: [
      {
        path: '/beneficios',
        name: 'Inicio',
        component: () => import('../views/beneficios/inicio.vue')
      },
      {
        path: 'loggin',
        name: 'Loggin',
        component: () => import('../views/beneficios/loggin.vue'),
      },
      {
        path: 'generarpassword',
        name: 'GenerarPassword',
        component: () => import('../views/beneficios/loggin_generarpass.vue'),
      },
      {
        path: 'recuperarpassword',
        name: 'RecuperarPassword',
        component: () => import('../views/beneficios/loggin_recuperar_pass.vue'),
      },
      {
        path: 'ofertas',
        name: 'Ofertas',
        component: () => import('../views/beneficios/oferta_categorias.vue')
      },
      {
        path: 'negocio',
        name: 'Negocio',
        component: () => import('../views/beneficios/negocio_lista.vue')
      },
      {
        path: 'negociodetalle/:id',
        name: 'NegocioDetalle',
        component: () => import('../views/beneficios/negocio_detalle.vue')
      },
      {
        path: 'ofertadetalle/:id',
        name: 'OfertaDetalle',
        component: () => import('../views/beneficios/oferta_detalle.vue')
      },

      {
        path: 'oferta_categoria/:id',
        name: 'OfertaCategoria',
        component: () => import('../views/beneficios/ofertas_categoriaId.vue')
      },
      {
        path: 'cuenta',
        name: 'Cuenta',
        component: () => import('../views/beneficios/perfil.vue'),
        children:[
          {
            path: 'misdatos',
            name: 'MisDatos',
            component: () => import('../views/beneficios/perfil_misdatos.vue')
          },
          {
            path: 'misfamiliares',
            name: 'MisFamiliares',
            component: () => import('../views/beneficios/perfil_familiares.vue')
          },
          {
            path: 'miscupones',
            name: 'MisCupones',
            component: () => import('../views/beneficios/perfil_ofertasActivas.vue')
          },
          {
            path: 'miscuponesusados',
            name: 'MisCuponesUsados',
            component: () => import('../views/beneficios/perfil_ofertasUsadas.vue')
          },
        
        ]

      },
      {
        path: 'novedades',
        name: 'Novedades',
        component: () => import('../views/beneficios/noticia_list.vue')
      },
      {
        path: 'novedades/:id/:titulo?',
        name: 'NovedadesTitulo',
        component: () => import('../views/beneficios/noticia_view.vue')
      },
      {
        path: 'carrito',
        name: 'Carrito',
        component: () => import('../views/beneficios/ListaOfertasCupones.vue')
      },
      {
        path: 'politicasyprivacidad',
        name: 'PoliticasyPrivacidad',
        component: () => import('../views/beneficios/PoliticasyPrivacidad.vue')
      },
      {
        path: 'terminosycondiciones',
        name: 'TerminosyCondiciones',
        component: () => import('../views/beneficios/TerminosyCondiciones.vue')
      },
      {
        path: 'cumple',
        name: 'Cumple',
        component: () => import('../views/beneficios/cumpleanos_view.vue')
      },
      {
        path: 'preguntasfrecuentes',
        name: 'PreguntasFrecuentes',
        component: () => import('../views/beneficios/preguntas_frecuentes.vue')
      },
    ]
  },
  {
    path: '/portal',
    name: 'Home',
    component: () => import('../views/VistaPrincipal.vue'),
    meta: { style: '/src/assets/css/landing.css' },
    beforeEnter: async (to, from, next) => {
      const paginaStore = usePaginaStore();
      if (!paginaStore.pagina) {
        await paginaStore.almacenaPagina();
      }
      next();
    },
    children: [
      {
        path: '/',
        name: 'Bienvenida',
        component: () => import('../views/home/home.vue')
      },
      {
        path: 'pagosenlinea',
        name: 'PagosEnLinea',
        component: () => import('../views/home/enconstruccion.vue')
      },
      {
        path: 'tramites',
        name: 'Tramites',
        component: () => import('../views/home/enconstruccion.vue')
      },
    ]
  },
  {
    path: '/verificacion/:id',
    name: 'Verificacion',
    component: () => import('../views/beneficios/verified.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/home/pagina_404.vue') // Aquí importas tu componente de 404
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { left: 0, top: 0 };
    }
  }
});

let sessionCheckInterval: NodeJS.Timeout | null = null;

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Limpiar el intervalo si no estamos en una ruta protegida
  if (sessionCheckInterval && !to.matched.some(record => record.meta.requiresAuth)) {
    clearInterval(sessionCheckInterval);
    sessionCheckInterval = null;
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verificar si el usuario está logueado y el token es válido
    const isSessionValid = authStore.checkSession();
    if (!isSessionValid) {
      next({ name: 'Loggin' });
      return;
    }

    const usuario = authStore.usuarioLogueado;
    if (usuario.idrol === 1 || usuario.idrol === 2) {
      next({ name: 'Cuenta' });
      return;
    }

    // Iniciar un intervalo para verificar el token periódicamente solo en rutas protegidas
    if (!sessionCheckInterval) {
      sessionCheckInterval = setInterval(() => {
        const isSessionValid = authStore.checkSession();
        if (!isSessionValid) {
          clearInterval(sessionCheckInterval!);
          sessionCheckInterval = null;
          router.push({ name: 'Loggin' });
        }
      }, 24000); // Verificar cada 240 segundos (4Minutos)
    }

    next();
  } else {
    next();
  }
});


router.afterEach((to, from) => {
  const toParent = to.matched[0]?.meta?.style as string | undefined;
  const fromParent = from.matched[0]?.meta?.style as string | undefined;
  if (fromParent && fromParent !== toParent) {
    removeStyle(fromParent);
  }
  if (toParent && toParent !== fromParent) {
    addStyle(toParent);
  }
});

export default router;
