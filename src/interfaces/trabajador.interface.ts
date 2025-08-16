export interface Trabajador {
    id: number;
    dni: string;
    nombre: string;
    apePaterno: string;
    apeMaterno: string;
    email: string;
    celular: string;
    fotoPerfil: string;
    fechaNacimiento: string;
    fechaIngreso: string;
    estado: boolean;
    fechabaja: string | null;  // Puede ser null si el trabajador no tiene fecha de baja
    fecharegistro: string;
    cargo:string;
    genero:string;
    lastconexion:string;
    nroingresos:number;
    oficinaId: number;
    nombreOficina: string;
    usuarioId: number;
    rol: string;
    usuario: string;
    nrofamiliares:number;
    nrocupones:number;
  }
  
  export const initializeTrabajador = (): Trabajador => {
    return {
      id: 0,
      dni: '',
      nombre: '',
      apePaterno: '',
      apeMaterno: '',
      email: '',
      celular: '',
      fotoPerfil: '',
      fechaNacimiento: '',
      fechaIngreso: '',
      estado: true,
      fechabaja: null,
      fecharegistro: '',
      cargo:'',
      genero:'',
      lastconexion:'',
      nroingresos:0,
      oficinaId: 0,
      nombreOficina: '',
      usuarioId: 0,
      rol: '1',
      usuario: '',
      nrofamiliares:0,
      nrocupones:0,
    };
  };

export interface TrabajadorErrors {
  id: string;
  dni: string;
  nombre: string;
  apePaterno: string;
  apeMaterno: string;
  email: string;
  celular: string;
  fotoPerfil: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  estado: string;
  fechabaja: string;
  fecharegistro: string;
  cargo: string;
  genero: string;
  lastconexion: string;
  nroingresos: string;
  oficinaId: string;
  nombreOficina: string;
  usuarioId: string;
  rol: string;
  usuario: string;
  nrofamiliares: string;
  nrocupones: string;
}

export const initializeTrabajadorErrors = (): TrabajadorErrors => {
  return {
    id: '',
    dni: '',
    nombre: '',
    apePaterno: '',
    apeMaterno: '',
    email: '',
    celular: '',
    fotoPerfil: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    estado: '',
    fechabaja: '',
    fecharegistro: '',
    cargo: '',
    genero: '',
    lastconexion: '',
    nroingresos: '',
    oficinaId: '',
    nombreOficina: '',
    usuarioId: '',
    rol: '',
    usuario: '',
    nrofamiliares: '',
    nrocupones: '',
  };
};

export interface CrearTrabajador {
  dni: string;
  nombre: string;
  apePaterno: string;
  apeMaterno: string;
  email: string;
  celular: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  cargo: string;
  genero: string;
  fotoPerfil: string; // Si el backend requiere una foto de perfil al crear, de lo contrario, puedes eliminar este campo
  oficinaId: number;
  // Agrega aquí otros campos requeridos por el backend si es necesario
}

export const initializeCrearTrabajador = (): CrearTrabajador => ({
  dni: '',
  nombre: '',
  apePaterno: '',
  apeMaterno: '',
  email: '',
  celular: '',
  fechaNacimiento: '',
  fechaIngreso: '',
  cargo: '',
  genero: '',
  fotoPerfil: '', // Si el backend requiere una foto de perfil al crear, de lo contrario, puedes eliminar este campo
  oficinaId: 0,
  // Agrega aquí otros campos requeridos por el backend si es necesario
});
