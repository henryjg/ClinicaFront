// src/composables/useTokenRefresh.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';

export function useTokenRefresh() {
  const authStore = useAuthStore();
  const refreshInterval = ref<NodeJS.Timeout | null>(null);
  const isRefreshing = ref(false);
  
  // Intervalo de verificación cada 30 segundos
  const CHECK_INTERVAL_MS = 30 * 1000;
  
  /**
   * Verifica y renueva el token si es necesario
   */
  const checkAndRefreshToken = async (): Promise<void> => {
    // Evitar múltiples refreshes simultáneos
    if (isRefreshing.value) {
      console.log('🔄 Ya hay un refresh en progreso, saltando verificación');
      return;
    }
    
    // Solo verificar si el usuario está autenticado
    if (!authStore.isAuthenticated) {
      console.log('👤 Usuario no autenticado, saltando verificación de token');
      return;
    }
    
    // Solo renovar si el token está expirando pronto y hay refresh token
    if (authStore.isTokenExpiringSoon() && authStore.refreshToken) {
      try {
        isRefreshing.value = true;
        console.log('🔄 [Background] Renovando token que está expirando...');
        
        await authStore.refreshAccessToken();
        
        console.log('✅ [Background] Token renovado exitosamente');
      } catch (error: any) {
        console.error('❌ [Background] Error renovando token:', error);
        
        // Si falla la renovación, cerrar sesión
        console.log('🚪 [Background] Cerrando sesión por error en renovación');
        authStore.logout();
      } finally {
        isRefreshing.value = false;
      }
    }
  };
  
  /**
   * Inicia el sistema de renovación automática
   */
  const startTokenRefresh = (): void => {
    if (refreshInterval.value) {
      console.log('⚠️ [Background] Sistema de renovación ya está activo');
      return;
    }
    
    // console.log('🚀 [Background] Iniciando sistema de renovación automática de tokens');
    // console.log(`⏰ [Background] Verificación cada ${CHECK_INTERVAL_MS / 1000} segundos`);
    
    // Verificación inicial
    checkAndRefreshToken();
    
    // Configurar intervalo
    refreshInterval.value = setInterval(checkAndRefreshToken, CHECK_INTERVAL_MS);
  };
  
  /**
   * Detiene el sistema de renovación automática
   */
  const stopTokenRefresh = (): void => {
    if (refreshInterval.value) {
      console.log('🛑 [Background] Deteniendo sistema de renovación automática');
      clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
    isRefreshing.value = false;
  };
  
  /**
   * Fuerza una renovación inmediata del token
   */
  const forceRefreshToken = async (): Promise<boolean> => {
    if (!authStore.refreshToken) {
      console.warn('⚠️ No hay refresh token disponible para renovación forzada');
      return false;
    }
    
    try {
      isRefreshing.value = true;
      console.log('🔄 [Forzado] Renovando token...');
      
      await authStore.refreshAccessToken();
      
      console.log('✅ [Forzado] Token renovado exitosamente');
      return true;
    } catch (error: any) {
      console.error('❌ [Forzado] Error renovando token:', error);
      return false;
    } finally {
      isRefreshing.value = false;
    }
  };
  
  // Auto-iniciar cuando se monta el composable
  onMounted(() => {
    startTokenRefresh();
  });
  
  // Auto-detener cuando se desmonta el composable
  onUnmounted(() => {
    stopTokenRefresh();
  });
  
  return {
    isRefreshing,
    startTokenRefresh,
    stopTokenRefresh,
    forceRefreshToken,
    checkAndRefreshToken
  };
}
