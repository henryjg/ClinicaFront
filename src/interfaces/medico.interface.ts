export interface Medico {
    id: number;
    numero_contacto: string;
    nombre: string;
    apellido: string;
    email: string;
    estado: string;
    celular: string;
    foto: string;
    especialidad_id: number;
}


    export const initializeMedico = (): Medico => {
      return {
        id: 0,
        numero_contacto: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: '',
        celular: '',
        foto: '',
        especialidad_id: 0,
      };
       
    };

    export interface MedicoErrors {
        id: string;
        numero_contacto: string;
        nombre: string;
        apellido: string;
        email: string;
        estado: string;
        celular: string;
        foto: string;
        especialidad_id: string;
    }

    export const initializeMedicoErrors = (): MedicoErrors => {
      return {
        id: '',
        numero_contacto: '',
        nombre: '',
        apellido: '',
        email: '',
        estado: '',
        celular: '',
        foto: '',
        especialidad_id: '',
      };
    };