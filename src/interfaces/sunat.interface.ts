// Interfaz para Persona Jurídica
export interface PersonaJuridica {
    razonSocial: string;
    numeroDocumento: string;
    estado: string;
    condicion: string;
    direccion: string;
    ubigeo: string;
  }
  
  // Función para inicializar Persona Jurídica
  export const initializePersonaJuridica = (): PersonaJuridica => {
    return {
      razonSocial: '',
      numeroDocumento: '',
      estado: '',
      condicion: '',
      direccion: '',
      ubigeo: ''
    };
  };
  
  // Interfaz para Persona Natural
  export interface PersonaNatural {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    numeroDocumento: string;
    digitoVerificador: string;
  }
  
  // Función para inicializar Persona Natural
  export const initializePersonaNatural = (): PersonaNatural => {
    return {
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      numeroDocumento: '',
      digitoVerificador: ''
    };
  };
  