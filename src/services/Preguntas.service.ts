import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Pregunta } from '../interfaces/preguntas.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const PreguntasService = {
  /**
   * Lista todos las preguntas
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}Preguntas/ListarPreguntas`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener las preguntas.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de preguntas:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene pregunta por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}Preguntas/getPreguntas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener las preguntas por ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Crea un nueva pregunta
   */
  async crear(preguntaData: Pregunta) {
    try {
      const response = await api.post(`${API_REST}Preguntas/addPregunta`, preguntaData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar pregunta:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza una pregunta existente
   */
  async actualizar(preguntaData: Pregunta) {
    try {
      const response = await api.put(`${API_REST}Preguntas/ActualizarPregunta/${preguntaData.id}`, preguntaData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la pregunta ID ${preguntaData.id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina una pregunta por su ID
   */
  async eliminar(id: number) {
    try {
      const response = await api.delete(`${API_REST}Preguntas/EliminarPregunta/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar pregunta con ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza el orden de las preguntas
   */
  async actualizarOrden(id: number, orden:number) {
    try {
      const response = await api.put(`${API_REST}Preguntas/actualizar-orden/${id}`, { orden },  {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el orden de las preguntas:', error);
      throw handleApiError(error);
    }
  },
};

export default PreguntasService;