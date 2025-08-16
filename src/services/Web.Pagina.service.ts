import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Pagina } from '../interfaces/pagina.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const WebPaginaService = {
  /**
   * Lista todas las páginas disponibles
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}Paginas`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener la lista de páginas:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene una página por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}Paginas/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la página ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Crea una nueva página
   */
  async crear(pagina: Pagina) {
    try {
      const response = await api.post(`${API_REST}Paginas`, pagina, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar página:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza una página existente
   */
  async actualizar(pagina: Pagina) {
    try {
      const response = await api.put(`${API_REST}Paginas/${pagina.id}`, pagina, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la página ID ${pagina.id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina una página por su ID
   */
  async eliminar(id: number) {
    try {
      const response = await api.delete(`${API_REST}Paginas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar la página:", error);
      throw handleApiError(error);
    }
  },

  // Métodos de actualización parcial agrupados
  campos: {
    /**
     * Actualiza el nombre de la página
     */
    async actualizarNombre(id: number, nombre: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/nombre`, { NombrePagina: nombre }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar el nombre de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Actualiza las políticas de privacidad
     */
    async actualizarPoliticas(id: number, politicas: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/politicas`, { politicasprivacidad: politicas }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar políticas de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Actualiza los términos y condiciones
     */
    async actualizarTerminos(id: number, terminos: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/terminos`, { terminosycondiciones: terminos }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar términos de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Actualiza el enlace de Facebook
     */
    async actualizarFacebook(id: number, facebook: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/facebook`, { linkfacebook: facebook }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar Facebook de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Actualiza el enlace de Instagram
     */
    async actualizarInstagram(id: number, instagram: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/instagram`, { linkinstagram: instagram }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar Instagram de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Actualiza el teléfono de contacto
     */
    async actualizarTelefono(id: number, telefono: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/telefono`, { telefonocontacto: telefono }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar teléfono de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    },

    /**
     * Actualiza el celular de contacto
     */
    async actualizarCelular(id: number, celular: string) {
      try {
        const response = await api.patch(`${API_REST}Paginas/${id}/celular`, { celularcontacto: celular }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al actualizar celular de la página ID ${id}:`, error);
        throw handleApiError(error);
      }
    }
  }
};

export default WebPaginaService;