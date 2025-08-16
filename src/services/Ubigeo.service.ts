import { api } from './axiosConfig';
import { API_REST } from '../config';
// import { Ubigeo } from '../interfaces/ubigeo.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const UbigeoService = {
  /**
   * Lista todo el ubigeo
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}Ubigeo/Todo`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener ubigeo.');
      }
    } catch (error) {
      console.error('Error al obtener ubigeo:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista departamentos
   */
  async listarDepartamentos() {
    try {
      const response = await api.get(`${API_REST}Ubigeo/Departamentos`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener los departamentos.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de departamentos:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene provincia por departamento
   */
 async obtenerProvincias(departamento: string) {
    try {
      const response = await api.get(`${API_REST}Ubigeo/ProvinciaDistrito/${departamento}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener las provincias.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de provincias activos:', error);
      throw handleApiError(error);
    }
  },

  
};

export default UbigeoService;