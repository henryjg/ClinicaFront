// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {  useRouter } from 'vue-router';

import AuthService from '../services/Auth.service';
import { TOKEN_EXPIRY_THRESHOLD_SECONDS } from '../config/auth.config';
import { 
  LoginRequest, 
  RefreshTokenRequest,
  RefreshTokenResponse
} from '../interfaces/auth.interface';
import { UsuarioLogueado, initializeUsuarioLogueado } from '../interfaces/usuario.interface';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  // Función para verificar si un token está expirado
  const isTokenExpired = (tokenExp: string | null): boolean => {
    if (!tokenExp) return true;
    const expDate = new Date(tokenExp);
    const now = new Date();
    return now > expDate;
  };

  // Limpiar localStorage si hay tokens expirados
  const cleanExpiredTokens = () => {
    const tokenExp = localStorage.getItem('tokenExpiration');
    if (isTokenExpired(tokenExp)) {
      console.log('🧹 Limpiando tokens expirados al inicializar store');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('usuarioLogueado');
      return true; // Indica que se limpiaron tokens
    }
    return false;
  };

  // Limpiar tokens expirados antes de cargar datos
  const tokensCleared = cleanExpiredTokens();

  // Estados reactivos - cargar solo si no se limpiaron tokens expirados
  const accessToken = ref<string | null>(
    tokensCleared ? null : (localStorage.getItem('accessToken') || null)
  );
  const refreshToken = ref<string | null>(
    tokensCleared ? null : (localStorage.getItem('refreshToken') || null)
  );
  const tokenExpiration = ref<string | null>(
    tokensCleared ? null : (localStorage.getItem('tokenExpiration') || null)
  );
  const usuarioLogueado = ref<UsuarioLogueado>(
    tokensCleared ? 
      initializeUsuarioLogueado() : 
      (JSON.parse(localStorage.getItem('usuarioLogueado') || 'null') || initializeUsuarioLogueado())
  );

  // Computeds
  const isAuthenticated = computed(() => {
    return !!accessToken.value && usuarioLogueado.value.id !== 0;
  });

  const isLoggedIn = computed(() => isAuthenticated.value);
  const userInfo = computed(() => usuarioLogueado.value);

  // Funciones auxiliares
  const saveToLocalStorage = () => {
    if (accessToken.value) localStorage.setItem('accessToken', accessToken.value);
    if (refreshToken.value) localStorage.setItem('refreshToken', refreshToken.value);
    if (tokenExpiration.value) localStorage.setItem('tokenExpiration', tokenExpiration.value);
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado.value));
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('usuarioLogueado');
  };  // Verificar si el token está expirando pronto (ESTANDARIZADO EN SEGUNDOS)
  const isTokenExpiringSoon = (): boolean => {
    if (!tokenExpiration.value) {
      console.log('⚠️ No hay tokenExpiration, considerando como expirando');
      return true;
    }
    
    const expirationDate = new Date(tokenExpiration.value);
    const now = new Date();
    const timeDifferenceSeconds = Math.floor((expirationDate.getTime() - now.getTime()) / 1000);
    
    // Si el token está completamente expirado (más de 1 hora), no intentar renovarlo
    if (timeDifferenceSeconds < -3600) { // -1 hora
      console.log(`💀 Token completamente expirado (${timeDifferenceSeconds}s), limpiando sesión`);
      logout();
      return false; // No intentar renovar
    }
    
    const isExpiring = timeDifferenceSeconds <= TOKEN_EXPIRY_THRESHOLD_SECONDS;
    
    if (isExpiring && timeDifferenceSeconds > 0) {
      console.log(`⏰ Token expirando pronto: ${timeDifferenceSeconds}s restantes (threshold: ${TOKEN_EXPIRY_THRESHOLD_SECONDS}s)`);
    } else if (isExpiring && timeDifferenceSeconds <= 0) {
      console.log(`⏰ Token ya expirado: ${Math.abs(timeDifferenceSeconds)}s atrás, intentando renovar`);
    }
    
    return isExpiring;
  };

  // Verificar si la sesión es válida (usuario logueado + token no expirando)
  const checkSession = (): boolean => {
    return isAuthenticated.value && !isTokenExpiringSoon();
  };
  
  // Login
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await AuthService.login(credentials);      
      if (response?.success && response.data) {
        const { token, refreshToken: newRefreshToken, expiration, user } = response.data;
        
        console.log('🔑 Login response data:', {
          hasToken: !!token,
          hasRefreshToken: !!newRefreshToken,
          hasExpiration: !!expiration,
          hasUser: !!user,
          tokenLength: token?.length,
          refreshTokenLength: newRefreshToken?.length
        });
        
        // Actualizar tokens y datos del usuario
        accessToken.value = token;
        refreshToken.value = newRefreshToken;
        
        // Usar la expiración del API o calcularla del token
        if (expiration) {
          tokenExpiration.value = expiration;
          console.log('⏰ Usando expiración del API:', expiration);
        } else {
          const calculatedExpiration = AuthService.getTokenExpiration(token);
          tokenExpiration.value = calculatedExpiration?.toISOString() || null;
          console.log('⏰ Expiración calculada del JWT:', calculatedExpiration?.toLocaleString());
        }
        
        // Cambiar identificador de ROLES
        switch (user.idrol) {
          case 'Cliente':
            user.idrol = 1; // Cliente
            break;
          case 'Trabajador':
            user.idrol = 2; // Trabajador 
            break;
          case 'Negocio':
            user.idrol = 3; // Negocio
            break;
          case 'Administrador':
            user.idrol = 4; // Administrador
            break;
        }
        
        // Mapear datos del usuario
        usuarioLogueado.value = {
          id: user.id,
          usuario: user.usuario,
          nombreusuario: user.nombreusuario,
          fotoperfil: user.fotoperfil,
          correo: user.correo,
          celular: user.celular,
          idrol: typeof user.idrol === 'string' ? parseInt(user.idrol) : user.idrol,
          oficina_id: user.oficina_id,
          oficina_nombre: user.oficina_nombre,
          idusuario: user.idusuario,
          lastconexion: user.lastconexion,
          nroingresos: user.nroingresos,
          cambiocontrasenia: false,
          rol: user.rol,
          tipoUsuario: user.tipoUsuario
        };
        
        saveToLocalStorage();
        
        console.log('✅ Login completado exitosamente');
        console.log('📦 Estado final localStorage:', {
          accessToken: !!localStorage.getItem('accessToken'),
          refreshToken: !!localStorage.getItem('refreshToken'),
          tokenExpiration: localStorage.getItem('tokenExpiration'),
          usuario: !!localStorage.getItem('usuarioLogueado')
        });
      } else {
        throw new Error(response?.message || 'Error en el login');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error de conexión');
    }
  };  


  const login_sindocstore = async (usuario: string, tipoUsuario: string): Promise<void> => {
    try {
      const response = await AuthService.login_sindoc_Services(usuario, tipoUsuario);
      if (response?.success && response.data) {
        const { token, refreshToken: newRefreshToken, expiration, user } = response.data;
        
        console.log('🔑 Login response data:', {
          hasToken: !!token,
          hasRefreshToken: !!newRefreshToken,
          hasExpiration: !!expiration,
          hasUser: !!user,
          tokenLength: token?.length,
          refreshTokenLength: newRefreshToken?.length
        });
        
        // Actualizar tokens y datos del usuario
        accessToken.value = token;
        refreshToken.value = newRefreshToken;
        
        // Usar la expiración del API o calcularla del token
        if (expiration) {
          tokenExpiration.value = expiration;
          console.log('⏰ Usando expiración del API:', expiration);
        } else {
          const calculatedExpiration = AuthService.getTokenExpiration(token);
          tokenExpiration.value = calculatedExpiration?.toISOString() || null;
          console.log('⏰ Expiración calculada del JWT:', calculatedExpiration?.toLocaleString());
        }
        
        // Cambiar identificador de ROLES
        switch (user.idrol) {
          case 'Cliente':
            user.idrol = 1; // Cliente
            break;
          case 'Trabajador':
            user.idrol = 2; // Trabajador 
            break;
          case 'Negocio':
            user.idrol = 3; // Negocio
            break;
          case 'Administrador':
            user.idrol = 4; // Administrador
            break;
        }
        
        // Mapear datos del usuario
        usuarioLogueado.value = {
          id: user.id,
          usuario: user.usuario,
          nombreusuario: user.nombreusuario,
          fotoperfil: user.fotoperfil,
          correo: user.correo,
          celular: user.celular,
          idrol: typeof user.idrol === 'string' ? parseInt(user.idrol) : user.idrol,
          oficina_id: user.oficina_id,
          oficina_nombre: user.oficina_nombre,
          idusuario: user.idusuario,
          lastconexion: user.lastconexion,
          nroingresos: user.nroingresos,
          cambiocontrasenia: false,
          rol: user.rol,
          tipoUsuario: user.tipoUsuario
        };
        
        saveToLocalStorage();
        
        console.log('✅ Login completado exitosamente');
        console.log('📦 Estado final localStorage:', {
          accessToken: !!localStorage.getItem('accessToken'),
          refreshToken: !!localStorage.getItem('refreshToken'),
          tokenExpiration: localStorage.getItem('tokenExpiration'),
          usuario: !!localStorage.getItem('usuarioLogueado')
        });
      } else {
        throw new Error(response?.message || 'Error en el login');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error de conexión');
    }
  };  // Refresh token
  
  
  // Refresh token
  const refreshAccessToken = async (): Promise<void> => {
    if (!refreshToken.value || !usuarioLogueado.value.id) {
      console.error('❌ Refresh fallido: Missing data', {
        hasRefreshToken: !!refreshToken.value,
        hasUserId: !!usuarioLogueado.value.id,
        userIdValue: usuarioLogueado.value.id
      });
      throw new Error('No hay refresh token o userId disponible');
    }

    try {
      const refreshData: RefreshTokenRequest = {
        userId: usuarioLogueado.value.id.toString(),
        refreshToken: refreshToken.value
      };

      console.log('🔄 Enviando refresh request:', {
        userId: refreshData.userId,
        refreshTokenStart: refreshData.refreshToken.substring(0, 20) + '...',
        endpoint: '/api/auth/refresh'
      });

      const response = await AuthService.refreshToken(refreshData);      if (response?.success && response.data) {
        // En refresh viene 'accessToken' (diferente al login que viene 'token')
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        console.log('🔄 Refresh response data:', {
          hasAccessToken: !!newAccessToken,
          hasRefreshToken: !!newRefreshToken,
          accessTokenLength: newAccessToken?.length,
          refreshTokenLength: newRefreshToken?.length,
          responseStructure: Object.keys(response.data)
        });
        
        if (!newAccessToken) {
          throw new Error('Respuesta del servidor no contiene accessToken');
        }
        
        // ✅ ACTUALIZAR EL ACCESS TOKEN - ESTO ES CRÍTICO
        accessToken.value = newAccessToken;
        console.log('🔑 AccessToken actualizado correctamente');
        
        // Actualizar refresh token si viene uno nuevo
        if (newRefreshToken) {
          refreshToken.value = newRefreshToken;
          console.log('✅ Refresh token también actualizado');
        } else {
          console.log('⚠️ No se recibió nuevo refresh token, manteniendo el actual');
        }
        
        // Calcular nueva expiración basada en el token JWT
        const calculatedExpiration = AuthService.getTokenExpiration(newAccessToken);
        if (calculatedExpiration) {
          tokenExpiration.value = calculatedExpiration.toISOString();
          console.log('⏰ Nueva expiración calculada:', calculatedExpiration.toLocaleString());
        } else {
          // Fallback: asumir 15 minutos de duración
          const newExpiration = new Date();
          newExpiration.setMinutes(newExpiration.getMinutes() + 15);
          tokenExpiration.value = newExpiration.toISOString();
          console.log('⏰ Expiración fallback (15 min):', newExpiration.toLocaleString());
        }
          saveToLocalStorage();
        
        console.log('✅ Token renovado exitosamente');
        console.log('📦 Estado actual localStorage:', {
          accessToken: !!localStorage.getItem('accessToken'),
          refreshToken: !!localStorage.getItem('refreshToken'),
          tokenExpiration: localStorage.getItem('tokenExpiration')
        });
        console.log('🔑 Nuevo accessToken en store:', {
          hasToken: !!accessToken.value,
          tokenStart: accessToken.value?.substring(0, 20) + '...',
          tokenLength: accessToken.value?.length
        });
      } else {
        console.error('❌ Respuesta inválida del servidor:', {
          success: response?.success,
          hasData: !!response?.data,
          message: response?.message,
          fullResponse: response
        });
        throw new Error('Error al renovar token: Respuesta inválida del servidor');
      }
    } catch (error: any) {
      console.error('❌ Error al renovar token:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        refreshData: {
          userId: usuarioLogueado.value.id.toString(),
          hasRefreshToken: !!refreshToken.value
        }
      });
      throw new Error('Error al renovar token: ' + error.message);
    }
  };
  // Verificar y renovar token si es necesario (método público)
  const ensureValidToken = async (): Promise<boolean> => {
    if (!isAuthenticated.value) {
      console.log('❌ Usuario no autenticado en ensureValidToken');
      return false;
    }
    
    if (isTokenExpiringSoon() && refreshToken.value) {
      try {
        console.log('🔄 Asegurando token válido...');
        const oldToken = accessToken.value;
        await refreshAccessToken();
        const newToken = accessToken.value;
        
        console.log('✅ Token asegurado:', {
          tokenChanged: oldToken !== newToken,
          oldTokenStart: oldToken?.substring(0, 20) + '...',
          newTokenStart: newToken?.substring(0, 20) + '...',
          hasValidToken: !!newToken
        });
        
        return true;
      } catch (error) {
        console.error('❌ Error asegurando token válido:', error);
        logout();
        return false;
      }
    }
    
    console.log('✅ Token ya válido, no se requiere renovación');
    return true;
  };

  // Obtener el token actual (útil para verificación)
  const getCurrentToken = (): string | null => {
    return accessToken.value;
  };

  // Logout
  const logout = () => {
    accessToken.value = null;
    refreshToken.value = null;
    tokenExpiration.value = null;
    usuarioLogueado.value = initializeUsuarioLogueado();
    clearLocalStorage();
    router.push({ name: 'Loggin' });
  };
  return {
    // Estados
    accessToken,
    refreshToken,
    tokenExpiration,
    usuarioLogueado,
    
    // Computeds
    isAuthenticated,
    isLoggedIn,
    userInfo,
      // Métodos
    login,
    login_sindocstore,
    logout,
    refreshAccessToken,
    ensureValidToken,
    getCurrentToken,
    isTokenExpiringSoon,
    checkSession,
    saveToLocalStorage,
    clearLocalStorage
  };
});