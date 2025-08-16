import { initializeTrabajadorErrors, TrabajadorErrors } from '../../interfaces/trabajador.interface';
import { useValidator } from './useValidator';

export function useValidaTrabajador() {
  const reglas = {
    dni: (value: any) => !!value || 'DNI es requerido',
    nombre: (value: any) => !!value || 'Nombre es requerida',
    apePaterno: (value: any) => !!value || 'Apellido Paterno es requerido',
    apeMaterno: (value: any) => !!value || 'Apellido Materno es requerido',
    email: (value: any) => !!value || 'Email es requerido',  
    celular: (value: any) => !!value || 'Celular es requerido',
    cargo: (value: any) => !!value || 'Cargo es requerido',
    fechaNacimiento: (value: any) => !!value || 'Fecha de nacimiento es requerido',
    fechaIngreso: (value: any) => !!value || 'Fecha de ingreso es requerido',
    oficinaId: (value: any) => !!value && value !== 0 || 'Oficina es requerido',
  };

  return useValidator<TrabajadorErrors>(
    initializeTrabajadorErrors, 
    reglas
  );
}
