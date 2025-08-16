import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Slider, ReordenarSlidersRequest } from '../interfaces/slider.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const SliderService = {
  /**
   * Lista todos los sliders
   */
  async listar() {
    try {
      const response = await api.get(`${API_REST}WebSliders/ListarWebSliders`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener los sliders.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de sliders:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista solamente los sliders activos
   */
  async listarActivos() {
    try {
      const response = await api.get(`${API_REST}WebSliders/ListarWebSliders_activos`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener los sliders.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de sliders activos:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Lista los sliders ordenados
   */
  async listarOrdenados() {
    try {
      const response = await api.get(`${API_REST}WebSliders/ListarOrdenados`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error desconocido al obtener los sliders ordenados.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de sliders ordenados:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Reordena los sliders
   */
  async reordenarSliders(data: ReordenarSlidersRequest) {
    try {
      const response = await api.put(`${API_REST}WebSliders/ReordenarSliders`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al reordenar los sliders:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Obtiene un slider por su ID
   */
  async obtener(id: number) {
    try {
      const response = await api.get(`${API_REST}WebSliders/getWebSlider/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el slider por ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Crea un nuevo slider
   */
  async crear(sliderData: Slider) {
    try {
      const response = await api.post(`${API_REST}WebSliders/addWebSlider`, sliderData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar slider:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza un slider existente
   */
  async actualizar(sliderData: Slider) {
    try {
      const response = await api.put(`${API_REST}WebSliders/ActualizarWebSlider/${sliderData.id}`, sliderData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el slider ID ${sliderData.id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Actualiza el estado de un slider (activo/inactivo)
   */
  async actualizarEstado(id: number, estado: string) {
    try {
      const response = await api.put(`${API_REST}WebSliders/ActualizarStadoSlider/${id}`, { estado }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado del slider ID ${id}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Elimina un slider por su ID
   */
  async eliminar(id: number) {
    try {
      const response = await api.delete(`${API_REST}WebSliders/delWebSlider/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el slider ID ${id}:`, error);
      throw handleApiError(error);
    }
  }
};

export default SliderService;