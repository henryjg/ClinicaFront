import { api } from './axiosConfig';
import { handleApiError } from '../utils/ApiErrorHandler';
import { API_REST } from '../config';

const ServidorArchivosService = {
 
  /**
   * Sube un archivo PDF al servidor
   */
  async subirArchivo(formData: FormData) {
    try {
      const response = await api.post(`${API_REST}files/upload/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error al subir archivo al servidor:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Sube una imagen al servidor
   */
  async subirImagen(formData: FormData) {
    try {
      const response = await api.post(`${API_REST}files/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error al subir imagen al servidor:", error);
      throw handleApiError(error);
    }
  },

};

export default ServidorArchivosService;

