import axios from 'axios';
import { handleApiError } from '../utils/ApiErrorHandler';
import type { PersonaNatural, PersonaJuridica } from '../interfaces/sunat.interface';
import { API_PeruDev } from '../config';

// Detectar si estamos en desarrollo
const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
const BASE_URL = isDev ? '/api/external' : 'https://api.apis.net.pe';

// Crear una instancia específica de axios para APIs externas
const externalApiClient = axios.create({
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  }
});

// Interceptor para manejo de errores
externalApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en API externa:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

const ApiSunatService = {  /**
   * Obtiene datos de una persona por su DNI usando el endpoint externo
   */
  async obtenerDatosPorDni(dni: string): Promise<PersonaNatural> {
    try {
      const response = await externalApiClient.get(`${BASE_URL}/v2/reniec/dni?numero=${dni}`, {
        headers: {
          'Authorization': `Bearer ${API_PeruDev}`,
        }
      });
      
      // Mapear la respuesta a la interfaz PersonaNatural
      const data = response.data;
      return {
        nombres: data.nombres ?? '',
        apellidoPaterno: data.apellidoPaterno ?? '',
        apellidoMaterno: data.apellidoMaterno ?? '',
        numeroDocumento: data.numeroDocumento ?? dni,
        digitoVerificador: data.digitoVerificador ?? '',
      };
    } catch (error) {
      console.error(`❌ Error al obtener datos del DNI ${dni}:`, error);
      throw handleApiError(error);
    }
  },
  /**
   * Obtiene datos de una empresa por su RUC usando el endpoint externo
   */
  async obtenerDatosPorRuc(ruc: string): Promise<PersonaJuridica> {
    try {
      const response = await externalApiClient.get(`${BASE_URL}/v2/sunat/ruc/full?numero=${ruc}`, {
        headers: {
          'Authorization': `Bearer ${API_PeruDev}`,
        }
      });
      
      // Mapear la respuesta a la interfaz PersonaJuridica
      const data = response.data;
      return {
        razonSocial: data.razonSocial ?? '',
        numeroDocumento: data.numeroDocumento ?? ruc,
        estado: data.estado ?? '',
        condicion: data.condicion ?? '',
        direccion: data.direccion ?? '',
        ubigeo: data.ubigeo ?? '',
      };
    } catch (error) {
      console.error(`❌ Error al obtener datos del RUC ${ruc}:`, error);
      throw handleApiError(error);
    }
  }
};

export default ApiSunatService;