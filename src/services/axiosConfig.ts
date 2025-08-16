// src/services/axiosConfig.ts
import axios from 'axios';
import { API_REST, ApiKey } from '../config';
import { API_TIMEOUT_SECONDS } from '../config/auth.config';
import { useAuthStore } from '../stores/authStore';
import router from '../router';
import Alerta from '../utils/alertas';

// Cliente único para todas las peticiones
const api = axios.create({ 
  baseURL: API_REST,
  timeout: API_TIMEOUT_SECONDS * 1000, // Convertir a milisegundos
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': ApiKey  // API Key OBLIGATORIA para TODAS las peticiones
  }
});

// Interceptor de peticiones: Agregar API Key + Token JWT si existe + Refresh proactivo
api.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();
    
    // SIEMPRE agregar la API Key (OBLIGATORIA)
    config.headers['X-API-Key'] = ApiKey;

    // Si el usuario está logueado, agregar el token JWT
    if (authStore.accessToken) {
      // Verificar si el token está expirando pronto y renovarlo proactivamente
      // Solo si NO es una petición de refresh para evitar bucles infinitos
      if (authStore.isTokenExpiringSoon() && authStore.refreshToken && !config.url?.includes('/auth/refresh')) {
        try {
          console.log('🔄 Token expirando pronto, renovando proactivamente...');
          console.log('📊 Estado antes del refresh:', {
            hasAccessToken: !!authStore.accessToken,
            hasRefreshToken: !!authStore.refreshToken,
            userId: authStore.usuarioLogueado?.id
          });
          
          await authStore.refreshAccessToken();
          
          console.log('✅ Token renovado proactivamente, usando nuevo token para la petición');
          console.log('📊 Estado después del refresh:', {
            hasAccessToken: !!authStore.accessToken,
            newTokenStart: authStore.accessToken?.substring(0, 20) + '...'
          });
        } catch (error: any) {
          console.error('❌ Error en refresh proactivo:', error);
          console.error('📊 Detalles del error:', {
            message: error?.message || 'Error desconocido',
            response: error?.response?.data || 'Sin respuesta',
            status: error?.response?.status || 'Sin status',
            authState: {
              hasAccessToken: !!authStore.accessToken,
              hasRefreshToken: !!authStore.refreshToken,
              userId: authStore.usuarioLogueado?.id
            }          });
          // Si falla el refresh proactivo, dejamos que el interceptor de respuesta maneje el 401
        }
      }
      
      // SIEMPRE usar el token más reciente del store
      const currentToken = authStore.accessToken;
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
        // console.log('🔑 Token agregado a headers:', 
        //   {
        //   tokenStart: currentToken.substring(0, 20) + '...',
        //   tokenLength: currentToken.length
        // });
      } else {
        console.log('⚠️ No hay accessToken disponible para agregar a headers');
      }
    } else {
      console.log('⚠️ Usuario no autenticado, no se agregará token');
    }
    
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor de respuestas: Manejar errores 401 y renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si es error 401 y no se ha reintentado y no es una petición de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/api/auth/refresh')) {
      originalRequest._retry = true;
      const authStore = useAuthStore();
        // Si hay token de refresco, intentar renovar
      if (authStore.refreshToken) {
        try {
          console.log('🔄 Recibido 401, intentando renovar token...');
          const oldToken = authStore.accessToken;
          await authStore.refreshAccessToken();
          const newToken = authStore.accessToken;
          
          console.log('✅ Token renovado tras 401:', {
            tokenChanged: oldToken !== newToken,
            newTokenStart: newToken?.substring(0, 20) + '...'
          });
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
          console.log('🔄 Reintentando petición original con nuevo token');
          return api(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, cerrar sesión
          console.error('❌ Fallo refresh tras 401, cerrando sesión:', refreshError);
          authStore.logout();
          Alerta.Error('Sesión Expirada', 'Tu sesión ha expirado, inicia sesión nuevamente...');
          router.push('/beneficios/loggin/');
        }
      } else {
        console.warn('⚠️ No hay refresh token, cerrando sesión');
        authStore.logout();
        Alerta.Error('Sesión Expirada', 'Tu sesión ha expirado, inicia sesión nuevamente...');
        router.push('/beneficios/loggin/');
      }
    }
    
    return Promise.reject(error);
  }
);

// Exportar instancia única
export { api };
export default api;