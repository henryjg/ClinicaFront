export interface Pregunta {
  id: number;
  orden: number;
  pregunta: string;
  descripcion: string;
  estado:string;
}

export const initializePregunta = (): Pregunta => {
  return {
    id: 0,
    orden: 0,
    pregunta: '',
    descripcion: '',
    estado: '',
  };
};

export interface PreguntaErrors {
    id: string;
    orden: string;
    pregunta: string;
    descripcion: string;
    estado: string;
    }

export const initializePreguntaErrors = (): PreguntaErrors => {
    return {
        id: '',
        orden: '',
        pregunta: '',
        descripcion: '',
        estado: '',
    };
    }