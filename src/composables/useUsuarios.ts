import { ref } from 'vue';
import { UsuariosService } from '../services/_services';
import { Usuario, initializeUsuario, UsuarioCrear, initializeUsuarioCrear, initializeUsuarioCrearErrors } from '../interfaces/_interface';
import { Alerta } from '../utils/_utils';
import { useValidaUsuarios } from './Validaciones/useValidaUsuarios';
import { useOperacion } from './Tools/useOperacion';

export function useUsuario() {
  // Estado reactivo
  const listaUsuarios = ref<Usuario[]>([]);
  const NuevoUsuario = ref<UsuarioCrear>(initializeUsuarioCrear());
  const usuario = ref<Usuario>(initializeUsuario());
  
  // Estados de carga
  const isLoading_Usuarios = ref(false);
  
  // Importar validaciones y operaciones
  const { errors, validarFormulario } = useValidaUsuarios();
  const { ejecutar } = useOperacion();
  /**
   * Carga la lista de usuarios
   */
  const Listar_Usuarios = async () => {
    return ejecutar(
      () => UsuariosService.listar(),
      {
        indicadorCarga: isLoading_Usuarios,
        onExito: (response: any) => {
          listaUsuarios.value = response || [];
        }
      }
    );
  };
  /**
   * Registra un nuevo usuario
   */
  const Crear_Usuario = async (): Promise<boolean> => {
    if (!validarFormulario(NuevoUsuario.value)) return false;

    // Extraer solo los campos necesarios
    const usuarioARegistrar: UsuarioCrear = {
      usuarioNombre: NuevoUsuario.value.usuarioNombre,
      pass: NuevoUsuario.value.pass,
    };

    const resultado = await ejecutar(
      () => UsuariosService.crear(usuarioARegistrar),
      {
        indicadorCarga: isLoading_Usuarios,
        onExito: async (response: any) => {
          if (response.success) {
            NuevoUsuario.value = initializeUsuarioCrear();
            await Listar_Usuarios();
          } else {
            throw new Error(response.message || 'Error al registrar usuario');
          }
        },
        mensajeExito: 'Usuario registrado con éxito'
      }
    );

    return !!resultado;
  };
  /**
   * Elimina un usuario
   */
  const Eliminar_Usuario = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar este usuario?',
      'Esta acción no se puede deshacer.'
    );
    
    if (!isConfirmado) return;

    return ejecutar(
      () => UsuariosService.eliminar(id),
      {
        indicadorCarga: isLoading_Usuarios,
        onExito: async (response: any) => {
          if (response.success) {
            await Listar_Usuarios();
          } else {
            throw new Error(response.message || 'Error al eliminar usuario');
          }
        },
        mensajeExito: 'Usuario eliminado con éxito'
      }
    );
  };  /**
   * Elimina un usuario del DOM y de la lista
   */
  const eliminarFilaUsuario = async (id: number, eliminarDelServidor: boolean = true) => {
   

      const isConfirmado = await Alerta.Confirmacion(
        '¿Estás seguro de que deseas eliminar este usuario?',
        'Esta acción no se puede deshacer.'
      );
      
      if (!isConfirmado) return;
      
      // Si se requiere eliminar del servidor primero
      if (eliminarDelServidor) {
        const resultado = await UsuariosService.eliminar(id);
        if (!resultado.success) return false;
      }

      // Eliminar del DOM si existe
      const fila = document.getElementById(`tr_usuario_${id}`);
      if (fila) {
        fila.remove();
      }
      
      // Eliminar del array reactivo local (por si acaso)
      const index = listaUsuarios.value.findIndex(u => u.id === id);
      if (index > -1) {
        listaUsuarios.value.splice(index, 1);
      }
      
      return true;
  };

  /**
   * Carga un usuario específico por ID
   */
  const Obtener_Usuario = async (id: number) => {
    return ejecutar(
      () => UsuariosService.obtener(id),
      {
        indicadorCarga: isLoading_Usuarios,
        onExito: (response: any) => {
          usuario.value = response || initializeUsuario();
        }
      }
    );
  };

  /**
   * Actualiza una oferta existente
   */



  // Función de reset del formulario
  const resetFormulario = () => {
    NuevoUsuario.value = initializeUsuarioCrear();
    errors.value = initializeUsuarioCrearErrors();
  };


  return {
    // Estados reactivos
    listaUsuarios,
    NuevoUsuario,
    usuario,
    errors,
    
    // Estados de carga
    isLoading_Usuarios,
    Listar_Usuarios,
    Crear_Usuario,
    Eliminar_Usuario,
    Obtener_Usuario,
    eliminarFilaUsuario,
    resetFormulario
  };
}
