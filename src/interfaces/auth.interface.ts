// src/interfaces/auth.interface.ts
// Interfaces para autenticación

export interface LoginRequest {
  usuarioNombre: string;
  pass: string;
}

export interface UsuarioRequest {
  usuarioNombre: string;
}

export interface LoginApiResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    expiration: string;
    user: UserApiData;
  };
  message: string;
  timestamp: string;
  version: string;
}

export interface UserApiData {
  id: number;
  usuario: string;
  nombreusuario: string;
  fotoperfil: string;
  correo: string;
  celular: string;
  idrol: number | string; // Permitir tanto número como string del backend
  oficina_id: string;
  oficina_nombre: string;
  idusuario: number;
  lastconexion: string;
  nroingresos: number;
  rol: string;
  tipoUsuario: string;
}

export interface RefreshTokenRequest {
  userId: string;
  refreshToken: string;
}

// Response para refresh token
export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;  // Cambio de 'token' a 'accessToken' según la respuesta del API
    refreshToken: string;
  };
  message: string;
  timestamp: string;
  version: string;
}
