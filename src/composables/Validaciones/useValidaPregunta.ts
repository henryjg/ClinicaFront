import { initializePreguntaErrors, PreguntaErrors } from '../../interfaces/preguntas.interface';
import { useValidator } from './useValidator';

export function useValidaPregunta() {
  const reglas = {
    pregunta: (value: any) => !!value || 'La pregunta es requerida',
    descripcion: (value: any) => !!value || 'La descripción es requerida',
    // id: (value: any) => true, // Si quieres validar id, agrega aquí
  };

  return useValidator<PreguntaErrors>(
    initializePreguntaErrors,
    reglas
  );
}
