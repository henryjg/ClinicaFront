import { api } from './axiosConfig';
import { API_REST } from '../config';
import { UsuarioCrear } from '../interfaces/usuarios.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const UsuariosService = {
  /**
   * Inicia sesión de usuario
   */
  async iniciarSesion(usuario: string, pass: string) {
    try {

      const response = await api.post(`${API_REST}auth/login`, {
        usuarioNombre: usuario,
        pass: pass
      });
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesion:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Valida un cliente por su número de documento
   */  async validarClienteDocumento(nrodocumento: string) {
    try {
      const response = await api.post('/validation/cliente', {
        documentos: nrodocumento
      });
      return response.data;
    } catch (error) {
      console.error("Error al validar cliente:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Valida un cliente por su número de documento
   */  
  async VerificarCodigoCorreo(idusuario: string,codigo:string) {
    
    try {
      const response = await api.put(
        `${API_REST}Cliente/VerificarCodigoCorreo/${idusuario}`, {codigo  }
      );
      return response.data;
    } catch (error) {
      console.error("Error al validar cliente:", error);
      throw handleApiError(error);
    }
  },
  
  /**
   * Cambia la contraseña de un usuario
   */
  async cambiarContrasena(id: string, nuevaPassword: string) {
    try {
      const response = await api.put(
        `${API_REST}Usuarios/ActualizarPassword/${id}`,
        null,
        {
          params: { nuevaPassword },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene la lista de todos los usuarios
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}Usuarios/ListaUsuarios`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener los usuarios.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene un usuario por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}Usuarios/GetUsuario/${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al usuario.');
      }
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Crea un nuevo usuario
   */
  async crear(usuario: UsuarioCrear) {
    try {
      const response = await api.post(`${API_REST}Usuarios/CrearUsuario`, usuario, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar al usuario:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina un usuario por su ID
   */
  async eliminar(id: number) {
    try {
      const response = await api.delete(`${API_REST}Usuarios/EliminarUsuario/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar al usuario ${id}:`, error);
      throw handleApiError(error);
    }
  }
};

export default UsuariosService;









