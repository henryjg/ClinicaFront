// utils/listas.ts

export interface MenuItem {
  tipe: string;
  text: string;
  icon: string;
  route: string;
  role_ids?: number[];  
}



export const menuItems: MenuItem[] = [

  {
    tipe: 'titulo',
    text: 'Operaciones',
    icon: '',
    route: '', 
    // role_ids: [1,3]
  },

  //---------------------------------------------------
  //---------------------------------------------------
  // PERFIL NEGOCIOS ----------------------------------

  {
    tipe: 'link',
    text: 'Mi Negocio',
    icon: ' ph-duotone ph-buildings',
    route: '/office/minegocio_detalles',
    role_ids: [ 3 ] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Mis Ofertas',
    icon: ' ph-duotone ph-shopping-cart',
    route: '/office/minegocio_ofertas',
    role_ids: [ 3 ] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Mis Convenios',
    icon: ' ph-duotone ph-certificate',
    route: '/office/minegocio_convenios',
    role_ids: [ 3 ] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Mis Sedes',
    icon: ' ph-duotone ph-push-pin',
    route: '/office/minegociosedes',
    role_ids: [ 3 ] // Visible para Administrador y Licencias
  },
  {
    tipe: 'titulo',
    text: 'Cupones',
    icon: '',
    route: '',  
    role_ids: [3]
  },
  
  {
    tipe: 'link',
    text: 'Pendientes',
    icon: ' ph-duotone ph-shopping-cart',
    route: '/office/cuponespendientes',
    role_ids: [ 3 ] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Canjeados',
    icon: ' ph-duotone ph-shopping-cart',
    route: '/office/cuponescanjeados',
    role_ids: [ 3 ] // Visible para Administrador y Licencias
  },

  //---------------------------------------------------
  //---------------------------------------------------
  //---------------------------------------------------
  // PERFIL TRABAJADORES ADMINISTRADOR  ----------------------------------

  {
    tipe: 'link',
    text: 'Agenda',
    icon: ' fas fa-calendar-alt',
    route: '/office/agenda',
    role_ids: [1, 4] // Visible para Administrador y Licencias
  },

  {
    tipe: 'link',
    text: 'Citas',
    icon: 'fas fa-solid fa-calendar-check',
    route: '/office/citas_lista',
    role_ids: [1, 4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Medicos',
    icon: 'fas fa-solid fa-user-md',
    route: '/office/medico_lista',
    role_ids: [1, 4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Pacientes',
    icon: 'fas fa-solid fa-user-injured',
    route: '/office/pacientes_lista',
    role_ids: [1, 4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Triaje',
    icon: 'fas fa-solid fa-stethoscope',
    route: '/office/triaje_medico',
    role_ids: [1, 4] // Visible para Administrador y Licencias
  },

  {
    tipe: 'link',
    text: 'Medicamentos',
    icon: 'fas fa-solid fa-pills',
    route: '/office/medicamentos',
    role_ids: [4] // Visible para Administrador y Licencias
  },

  //---------------------------------------------------
  // CONFIGURACION
  //---------------------------------------------------
    {
    tipe: 'link',
    text: 'Antecedentes',
    icon: 'fas fa-solid fa-file-medical',
    route: '/office/antecedentes',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Alergias',
    icon: 'fas fa-solid fa-person-dots-from-line',
    route: '/office/alergias',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Vacunas',
    icon: 'fas fa-solid fa-syringe',
    route: '/office/vacunas',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Funciones Biológicas',
    icon: 'fas fa-solid fa-cogs',
    route: '/office/funciones',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Constantes Vitales',
    icon: 'fas fa-solid fa-heartbeat',
    route: '/office/constantes',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Síntomas',
    icon: 'fas fa-solid fa-head-side-cough',
    route: '/office/sintomas',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Diagnostico',
    icon: 'fas fa-solid fa-diagnoses',
    route: '/office/diagnosticos',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Examenes',
    icon: 'fas fa-solid fa-exam',
    route: '/office/examenes',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Servicios',
    icon: 'fas fa-solid fa-concierge-bell',
    route: '/office/servicios',
    role_ids: [4] // Visible para Administrador y Licencias
  },
// ------------------------------------------------------------------
  {
    tipe: 'titulo',
    text: 'Cupones',
    icon: '',
    route: '',  
    role_ids: [4]
  },
  {
    tipe: 'link',
    text: 'Pedientes',
    icon: 'fas fa-solid fa-hourglass-half',
    route: '/office/vercuponespendientes',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  {
    tipe: 'link',
    text: 'Utilizados',
    icon: 'fas fa-solid fa-check',
    route: '/office/vercuponesusados',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  //---------------------------------------------------
  //---------------------------------------------------
  {
    tipe: 'titulo',
    text: 'Control',
    icon: '',
    route: '',  
    role_ids: [1,3]
  },
  
 
  {
    tipe: 'link',
    text: 'Oficina',
    icon: 'fas fa-box',
    route: '/office/oficina',
    role_ids: [1, 4]  // Solo visible para Administrador
  },
  // {
  //   tipe: 'link',
  //   text: 'Sliders',
  //   icon: 'fas fa-image',
  //   route: '/office/SliderPrincipal',
  //   role_ids: [1, 4] // Visible para Administrador y Licencias
  // },
  
  // {
  //   tipe: 'link',
  //   text: 'Categorias',
  //   icon: 'fas fa-list',
  //   route: '/office/categoria',
  //   role_ids: [1, 4]  // Solo visible para Administrador
  // },
  {
    tipe: 'link',
    text: 'Novedades',
    icon: 'fas fa-file',
    route: '/office/pagina',
    role_ids: [1, 4]  // Solo visible para Administrador
  },
  // {
  //   tipe: 'link',
  //   text: 'Proyectos IMP',
  //   icon: 'fas fa-home',
  //   route: '/office/PubliLink',
  //   role_ids: [1, 4]  // Solo visible para Administrador
  // },
  {
    tipe: 'link',
    text: 'Pagina Web',
    icon: 'fas fa-solid fa-window-maximize',
    route: '/office/editarcampos',
    role_ids: [4] // Visible para Administrador y Licencias
  },
  // {
  //   tipe: 'link',
  //   text: 'Preguntas Frecuentes',
  //   icon: '',
  //   route: '/office/preguntas',
  //   role_ids: [4] // Visible para Administrador y Licencias
  // },
   {
    tipe: 'link',
    text: 'Usuarios',
    icon: 'fas fa-solid fa-user',
    route: '/office/usuarios_lista',
    role_ids: [4] // Visible para Administrador y Licencias
  },
     {
    tipe: 'link',
    text: 'Medico Editar',
    icon: 'fas fa-solid fa-user',
    route: '/office/medico_editar',
    role_ids: [4] // Visible para Administrador y Licencias
  },
];
