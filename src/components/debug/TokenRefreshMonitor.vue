<!-- src/components/debug/TokenRefreshMonitor.vue -->
<template>
  <div class="token-monitor" :class="{ 'token-monitor--expanded': expanded }">
    <div class="token-monitor__header" @click="expanded = !expanded">
      <div class="token-monitor__title">
        <span class="token-monitor__icon" :class="tokenHealthClass">⚙️</span>
        Token Monitor 
        <span v-if="!expanded" class="token-monitor__mini-status">
          {{ tokenStatus }}
        </span>
      </div>
      <div class="token-monitor__expand">{{ expanded ? '▼' : '▶' }}</div>
    </div>
    
    <div v-if="expanded" class="token-monitor__content">
      <div class="token-monitor__section">
        <h3>Estado del Token</h3>
        <div class="token-monitor__grid">
          <div class="token-monitor__label">Estado:</div>
          <div class="token-monitor__value" :class="authStatusClass">
            {{ isAuthenticated ? 'Autenticado' : 'No autenticado' }}
          </div>
          
          <div class="token-monitor__label">Expira en:</div>
          <div class="token-monitor__value" :class="expiryClass">
            {{ expiresIn }}
          </div>
          
          <div class="token-monitor__label">Refresh Token:</div>
          <div class="token-monitor__value" :class="hasRefreshTokenClass">
            {{ hasRefreshToken ? 'Disponible' : 'No disponible' }}
          </div>
          
          <div class="token-monitor__label">Red:</div>
          <div class="token-monitor__value" :class="onlineClass">
            {{ isOnline ? 'Online' : 'Offline' }}
          </div>
          
          <div class="token-monitor__label">Usuario:</div>
          <div class="token-monitor__value">
            {{ userActive ? 'Activo' : 'Inactivo' }}
          </div>
        </div>
      </div>
      
      <div class="token-monitor__section">
        <h3>Estadísticas</h3>
        <div class="token-monitor__grid">
          <div class="token-monitor__label">Éxito/Total:</div>
          <div class="token-monitor__value">
            {{ stats.successCount }}/{{ stats.totalAttempts }}
            ({{ successRate }}%)
          </div>
          
          <div class="token-monitor__label">Última renovación:</div>
          <div class="token-monitor__value">
            {{ lastRefreshTime }}
          </div>
          
          <div class="token-monitor__label">Fallos consecutivos:</div>
          <div class="token-monitor__value" :class="failuresClass">
            {{ stats.consecutiveFailures }}
          </div>
          
          <div class="token-monitor__label">Vida media token:</div>
          <div class="token-monitor__value">
            {{ stats.averageTokenLifespan }}
          </div>
        </div>
      </div>
      
      <div class="token-monitor__actions">
        <button 
          class="token-monitor__button token-monitor__button--refresh" 
          @click="forceRefresh"
          :disabled="isRefreshing ? true : false"
        >
          {{ isRefreshing ? 'Renovando...' : 'Forzar Renovación' }}
        </button>
        
        <button 
          class="token-monitor__button"
          @click="copyDebugInfo"
        >
          Copiar Info
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useTokenRefresh } from '../../composables/useTokenRefresh.enhanced';

// Estado
const expanded = ref(false);
const updateTimer = ref<NodeJS.Timeout | null>(null);
const refreshResult = ref<string | null>(null);

// Stores y composables
const authStore = useAuthStore();
const tokenRefresh = useTokenRefresh();

// Computados para UI
const isAuthenticated = computed(() => authStore.isAuthenticated);
const hasRefreshToken = computed(() => !!authStore.refreshToken);
const isRefreshing = computed(() => tokenRefresh.isRefreshing);
const isOnline = computed(() => tokenRefresh.isOnline);
const userActive = computed(() => tokenRefresh.userActive);
const stats = computed(() => tokenRefresh.getRefreshStats());

// Tiempo de expiración formateado
const expiresIn = computed(() => {
  if (!authStore.tokenExpiration) return 'No disponible';
  
  const now = new Date();
  const expiration = new Date(authStore.tokenExpiration);
  const diffMs = expiration.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expirado';
  
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);
  
  return `${diffMinutes}m ${diffSeconds}s`;
});

// Última renovación formateada
const lastRefreshTime = computed(() => {
  const lastRefresh = stats.value.lastSuccessfulRefresh;
  if (!lastRefresh) return 'Nunca';
  
  return new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(
    Math.round((lastRefresh.getTime() - new Date().getTime()) / 60000),
    'minute'
  );
});

// Tasa de éxito de renovaciones
const successRate = computed(() => {
  if (stats.value.totalAttempts === 0) return '0';
  return ((stats.value.successCount / stats.value.totalAttempts) * 100).toFixed(0);
});

// Estado general del token
const tokenStatus = computed(() => {
  if (!isAuthenticated.value) return 'No autenticado';
  if (isRefreshing.value) return 'Renovando...';
  if (authStore.isTokenExpiringSoon()) return 'Expirando pronto';
  return 'Válido';
});

// Clases para colores de estado
const tokenHealthClass = computed(() => {
  if (!isAuthenticated.value) return 'token-monitor__icon--error';
  if (authStore.isTokenExpiringSoon()) return 'token-monitor__icon--warning';
  return 'token-monitor__icon--success';
});

const authStatusClass = computed(() => 
  isAuthenticated.value ? 'token-monitor__value--success' : 'token-monitor__value--error'
);

const expiryClass = computed(() => {
  if (!authStore.tokenExpiration) return 'token-monitor__value--error';
  
  const now = new Date();
  const expiration = new Date(authStore.tokenExpiration);
  const diffMs = expiration.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'token-monitor__value--error';
  if (diffMs <= 300000) return 'token-monitor__value--warning'; // 5 minutos
  return 'token-monitor__value--success';
});

const hasRefreshTokenClass = computed(() => 
  hasRefreshToken.value ? 'token-monitor__value--success' : 'token-monitor__value--error'
);

const onlineClass = computed(() => 
  isOnline.value ? 'token-monitor__value--success' : 'token-monitor__value--warning'
);

const failuresClass = computed(() => {
  if (stats.value.consecutiveFailures === 0) return '';
  if (stats.value.consecutiveFailures >= 3) return 'token-monitor__value--error';
  return 'token-monitor__value--warning';
});

// Métodos
const forceRefresh = async () => {
  const result = await tokenRefresh.forceRefreshToken();
  refreshResult.value = result ? 'Éxito' : 'Error';
  
  // Limpiar mensaje después de 3 segundos
  setTimeout(() => {
    refreshResult.value = null;
  }, 3000);
};

const copyDebugInfo = () => {
  const debugInfo = {
    auth: {
      isAuthenticated: isAuthenticated.value,
      hasRefreshToken: hasRefreshToken.value,
      expiresIn: expiresIn.value,
      tokenExpiration: authStore.tokenExpiration
    },
    stats: stats.value,
    system: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      online: isOnline.value
    }
  };
  
  navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
    .then(() => alert('Información copiada al portapapeles'))
    .catch(err => console.error('Error al copiar:', err));
};

// Actualizar cada segundo para mantener el contador de expiración actualizado
onMounted(() => {
  updateTimer.value = setInterval(() => {
    // Trigger reactivity
    const _ = expiresIn.value;
  }, 1000);
});

onUnmounted(() => {
  if (updateTimer.value) {
    clearInterval(updateTimer.value);
  }
});
</script>

<style scoped>
.token-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  font-size: 14px;
  z-index: 9999;
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 40px;
}

.token-monitor--expanded {
  max-height: 500px;
}

.token-monitor__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f1f3f5;
  cursor: pointer;
  user-select: none;
}

.token-monitor__title {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.token-monitor__icon {
  margin-right: 5px;
}

.token-monitor__icon--success {
  color: #28a745;
}

.token-monitor__icon--warning {
  color: #ffc107;
}

.token-monitor__icon--error {
  color: #dc3545;
}

.token-monitor__mini-status {
  font-size: 12px;
  opacity: 0.8;
  font-weight: normal;
  margin-left: 5px;
}

.token-monitor__content {
  padding: 15px;
}

.token-monitor__section {
  margin-bottom: 15px;
}

.token-monitor__section h3 {
  font-size: 16px;
  margin: 0 0 10px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #dee2e6;
}

.token-monitor__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px 10px;
}

.token-monitor__label {
  font-weight: bold;
  color: #495057;
}

.token-monitor__value {
  text-align: right;
}

.token-monitor__value--success {
  color: #28a745;
}

.token-monitor__value--warning {
  color: #ffc107;
}

.token-monitor__value--error {
  color: #dc3545;
}

.token-monitor__actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.token-monitor__button {
  flex: 1;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  background-color: #e9ecef;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.token-monitor__button:hover {
  background-color: #ced4da;
}

.token-monitor__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.token-monitor__button--refresh {
  background-color: #4dabf7;
  color: white;
}

.token-monitor__button--refresh:hover {
  background-color: #339af0;
}
</style>
