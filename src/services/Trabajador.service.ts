// src/stores/trabajadorStore.ts
import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Trabajador, CrearTrabajador } from '../interfaces/trabajador.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const TrabajadorService = {
  /**
   * Crea un nuevo trabajador
   */
  async crear(trabajador: CrearTrabajador) {
    try {
      // Enviar el objeto directamente, sin envolverlo en { requestTrabajador: ... }
      const response = await api.post(`${API_REST}Trabajadores/AgregarTrabajador`, trabajador, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar el trabajador:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista todos los trabajadores
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}Trabajadores/ListaTrabajadores`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de trabajadores:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina un trabajador por su ID
   */
  async eliminar(id: number) {
    try {
      const response = await api.delete(`${API_REST}Trabajadores/EliminarTrabajador/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el trabajador:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene un trabajador por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}Trabajadores/GetTrabajador/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el trabajador:", error);
      throw handleApiError(error);
    }
  },
  

  /**
   * Obtiene trabajadores de una oficina específica
   */
  async listarPorOficina(oficinaId: number) {
    try {
      const response = await api.get(`${API_REST}Trabajadores/ListaTrabajadoresPorOficina/${oficinaId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener trabajadores de la oficina:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza un trabajador existente
   */
  async actualizar(id: number, trabajadorData: Partial<Trabajador>) {
    try {
      const response = await api.put(`${API_REST}Trabajadores/ActualizarTrabajador/${id}`, trabajadorData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el trabajador con ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

    /**
   * Exporta la lista de trabajadores a Excel
   */
  async exportarExcelTrabajador() {
    try {
      const response = await api.get(`${API_REST}Trabajadores/ListaTrabajadores`);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Error desconocido al obtener los trabajadores.");
      }
    } catch (error) {
      console.error("Error al obtener la lista de trabajadores en excel:", error);
      throw handleApiError(error);
    }
  },

   async EnviarCorreoBienvenida(id: number) {
      try {
        const response = await api.post(`${API_REST}Trabajadores/EnviarCorreoBienvenida/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error al contactar trabajador:", error);
        throw handleApiError(error);
      }
    },

  /**
   * Actualiza el estado del trabajador (Activo/Inactivo)
   */
  async actualizarEstado(id: number, estado: string) {
    try {
      const response = await api.put(`${API_REST}Trabajadores/ModificarEstadoTrabajador/${id}`, { estado }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del trabajador con ID ${id}:`, error);
      throw handleApiError(error);
    }
  },  /**
   * @deprecated Usar useEmail composable en su lugar
   * Envía un correo de bienvenida al trabajador
   */
  // async enviarCorreoBienvenida(correo: string, nombrecompleto: string) {
  //   // Redirigir al composable useEmail
  //   const { useEmail } = await import('../composables/useEmail');
  //   const { enviarBienvenidaTrabajador } = useEmail();
  //   return await enviarBienvenidaTrabajador(correo, nombrecompleto);
  // },

  // Gestión de imágenes agrupada lógicamente
  perfil: {
    /**
     * Actualiza la foto de perfil del trabajador
     */
    async actualizarFoto(id: number, fotoPerfil: string) {
      try {
        const response = await api.patch(`${API_REST}Trabajadores/ActualizarFotoPerfil/${id}`, { fotoPerfil }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar la foto de perfil del trabajador con ID ${id}:`, error);
        throw handleApiError(error);
      }
    },    /**
     * Sube una nueva foto de perfil
     */
    async subirFoto(formData: FormData) {
      try {
        const response = await api.post('/files/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error al subir foto de perfil:", error);
        throw handleApiError(error);
      }
    }
  }
};

export default TrabajadorService;

