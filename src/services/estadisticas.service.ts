import { api } from './axiosConfig';
import { API_REST } from '../config';
import { Estadisticas } from '../interfaces/estadisticas.interface';
import { handleApiError } from '../utils/ApiErrorHandler';

const EstadisticasService = {
  /**
   * Obtiene las estadísticas
   */
   async generales(tipoUsuario: string) {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Generales?TipoUsuario=${tipoUsuario}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async porPeriodo(tipoPeriodo: string) {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Generales?TipoPeriodo/${tipoPeriodo}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async analisisComportamiento() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/AnalisisComportamiento`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async dashboardResumen() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Dashboard/Resumen`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async dashboardResumenSimple() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Dashboard/ResumenSimple`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async dashboardGraficos(tipoGrafico: string) {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Dashboard/Graficos/${tipoGrafico}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async comparar() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Comparar`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async metricasRapidas() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/Metricas/Rapidas`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async exportarCupones() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/ExportarCupones`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async exportarCuponesCSV() {
    try {
      const response = await api.get(`${API_REST}Estadisticas/ExportarCupones/CSV`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default EstadisticasService;