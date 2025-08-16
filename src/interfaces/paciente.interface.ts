export interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  tiposeguro_id: number;
  foto: string;
  estado: string;
  email: string;
  celular: string;
  celular2: string;
  direccion: string;
  distritoid: number;
}

export const initializePaciente = (): Paciente => {
  return {
    id: 0,
    nombre: '',
    apellidos: '',
    dni: '',
    tiposeguro_id: 0,
    foto: '',
    estado: '',
    email: '',
    celular: '',
    celular2: '',
    direccion: '',
    distritoid: 0,
  };
};

 

export interface PacienteError {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  tiposeguro_id: string;
  foto: string;
  estado: string;
  email: string;
  celular: string;
  celular2: string;
  direccion: string;
  distritoid: string;
}

export const initializePacienteError = (): PacienteError => {
  return {
    id: '',
    nombre: '',
    apellidos: '',
    dni: '',
    tiposeguro_id: '',
    foto: '',
    estado: '',
    email: '',
    celular: '',
    celular2: '',
    direccion: '',
    distritoid: '',
  };
};
