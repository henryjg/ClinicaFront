import { EVOLTA_API_BASE, EVOLTA_CREDENTIALS } from '../config';
import { 
  EvoltaAuthResponse, 
  EvoltaClienteData, 
  EvoltaClienteValidado 
} from '../interfaces/EvoltaInterfaces';
import Alerta from '../utils/alertas';
import { handleApiError } from '../utils/ApiErrorHandler';

/**
 * Servicio para interactuar con la API externa de Evolta
 */
const EvoltaService = {
  
  /**
   * Genera un token de autenticación para la API de Evolta
   * @returns Promise<string> Token de acceso
   */
  async generarToken(): Promise<string> {
    try {
      const response = await fetch(`${EVOLTA_API_BASE}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: EVOLTA_CREDENTIALS.username,
          password: EVOLTA_CREDENTIALS.password,
          grant_type: 'password'
        })
      });

      if (!response.ok) {
        throw new Error(`Error en autenticación: ${response.status} ${response.statusText}`);
      }

      const authData: EvoltaAuthResponse = await response.json();
      
      if (!authData.access_token) {
        throw new Error('No se pudo obtener el token de acceso');
      }

      return authData.access_token;
    } catch (error) {
      console.error('Error al generar token Evolta:', error);
      throw handleApiError(error);
    }
  },

  // VALIDAR CLIENTE
  async validarCliente(documento: string): Promise<EvoltaClienteValidado> {
    try {
      // Obtener token de autenticación
      const token = await this.generarToken();
      
      // Consultar datos del cliente
      const clientUrl = `${EVOLTA_API_BASE}/api/operacioncomercial/cliente?documento=${documento}`;
      
      const response = await fetch(clientUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error en consulta de cliente: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      
      // Verificar si no se encontró información
      if (responseText === '"No se encontro Informacion"') {
        Alerta.Advertencia('Cliente Inválido','No se encontró información para el número de documento proporcionado');
      }

      // Intentar parsear JSON
      let clientData: EvoltaClienteData;
      try {
        clientData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Respuesta de la API no es válida: ${responseText}`);
      }

      // Validar estructura de datos
      if (!clientData || typeof clientData !== 'object' || !clientData.nroDocumentoTitular) {
        throw new Error('No se encontraron datos válidos para el DNI proporcionado');
      }

      // Generar código de verificación
      const codigoverificacion = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      const prefijo = Math.floor(Math.random() * (8888 - 5000 + 1)) + 5000;
      const sufijo = Math.floor(Math.random() * (99 - 60 + 1)) + 60;

      // Estructurar respuesta
      const resultado: EvoltaClienteValidado = {
        nrodocumento: clientData.nroDocumentoTitular,
        tipodocumento: clientData.tipoDocumentoTitular,
        nombreCompleto: clientData.nombreCompleto,
        correo: clientData.correoElectronico,
        telefono: clientData.telefonoCelular,
        estadoOC: clientData.operacionComercial?.[0]?.estadoOC ?? "N/A",
        codigo: `${prefijo}${codigoverificacion}${sufijo}`,
        genero: clientData.genero
      };

      return resultado;
    } catch (error) {
      console.error('Error al validar cliente:', error);
      throw handleApiError(error);
    }
  },

  //OBTENER DATOS DEL CLIENTE
  async obtenerDatosCliente(documento: string): Promise<EvoltaClienteData> {
    try {
      const token = await this.generarToken();
      
      const clientUrl = `${EVOLTA_API_BASE}/api/operacioncomercial/cliente?documento=${documento}`;
      
      const response = await fetch(clientUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error en consulta: ${response.status}`);
      }

      const responseText = await response.text();
      
      if (responseText === '"No se encontro Informacion"') {
        throw new Error('Cliente no encontrado');
      }

      const clientData: EvoltaClienteData = JSON.parse(responseText);
      
      if (!clientData?.nroDocumentoTitular) {
        throw new Error('Datos de cliente inválidos');
      }

      return clientData;
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      throw handleApiError(error);
    }
  }
};

export default EvoltaService;
