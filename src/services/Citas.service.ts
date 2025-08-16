import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Citas } from '../interfaces/citas.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const CitasService = {
  /**
   * Lista todas las citas disponibles (activas e inactivas)
   */
  async listarTodas() {
    try {
      const response = await api.get(`${API_REST}Citas/ListarTodasCitas`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las citas:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista solo las citas activas
   */
  async listarActivas() {
    try {
      const response = await api.get(`${API_REST}Citas/ListarCitasActivas`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de citas activas:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista las citas de un negocio específico
   */
  async listarPorNegocio(idNegocio: number) {
    try {
      const response = await api.get(`${API_REST}Citas/ListarCitas_negocio/${idNegocio}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener citas del negocio ID ${idNegocio}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista las citas de una categoría específica
   */
  async listarPorCategoria(idCategoria: number) {
    try {
      const response = await api.get(`${API_REST}Citas/ListarCitasPorCategoria/${idCategoria}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener citas por categoría ID ${idCategoria}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene una cita por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}Citas/getCita/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la cita ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Crea una nueva cita
   */
  async crear(citaData: Citas) {
    try {
      const response = await api.post(`${API_REST}Citas/addCita`, citaData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error("Error al agregar la cita:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza una cita existente
   */
  async actualizar(CrearCita: Citas) {
    try {
      const response = await api.put(`${API_REST}Citas/ActualizarCita/${CrearCita.id}`, CrearCita, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la cita ID ${CrearCita.id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina una cita
   */
  async eliminar(idCita: number) {
    try {
      const response = await api.delete(`${API_REST}Citas/delCita/${idCita}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la cita ID ${idCita}:`, error);
      throw handleApiError(error);
    }
  },

    /**
   * Exporta la lista de citas a Excel
   */
  async exportarExcelCitas() {
    try {
      const response = await api.get(`${API_REST}Citas/ListarTodasCitas`);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Error desconocido al obtener las citas.");
      }
    } catch (error) {
      console.error("Error al obtener la lista de citas en excel:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza el estado de una cita (activo/inactivo)
   */
  async actualizarEstado(id: number, estado: string) {
    try {
      const response = await api.put(`${API_REST}Citas/modificarEstado_Cita/${id}`, { estado }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado de la cita con ID ${id}:`, error);
      throw handleApiError(error);
    }
  }
};



export default CitasService;