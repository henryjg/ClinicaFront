
// Interfaz para el usuario logueado en la aplicación
export interface UsuarioLogueado {
  id: number;
  usuario: string;
  nombreusuario: string;
  fotoperfil: string;
  correo: string;
  celular: string;
  idrol: number;
  oficina_id: string;
  oficina_nombre: string;
  idusuario: number;
  lastconexion: string;
  nroingresos: number;
  cambiocontrasenia: boolean;
  rol: string;
  tipoUsuario: string;
}

export const initializeUsuarioLogueado = (): UsuarioLogueado => {
  return {
    id: 0,
    usuario: '',
    nombreusuario: '',
    fotoperfil: '',
    correo: '',
    celular: '',
    idrol: 0,
    oficina_id: '',
    oficina_nombre: '',
    idusuario: 0,
    lastconexion: '',
    nroingresos: 0,
    cambiocontrasenia: true,
    rol: '',
    tipoUsuario: ''
  };
};

