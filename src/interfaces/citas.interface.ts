// Interfaz base con campos comunes para ofertas
export interface Citas {
  id: number;
  estado: string;
  entidad_id: number;
  consultorio_id: number;
  horario_id: number;
  medico_id: number;
  historia_id: number;
  nro_cons: number;
  nombre_paciente: string;
  hora_inicio: string;
  hora_fin: string;
  horario_medico_id: number;
  paciente_id: number;
}

export const initializeCitas = (): Citas => {
      return {
        id: 0,
        estado: '',
        entidad_id: 0,
        consultorio_id: 0,
        horario_id: 0,
        medico_id: 0,
        historia_id: 0,
        nro_cons: 0,
        nombre_paciente: '',
        hora_inicio: '',
        hora_fin: '',
        horario_medico_id: 0,
        paciente_id: 0,
      };
    };

// Interfaz para errores de validación
export interface CitasErrors {
  id: string;
  estado: string;
  entidad_id: string;
  consultorio_id: string;
  horario_id: string;
  medico_id: string;
  historia_id: string;
  nro_cons: string;
  nombre_paciente: string;
  hora_inicio: string;
  hora_fin: string;
  horario_medico_id: string;
  paciente_id: string;
}

// Inicializadores
export const initializeCitasErrors = (): CitasErrors => ({
  id: '',
  estado: '',
  entidad_id: '',
  consultorio_id: '',
  horario_id: '',
  medico_id: '',
  historia_id: '',
  nro_cons: '',
  nombre_paciente: '',
  hora_inicio: '',
  hora_fin: '',
  horario_medico_id: '',
  paciente_id: '',
});

