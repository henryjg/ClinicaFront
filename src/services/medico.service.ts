import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Medico } from '../interfaces/medico.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const MedicoService = {
  /**
   * Obtiene un medico por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}Medico/GetMedico_id/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener medico:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene un medico por su número de documento
   */
  async obtenerPorDocumento(nrodocumento: string) {
    try {
      const response = await api.get(`${API_REST}Medico/GetMedico_documento/${nrodocumento}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el medico:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene medicos de una especialidad específica
   */
  async listarPorOficina(especialidadId: number) {
    try {
      const response = await api.get(`${API_REST}Medico/ListaMedicosPorEspecialidad/${especialidadId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener Medicos de especialidad:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista todos los medicos disponibles
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}Medico/ListaMedicos`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener lista de medicos:", error);
      throw handleApiError(error);
    }
  },

    /**
   * Lista todos los medicos completo
   */
  async listarCompleto(id: number) {
    try {
      const response = await api.get(`${API_REST}Medico/Completo/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener lista de medicos:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Crea un nuevo medico
   */
  async crear(medico: Medico) {
    try {
      const response = await api.post(`${API_REST}Medico/AgregarMedico`, medico, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar el Medico:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina un medico por su ID
   */
  async eliminar(id: number) {
    try {
      const response = await api.delete(`${API_REST}Medico/EliminarMedico/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el Medico:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza un medico existente
   */
  async actualizar(id: number, medicoData: Partial<Medico>) {
    try {
      const response = await api.put(`${API_REST}Medico/ActualizarMedico/${id}`, medicoData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el Medico con ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza el estado del medico (Activo/Inactivo)
   */
  async actualizarEstado(id: number, estado: boolean) {
    try {
      const response = await api.patch(`${API_REST}Medico/ActualizarEstado/${id}`, { estado }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del Medico con ID ${id}:`, error);
      throw handleApiError(error);
    }
  },
  /**
   * Obtiene un medico por su ID
   */
  async EnviarCorreoBienvenida(id: number) {
    try {
      const response = await api.post(`${API_REST}Medico/EnviarCorreoBienvenida/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al contactar medico:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene un medico por su ID
   */
  async VerificarCodigoCorreo(id: number, codigo: string) {
    try {
      const response = await api.put(`${API_REST}Medico/VerificarCodigoCorreo/${id}`, codigo, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al contactar medico:", error);
      throw handleApiError(error);
    }
  },


  // Gestión de imágenes agrupada lógicamente
  perfil: {
    /**
     * Actualiza la foto de perfil del medico
     */
   
    async actualizarFoto(id: number, fotoPerfil: string) {
      try {
        const response = await api.patch(`${API_REST}Medico/ActualizarFotoPerfil/${id}`, { fotoPerfil }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar la foto de perfil del Medico con ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Sube una nueva foto de perfil
     */
    async subirFoto(formData: FormData) {
      try {
        // Corregido para usar el endpoint correcto para subir imágenes
        const response = await api.post(`/api/files/upload/image`, formData, {
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

export default MedicoService;

