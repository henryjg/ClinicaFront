// src/composables/useTokenRefresh.enhanced.ts
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { TOKEN_EXPIRY_THRESHOLD_SECONDS } from '../config/auth.config';

/**
 * Enhanced version of useTokenRefresh with:
 * - Network status monitoring
 * - Exponential backoff for retries
 * - User activity tracking
 * - Cross-tab synchronization
 * - Token health metrics
 */
export function useTokenRefresh() {
  const authStore = useAuthStore();
  const refreshInterval = ref<NodeJS.Timeout | null>(null);
  const isRefreshing = ref(false);
  const isOnline = ref(navigator.onLine);
  const lastRefreshAttempt = ref<Date | null>(null);
  const lastSuccessfulRefresh = ref<Date | null>(null);
  const consecutiveFailures = ref(0);
  const userActive = ref(true);
  const userIdleTimeout = ref<NodeJS.Timeout | null>(null);
  const refreshMetrics = ref({
    totalAttempts: 0,
    successCount: 0,
    failureCount: 0,
    averageTokenLifespanMs: 0
  });
  
  // Configuración base
  const BASE_CHECK_INTERVAL_MS = 30 * 1000; // 30 segundos
  const MIN_RETRY_INTERVAL_MS = 5 * 1000;   // 5 segundos
  const MAX_RETRY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos
  const USER_IDLE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutos
  
  /**
   * Calcula el intervalo de verificación basado en estado de red,
   * actividad del usuario y fallos consecutivos
   */
  const getCheckInterval = (): number => {
    // Si está offline, usar intervalo más largo
    if (!isOnline.value) {
      return MAX_RETRY_INTERVAL_MS;
    }
    
    // Si hay fallos consecutivos, aplicar backoff exponencial
    if (consecutiveFailures.value > 0) {
      const backoffInterval = Math.min(
        MIN_RETRY_INTERVAL_MS * Math.pow(2, consecutiveFailures.value - 1),
        MAX_RETRY_INTERVAL_MS
      );
      console.log(`⏱️ Usando intervalo de backoff: ${backoffInterval/1000}s (fallos: ${consecutiveFailures.value})`);
      return backoffInterval;
    }
    
    // Si el usuario está inactivo, usar intervalo más largo
    if (!userActive.value) {
      return BASE_CHECK_INTERVAL_MS * 2;
    }
    
    // Intervalo base para usuario activo y sin fallos
    return BASE_CHECK_INTERVAL_MS;
  };
  
  /**
   * Verifica y renueva el token si es necesario
   */
  const checkAndRefreshToken = async (): Promise<void> => {
    // Evitar verificaciones si está offline
    if (!isOnline.value) {
      console.log('📶 Offline, saltando verificación de token');
      return;
    }
    
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
        lastRefreshAttempt.value = new Date();
        refreshMetrics.value.totalAttempts++;
        
        console.log('🔄 [Background] Renovando token que está expirando...');
        
        // Calcular tiempo de vida del token anterior
        if (lastSuccessfulRefresh.value && authStore.tokenExpiration) {
          const tokenCreationTime = lastSuccessfulRefresh.value.getTime();
          const tokenExpirationTime = new Date(authStore.tokenExpiration).getTime();
          const tokenLifespan = tokenExpirationTime - tokenCreationTime;
          
          // Actualizar promedio de vida de tokens
          const { averageTokenLifespanMs, successCount } = refreshMetrics.value;
          refreshMetrics.value.averageTokenLifespanMs = 
            (averageTokenLifespanMs * successCount + tokenLifespan) / (successCount + 1);
        }
        
        await authStore.refreshAccessToken();
        
        // Actualizar métricas y estado
        lastSuccessfulRefresh.value = new Date();
        refreshMetrics.value.successCount++;
        consecutiveFailures.value = 0;
        
        console.log('✅ [Background] Token renovado exitosamente');
        console.log(`📊 Métricas: ${refreshMetrics.value.successCount}/${refreshMetrics.value.totalAttempts} renovaciones exitosas`);
      } catch (error: any) {
        console.error('❌ [Background] Error renovando token:', error);
        
        // Actualizar métricas y estado
        refreshMetrics.value.failureCount++;
        consecutiveFailures.value++;
        
        console.log(`⚠️ Fallos consecutivos: ${consecutiveFailures.value}`);
        
        // Planificar reintento con backoff si los fallos son manejables
        if (consecutiveFailures.value <= 5) {
          const retryInterval = getCheckInterval();
          console.log(`🔄 Reintentando en ${retryInterval/1000}s`);
          
          // Detener el intervalo actual y programar reintento único
          stopTokenRefresh();
          setTimeout(() => {
            checkAndRefreshToken().then(() => {
              // Reiniciar el intervalo normal después del reintento
              if (!refreshInterval.value) {
                startTokenRefresh();
              }
            });
          }, retryInterval);
          
          return;
        }
        
        // Si hay demasiados fallos consecutivos, cerrar sesión
        if (consecutiveFailures.value > 5) {
          console.log('🚪 [Background] Cerrando sesión por demasiados errores en renovación');
          authStore.logout();
        }
      } finally {
        isRefreshing.value = false;
      }
    }
  };
  
  /**
   * Maneja cambios en la conexión a internet
   */
  const handleOnlineStatusChange = () => {
    isOnline.value = navigator.onLine;
    console.log(`📶 Estado de conexión: ${isOnline.value ? 'Online' : 'Offline'}`);
    
    if (isOnline.value) {
      // Al recuperar conexión, verificar token inmediatamente
      console.log('📶 Conexión recuperada, verificando token...');
      checkAndRefreshToken();
    } else {
      // Al perder conexión, pausar el intervalo
      console.log('📶 Conexión perdida, pausando verificaciones');
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value);
        refreshInterval.value = null;
      }
    }
  };
  
  /**
   * Registra actividad del usuario
   */
  const handleUserActivity = () => {
    if (!userActive.value) {
      console.log('👤 Usuario activo nuevamente');
      userActive.value = true;
      
      // Verificar token inmediatamente al volver
      checkAndRefreshToken();
    }
    
    // Reiniciar temporizador de inactividad
    if (userIdleTimeout.value) {
      clearTimeout(userIdleTimeout.value);
    }
    
    userIdleTimeout.value = setTimeout(() => {
      console.log('👤 Usuario inactivo');
      userActive.value = false;
      
      // Ajustar intervalo para usuario inactivo
      if (refreshInterval.value) {
        restartInterval();
      }
    }, USER_IDLE_THRESHOLD_MS);
  };
  
  /**
   * Escucha eventos de sincronización entre pestañas
   */
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'accessToken' || event.key === 'refreshToken' || event.key === 'tokenExpiration') {
      console.log('📱 Cambio detectado en otra pestaña, sincronizando estado');
      // Recargar datos del localStorage
      authStore.checkSession();
    }
  };
  
  /**
   * Reinicia el intervalo con la frecuencia adecuada
   */
  const restartInterval = () => {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
      refreshInterval.value = null;
    }
    
    const interval = getCheckInterval();
    console.log(`⏰ [Background] Configurando verificación cada ${interval / 1000} segundos`);
    refreshInterval.value = setInterval(checkAndRefreshToken, interval);
  };
  
  /**
   * Inicia el sistema de renovación automática
   */
  const startTokenRefresh = (): void => {
    if (refreshInterval.value) {
      console.log('⚠️ [Background] Sistema de renovación ya está activo');
      return;
    }
    
    console.log('🚀 [Background] Iniciando sistema de renovación automática de tokens');
    
    // Verificación inicial
    checkAndRefreshToken();
    
    // Configurar intervalo
    restartInterval();
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
    
    if (userIdleTimeout.value) {
      clearTimeout(userIdleTimeout.value);
      userIdleTimeout.value = null;
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
      lastRefreshAttempt.value = new Date();
      refreshMetrics.value.totalAttempts++;
      
      console.log('🔄 [Forzado] Renovando token...');
      
      await authStore.refreshAccessToken();
      
      // Actualizar métricas y estado
      lastSuccessfulRefresh.value = new Date();
      refreshMetrics.value.successCount++;
      consecutiveFailures.value = 0;
      
      console.log('✅ [Forzado] Token renovado exitosamente');
      return true;
    } catch (error: any) {
      console.error('❌ [Forzado] Error renovando token:', error);
      
      // Actualizar métricas
      refreshMetrics.value.failureCount++;
      consecutiveFailures.value++;
      
      return false;
    } finally {
      isRefreshing.value = false;
    }
  };
  
  /**
   * Obtiene estadísticas del sistema de renovación
   */
  const getRefreshStats = () => {
    return {
      ...refreshMetrics.value,
      isOnline: isOnline.value,
      userActive: userActive.value,
      consecutiveFailures: consecutiveFailures.value,
      lastRefreshAttempt: lastRefreshAttempt.value,
      lastSuccessfulRefresh: lastSuccessfulRefresh.value,
      averageTokenLifespan: refreshMetrics.value.averageTokenLifespanMs > 0 
        ? `${Math.round(refreshMetrics.value.averageTokenLifespanMs / 60000)} minutos` 
        : 'Desconocido'
    };
  };
  
  // Observar cambios en la autenticación
  watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
      // Si el usuario inicia sesión, iniciar renovación
      if (!refreshInterval.value) {
        startTokenRefresh();
      }
    } else {
      // Si el usuario cierra sesión, detener renovación
      stopTokenRefresh();
    }
  });
  
  // Auto-iniciar cuando se monta el composable
  onMounted(() => {
    // Configurar listeners
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Configurar detección de actividad
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Iniciar si el usuario está autenticado
    if (authStore.isAuthenticated) {
      startTokenRefresh();
    }
    
    // Inicializar detector de inactividad
    handleUserActivity();
  });
  
  // Auto-detener cuando se desmonta el composable
  onUnmounted(() => {
    // Limpiar listeners
    window.removeEventListener('online', handleOnlineStatusChange);
    window.removeEventListener('offline', handleOnlineStatusChange);
    window.removeEventListener('storage', handleStorageChange);
    
    // Limpiar detección de actividad
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      window.removeEventListener(event, handleUserActivity);
    });
    
    stopTokenRefresh();
  });
  
  return {
    isRefreshing,
    isOnline,
    userActive,
    startTokenRefresh,
    stopTokenRefresh,
    forceRefreshToken,
    checkAndRefreshToken,
    getRefreshStats
  };
}
