// Interfaces para el sistema Evolta
export interface EvoltaAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface EvoltaClienteData {
  nroDocumentoTitular: string;
  tipoDocumentoTitular: string;
  nombreCompleto: string;
  correoElectronico: string;
  telefonoCelular: string;
  genero: string;
  operacionComercial: Array<{
    estadoOC: string;
    [key: string]: any;
  }>;
}

export interface EvoltaClienteValidado {
  nrodocumento: string;
  tipodocumento: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  estadoOC: string;
  codigo: string;
  genero: string;
}

export interface EmailTemplateData {
  nombre: string;
  codigo?: string;
  correo: string;
}
