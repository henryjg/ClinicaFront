// src/composables/useAuth.ts
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { LoginRequest } from '../interfaces/auth.interface';
import Notif from '../utils/notificaciones';
import Alerta from '../utils/alertas';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Estados reactivos locales
  const isLoading = ref(false);
  const loginError = ref('');

  // Computeds
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const userInfo = computed(() => authStore.userInfo);
  const currentUser = computed(() => authStore.usuarioLogueado);
  // Funciones de utilidad para roles
  const roles = {
    Cliente: 1,
    Trabajador: 2, 
    Negocio: 3,
    Administrador: 4
  } as const;

  const hasRole = (roleName: keyof typeof roles) => {
    return currentUser.value.idrol === roles[roleName];
  };

  const isCliente = computed(() => hasRole('Cliente'));
  const isTrabajador = computed(() => hasRole('Trabajador'));
  const isNegocio = computed(() => hasRole('Negocio'));
  const isAdministrador = computed(() => hasRole('Administrador'));

  // Funciones de autenticación
  // const login_cli_tra_neg = async (usuarioNombre: string) => {
  //   isLoading.value = true;
  //   loginError.value = '';    try {
  //     const credentials: LoginRequest = { usuarioNombre , pass };
  //     await authStore.login(credentials);
      
  //     // Si llegamos aquí, el login fue exitoso
  //     Notif.Success('¡Bienvenido! Has iniciado sesión correctamente');
      
  //     // Redirigir según el rol
  //     const userRole = authStore.usuarioLogueado.idrol;

      
  //     switch (userRole) {
  //       case roles.Administrador:
  //         router.push('/office/home_admin');
  //         break;
  //       case roles.Trabajador:
  //         router.push('/beneficios/');
  //         break;
  //       case roles.Negocio:
  //         router.push('/office/');
  //         break;
  //       case roles.Cliente:
  //         router.push('/beneficios/');
  //         break;
  //       default:
  //         router.push('/');
  //     }
      
  //     return { success: true };
  //   } catch (error: any) {
  //     console.error('Error en login:', error);
  //     const errorMessage = error.response?.data?.message || 
  //                         error.message || 
  //                         'Error al iniciar sesión';
  //     loginError.value = errorMessage;
  //     Alerta.Error('Error de Autenticación', errorMessage);
  //     throw error;
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  // Funciones de autenticación
  const login = async (usuarioNombre: string, pass: string) => {
    isLoading.value = true;
    loginError.value = '';    try {
      const credentials: LoginRequest = { usuarioNombre , pass };
      await authStore.login(credentials);
      
      // Si llegamos aquí, el login fue exitoso
      Notif.Success('¡Bienvenido! Has iniciado sesión correctamente');
      
      // Redirigir según el rol
      const userRole = authStore.usuarioLogueado.idrol;

      
      switch (userRole) {
        case roles.Administrador:
          router.push('/office/home_admin');
          break;
        case roles.Trabajador:
          router.push('/beneficios/');
          break;
        case roles.Negocio:
          router.push('/office/');
          break;
        case roles.Cliente:
          router.push('/beneficios/');
          break;
        default:
          router.push('/');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      loginError.value = errorMessage;
      Alerta.Error('Error de Autenticación', errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const login_sindireccionar = async (usuarioNombre: string, pass: string) => {
    isLoading.value = true;
    loginError.value = '';    try {
      const credentials: LoginRequest = { usuarioNombre , pass };
      await authStore.login(credentials);
      // Si llegamos aquí, el login fue exitoso
      Notif.Success('¡Bienvenido! Has iniciado sesión correctamente');
      return { success: true };
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      loginError.value = errorMessage;
      Alerta.Error('Error de Autenticación', errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };


  const login_sindoc = async (usuarioNombre: string, tipoUsuario: string) => {
    isLoading.value = true;
    loginError.value = '';    try {
      await authStore.login_sindocstore(usuarioNombre, tipoUsuario);
      
      // Si llegamos aquí, el login fue exitoso
      Notif.Success('¡Bienvenido! Has iniciado sesión correctamente');
      
      // Redirigir según el rol
      const userRole = authStore.usuarioLogueado.idrol;

      
      switch (userRole) {
        case roles.Administrador:
          router.push('/office/home_admin');
          break;
        case roles.Trabajador:
          router.push('/beneficios/');
          break;
        case roles.Negocio:
          router.push('/office/');
          break;
        case roles.Cliente:
          router.push('/beneficios/');
          break;
        default:
          router.push('/');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      loginError.value = errorMessage;
      Alerta.Error('Error de Autenticación', errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      authStore.logout();
      Notif.Success('Sesión Cerrada');  // Cambiar de info a Success
      router.push('/beneficios/loggin/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  const checkSession = () => {
    // Verificar si hay token y no está expirando
    return authStore.isAuthenticated && !authStore.isTokenExpiringSoon();
  };

  // Funciones de navegación protegida
  const requireAuth = (redirectTo: string = '/beneficios/loggin/') => {
    if (!isAuthenticated.value) {
      Alerta.Error('Acceso Restringido', 'Debes iniciar sesión para acceder a esta página');
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireRole = (roleName: keyof typeof roles, redirectTo: string = '/') => {
    if (!requireAuth()) return false;
    
    if (!hasRole(roleName)) {
      Alerta.Error('Acceso Denegado', 'No tienes permisos para acceder a esta página');
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  // Funciones para gestión de perfil (simplificadas)
  const updateProfile = (userData: Partial<typeof currentUser.value>) => {
    // Actualizar directamente en el authStore
    Object.assign(authStore.usuarioLogueado, userData);
    authStore.saveToLocalStorage();
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    // Esta función se implementará cuando tengas el endpoint correspondiente
    throw new Error('Función no implementada aún');
  };
  // Función utilitaria para debugging
  const debugRoles = () => {
    console.log('🔍 Debug de Roles:');
    console.log('Usuario actual:', currentUser.value);
    console.log('ID de rol:', currentUser.value.idrol);
    console.log('Tipo de idrol:', typeof currentUser.value.idrol);
    console.log('Roles disponibles:', roles);
    console.log('Validaciones de rol:');
    console.log('- Es Cliente:', isCliente.value);
    console.log('- Es Trabajador:', isTrabajador.value);
    console.log('- Es Negocio:', isNegocio.value);
    console.log('- Es Administrador:', isAdministrador.value);
  };

  return {
    // Estado
    isLoading,
    loginError,
    
    // Computeds
    isAuthenticated,
    userInfo,
    currentUser,
    isCliente,
    isTrabajador,
    isNegocio,
    isAdministrador,
    
    // Funciones de autenticación
    login,
    login_sindireccionar,
    login_sindoc,
    logout,
    checkSession,
    
    // Funciones de autorización
    hasRole,
    requireAuth,
    requireRole,
    
    // Funciones de perfil
    updateProfile,
    changePassword,
    
    // Constantes
    roles,
    
    // Debugging
    debugRoles
  };
}
