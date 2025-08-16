// src/composables/AuthValidate.ts
// DEPRECATED: Este archivo mantiene compatibilidad con el sistema anterior
// Se recomienda migrar a useAuth() para nuevas implementaciones
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from './useAuth';
import { initializeUsuarioLogueado, UsuarioLogueado } from '../interfaces/usuario.interface';
import Notif from '../utils/notificaciones';
// import { ClienteCrear, initializeClienteCrear, initializeValidarCliente, ValidarCliente } from '../interfaces/medicamento.interface';
import NProgress from 'nprogress';
// import { ClienteService, UsuariosService, EvoltaService } from '../services/_services';
import Alerta from '../utils/alertas';
import { useErrorHandler } from './Tools/useErrorHandler';
import { RefSymbol } from '@vue/reactivity';


export function usarAutenticacion() {
  const auth   = useAuth();
  const router = useRouter();
  const { handleError } = useErrorHandler();

  // Estados reactivos para compatibilidad
  const estadologin = ref("");
  const msj_loggin = ref("");
  const iserror = ref(false);
  const secuencia = ref(0);
  const nrodocumento_a_validar = ref("");
  const isloading = ref(false);
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');

  const IdClienteRegistrado=ref('');

  // Referencias para compatibilidad con el sistema anterior
  const UsuarioLogueado = ref<UsuarioLogueado>(initializeUsuarioLogueado());
  // const ClienteValidado = ref<ValidarCliente>(initializeValidarCliente());

  // const nuevoCliente = ref<ClienteCrear>(initializeClienteCrear());
  
  const CorreoClienteActual = ref("");

  // Sincronizar con el nuevo sistema
  watch(() => auth.currentUser.value, (newUser) => {
    UsuarioLogueado.value = newUser;
  }, { immediate: true });

  // Computeds para compatibilidad
  const Usuario = computed(() => auth.currentUser.value);

  // Usar roles del nuevo sistema
  const roles = auth.roles;
  // Funciones de autenticación (delegadas al nuevo sistema)
  const login = async (username: string, contrasena: string) => {
    try {
      isloading.value = true;
      msj_loggin.value = "";
      iserror.value = false;

      const loginResponse = await auth.login(username, contrasena);
      // Si llegamos aquí, el login fue exitoso
      Notif.Success(`¡Hola ${auth.currentUser.value.nombreusuario}!`);
      return { success: true };
    } catch (error: any) {
      iserror.value = true;
      msj_loggin.value = error.message || 'Error al iniciar sesión';
      throw error;
    } finally {
      isloading.value = false;
    }
  };

  const login_sindireccionar = async (username: string, contrasena: string) => {
    try {
      isloading.value = true;
      msj_loggin.value = "";
      iserror.value = false;

      const loginResponse = await auth.login_sindireccionar(username, contrasena);
      // Si llegamos aquí, el login fue exitoso
      Notif.Success(`¡Hola ${auth.currentUser.value.nombreusuario}!`);
      return { success: true };
    } catch (error: any) {
      iserror.value = true;
      msj_loggin.value = error.message || 'Error al iniciar sesión';
      throw error;
    } finally {
      isloading.value = false;
    }
  };



  const login_solodocumento = async (username: string, tipouser:string) => {
    try {
      isloading.value = true;
      msj_loggin.value = "";
      iserror.value = false;

      const loginResponse = await auth.login_sindoc(username, tipouser);
      // Si llegamos aquí, el login fue exitoso
      Notif.Success(`¡Hola ${auth.currentUser.value.nombreusuario}!`);
      return { success: true };
    } catch (error: any) {
      iserror.value = true;
      msj_loggin.value = error.message || 'Error al iniciar sesión';
      throw error;
    } finally {
      isloading.value = false;
    }
  };

  // const login_cli_tra_neg = async (username: string) => {
  //   try {
  //     isloading.value = true;
  //     msj_loggin.value = "";
  //     iserror.value = false;

  //     const loginResponse = await auth.login(username);
  //     // Si llegamos aquí, el login fue exitoso
  //     Notif.Success(`¡Hola ${auth.currentUser.value.nombreusuario}!`);
  //     return { success: true };
  //   } catch (error: any) {
  //     iserror.value = true;
  //     msj_loggin.value = error.message || 'Error al iniciar sesión';
  //     throw error;
  //   } finally {
  //     isloading.value = false;
  //   }
  // };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      // console.error('Error al cerrar sesión:', error);
    }
  };

  // Funciones de validación de cliente
  // const validar_Cliente = async () => {
  //   try {
  //     isloading.value = true;
  //     NProgress.start();
  //     if (!nrodocumento_a_validar.value) {
  //       return false 
  //     }
  //     const response = await EvoltaService.validarCliente(nrodocumento_a_validar.value);
  //     if (!response) {
  //       throw new Error('Cliente no encontrado');
  //     }else {
  //       ClienteValidado.value = response;
  //       let gen = "";
  //       if(ClienteValidado.value.genero==="Masculino"){
  //             gen= "M";
  //       }else{
  //           gen= "F";
  //       }
  //       ClienteValidado.value.genero = gen;
        
  //       secuencia.value++;
        
  //     } 
  //   } catch (error: any) {
  //     handleError(error,true);
  //   } finally {
  //     isloading.value = false;
  //     NProgress.done();
  //   }
  // };

  // const Registrar_Cliente = async () => {
  //   try {
  //     isloading.value = true;
  //     NProgress.start();

  //     nuevoCliente.value = {
  //         tipoDocumentoTitular: "DNI",
  //         nroDocumentoTitular: ClienteValidado.value.nrodocumento,
  //         nombreCompleto: ClienteValidado.value.nombreCompleto,
  //         celular: ClienteValidado.value.telefono,
  //         correo: "henry.julca@accom.pe",
  //         genero: ClienteValidado.value.genero,
  //     };
  //     const result = await crearCliente(nuevoCliente.value);
  //     if (result) {
  //         IdClienteRegistrado.value = result;
  //         secuencia.value++;
  //     }
  //   } catch (error: any) {
  //     handleError(error,true);
  //   } finally {
  //     isloading.value = false;
  //     NProgress.done();
  //   }
  // };

  //   const Actualizar_Verificar_Correo = async (idusuario:string, codigo:string) => {
  //     if (idusuario === '' || codigo === '') {
  //       return false;
  //     }
  //       try {
  //         isloading.value = true;
  //         NProgress.start();
          
  //         const response = await UsuariosService.VerificarCodigoCorreo(idusuario, codigo);
          
  //         if (response.success) {
  //           secuencia.value++;
  //           Notif.Success('El cliente se ha registrado correctamente');
  //           return response.data;
  //         } else {
  //           throw new Error(response.message || 'Error al crear cliente');
  //         }
  //       } catch (error: any) {
  //         handleError(error);
  //         throw error;
  //       } finally {
  //         isloading.value = false;
  //         NProgress.done();
  //       }
  //   };
    

  // const crearCliente = async (clienteData: ClienteCrear) => {
  //   try {
  //     isloading.value = true;
  //     NProgress.start();
      
  //     const response = await ClienteService.crear(clienteData);
      
  //     if (response.success) {
  //       Notif.Success('El cliente se ha registrado correctamente');
  //       return response.data;
  //     } else {
  //       throw new Error(response.message || 'Error al crear cliente');
  //     }
  //   } catch (error: any) {
  //     handleError(error);
  //     throw error;
  //   } finally {
  //     isloading.value = false;
  //     NProgress.done();
  //   }
  // };


  // const cambiarContrasena = async (passwordActual: string, passwordNueva: string) => {
  //   try {
  //     isloading.value = true;
  //     NProgress.start();

  //     // Usa idusuario para el usuario general
  //     const user = auth.currentUser.value;
  //     const usuarioId = user.idusuario ?? user.id; // fallback a id si no existe idusuario

  //     const response = await UsuariosService.cambiarContrasena(
  //       usuarioId.toString(),
  //       passwordNueva
  //     );

  //     if (response.success) {
  //       Notif.Success('Tu contraseña se ha cambiado correctamente');
  //       return response;
  //     } else {
  //       throw new Error(response.message || 'Error al cambiar contraseña');
  //     }
  //   } catch (error: any) {
  //     handleError(error);
  //     throw error;
  //   } finally {
  //     isloading.value = false;
  //     NProgress.done();
  //   }
  // };

  //   const cambiarPass = async (userId: string, nuevaPassword: string) => {
  //     try {
  //       isloading.value = true;
  //       NProgress.start();
  
  //       const response = await UsuariosService.cambiarContrasena(userId, nuevaPassword);
  
  //       if (response.success) {
  //         Notif.Success('La contraseña se ha cambiado correctamente');
  //         return response;
  //       } else {
  //         throw new Error(response.message || 'Error al cambiar la contraseña');
  //       }
  //     } catch (error: any) {
  //       handleError(error);
  //       throw error;
  //     } finally {
  //       isloading.value = false;
  //       NProgress.done();
  //     }
  //   };

  // Función wrapper para compatibilidad con componentes que usan variables reactivas
  // const changePassword = async () => {
  //   if (!newPassword.value || !confirmPassword.value) {
  //     throw new Error('Todos los campos son obligatorios');
  //   }
  //   if (newPassword.value !== confirmPassword.value) {
  //     throw new Error('Las contraseñas no coinciden');
  //   }
  //   return await cambiarContrasena('', newPassword.value);
  // };

  // Funciones de utilidad
  const checkUserRole = (requiredRole: keyof typeof roles) => {
    return auth.hasRole(requiredRole);
  };

  const requireAuth = () => {
    return auth.requireAuth();
  };

  const redirectByRole = () => {
    const userRole = auth.currentUser.value.idrol;
    switch (userRole) {
      case roles.Administrador:
      case roles.Trabajador:
      case roles.Negocio:
        router.push('/office/');
        break;
      case roles.Cliente:
        router.push('/beneficios/');
        break;
      default:
        router.push('/');
    }
  };

  return {
    // Estado (compatibilidad)
    Usuario,
    UsuarioLogueado,
    // ClienteValidado,
    CorreoClienteActual,
    estadologin,
    msj_loggin,
    iserror,
    secuencia,
    nrodocumento_a_validar,
    isloading,
    currentPassword,
    newPassword,
    confirmPassword,
    // Registrar_Cliente,

    // Funciones de autenticación
    login,
    login_solodocumento,
    login_sindireccionar,
    logout,
    IdClienteRegistrado,

    // Funciones de cliente
    // validar_Cliente,
    // crearCliente,    // Funciones de perfil
    // cambiarContrasena,
    // changePassword, // Para compatibilidad con componentes que usan variables reactivas
    // cambiarPass, // Para compatibilidad con componentes que usan variables reactivas
    // Funciones específicas para compatibilidad
    // guardarCliente_validado: crearCliente,

    // Funciones de utilidad
    checkUserRole,
    requireAuth,
    redirectByRole,

    // Constantes
    roles,

    // Nuevas funciones (delegadas)
    isAuthenticated: auth.isAuthenticated,
    hasRole: auth.hasRole,
    checkSession: auth.checkSession,
    // Actualizar_Verificar_Correo
  };
}

