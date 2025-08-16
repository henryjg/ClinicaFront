// src/services/Auth.service.ts
import { api } from './axiosConfig';
import { API_REST } from '../config';
import { 
  LoginRequest, 
  LoginApiResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse 
} from '../interfaces/auth.interface';

const AuthService = {

  /**
   * Inicia sesión en el sistema
   */
  async verificarUsuario(credentials: LoginRequest): Promise<LoginApiResponse> {
    try {
      const response = await api.post<LoginApiResponse>(
        `/auth/verificarUsuario`, 
        credentials
      );
      
      if (response.data?.success) {
        console.log('✅ Login exitoso');
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error de conexión en login');
    }
  },

  /**
   * Inicia sesión en el sistema
   */
  async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    try {
      const response = await api.post<LoginApiResponse>(
        `/auth/login`, 
        credentials
      );
      
      if (response.data?.success) {
        console.log('✅ Login exitoso');
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error de conexión en login');
    }
  },

  /**
   * Inicia sesión en el sistema
   */
  async login_sindoc_Services(user: string, tipoUsu: string): Promise<LoginApiResponse> {
    try {
      const response = await api.post<LoginApiResponse>(
        `/auth/verificarUsuarioPorTipo`, 
        { nroDocumento: user, tipoUsuario:tipoUsu }
      );
      
      if (response.data?.success) {
        console.log('✅ Login exitoso');
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error de conexión en login');
    }
  },

  /**
   * Renueva el token de acceso usando el refresh token
   */
  async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<RefreshTokenResponse>(
        `/auth/refresh`,
        refreshData
      );
      
      if (response.data?.success) {
        console.log('✅ Token renovado exitosamente');
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Error al renovar token');
      }
    } catch (error: any) {
      console.error('❌ Error renovando token:', error);
      throw new Error(error.response?.data?.message || 'Error de conexión al renovar token');
    }
  },

  /**
   * Valida si un token JWT sigue siendo válido
   */
  validateToken(token: string): boolean {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      
      return now < exp;
    } catch (error) {
      console.error('❌ Error validando token:', error);
      return false;
    }
  },

  /**
   * Obtiene la información de expiración del token
   */
  getTokenExpiration(token: string): Date | null {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('❌ Error obteniendo expiración del token:', error);
      return null;
    }
  }
};

export default AuthService;
