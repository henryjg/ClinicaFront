<template>
  <div class="auth-debug-panel">
    <h3>🔧 Panel de Debug de Autenticación</h3>
    
    <div class="debug-section">
      <h4>📊 Estado Actual</h4>
      <div class="status-grid">
        <div class="status-item">
          <strong>Autenticado:</strong> 
          <span :class="authStore.isAuthenticated ? 'status-ok' : 'status-error'">
            {{ authStore.isAuthenticated ? 'Sí' : 'No' }}
          </span>
        </div>
        <div class="status-item">
          <strong>Access Token:</strong> 
          <span :class="authStore.accessToken ? 'status-ok' : 'status-error'">
            {{ authStore.accessToken ? 'Presente' : 'Ausente' }}
          </span>
        </div>
        <div class="status-item">
          <strong>Refresh Token:</strong> 
          <span :class="authStore.refreshToken ? 'status-ok' : 'status-error'">
            {{ authStore.refreshToken ? 'Presente' : 'Ausente' }}
          </span>
        </div>
        <div class="status-item">
          <strong>Expiración:</strong> 
          <span :class="tokenStatus.class">{{ tokenStatus.text }}</span>
        </div>
      </div>
    </div>

    <div class="debug-section">
      <h4>🔍 Detalles del Token</h4>
      <div v-if="authStore.accessToken" class="token-details">
        <p><strong>Token (primeros 50 chars):</strong> {{ authStore.accessToken.substring(0, 50) }}...</p>
        <p><strong>Expiración almacenada:</strong> {{ authStore.tokenExpiration || 'No disponible' }}</p>
        <p v-if="jwtPayload"><strong>Expiración del JWT:</strong> {{ new Date(jwtPayload.exp * 1000).toLocaleString() }}</p>
        <p v-if="jwtPayload"><strong>Usuario del JWT:</strong> {{ jwtPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] }}</p>
      </div>
      <p v-else class="no-token">No hay token disponible</p>
    </div>

    <div class="debug-section">
      <h4>🚀 Acciones de Test</h4>
      <div class="buttons-grid">
        <button @click="testRefreshToken" :disabled="!authStore.refreshToken || isLoading" class="btn-test">
          {{ isLoading ? 'Renovando...' : '🔄 Test Refresh Token' }}
        </button>
        <button @click="testApiCall" :disabled="!authStore.accessToken || isLoading" class="btn-test">
          {{ isLoading ? 'Probando...' : '📡 Test API Call' }}
        </button>
        <button @click="forceTokenExpiry" :disabled="!authStore.accessToken || isLoading" class="btn-test">
          ⏰ Forzar Expiración
        </button>
        <button @click="clearTokens" :disabled="isLoading" class="btn-test btn-danger">
          🗑️ Limpiar Tokens
        </button>
      </div>
    </div>

    <div class="debug-section" v-if="logs.length > 0">
      <h4>📝 Logs de Debug</h4>
      <div class="logs-container">
        <div v-for="(log, index) in logs" :key="index" :class="['log-entry', `log-${log.type}`]">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs" class="btn-clear">Limpiar Logs</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import api from '../services/axiosConfig';

const authStore = useAuthStore();
const isLoading = ref(false);
const logs = ref<Array<{type: string, message: string, time: string}>>([]);

// Computed para el estado del token
const tokenStatus = computed(() => {
  if (!authStore.tokenExpiration) {
    return { text: 'No disponible', class: 'status-error' };
  }
  
  const expDate = new Date(authStore.tokenExpiration);
  const now = new Date();
  const timeLeft = Math.floor((expDate.getTime() - now.getTime()) / 1000);
  
  if (timeLeft <= 0) {
    return { text: 'Expirado', class: 'status-error' };
  } else if (timeLeft <= 300) {
    return { text: `Expira pronto (${timeLeft}s)`, class: 'status-warning' };
  } else {
    return { text: `${timeLeft}s restantes`, class: 'status-ok' };
  }
});

// Decodificar JWT payload
const jwtPayload = computed(() => {
  if (!authStore.accessToken) return null;
  
  try {
    const parts = authStore.accessToken.split('.');
    if (parts.length === 3) {
      return JSON.parse(atob(parts[1]));
    }
  } catch (e) {
    console.error('Error decodificando JWT:', e);
  }
  return null;
});

// Funciones de logging
const addLog = (type: string, message: string) => {
  logs.value.unshift({
    type,
    message,
    time: new Date().toLocaleTimeString()
  });
  
  // Mantener solo los últimos 20 logs
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20);
  }
};

// Test de refresh token
const testRefreshToken = async () => {
  isLoading.value = true;
  try {
    addLog('info', 'Iniciando test de refresh token...');
    const oldToken = authStore.accessToken;
    
    await authStore.refreshAccessToken();
    
    const newToken = authStore.accessToken;
    if (oldToken !== newToken) {
      addLog('success', 'Token renovado exitosamente');
    } else {
      addLog('warning', 'Token no cambió tras el refresh');
    }
  } catch (error: any) {
    addLog('error', `Error en refresh: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

// Test de llamada a API
const testApiCall = async () => {
  isLoading.value = true;
  try {
    addLog('info', 'Probando llamada a API...');
    
    // Hacer una llamada a algún endpoint protegido
    const response = await api.get('/apikeys');
    
    addLog('success', `API call exitosa: ${response.status}`);
  } catch (error: any) {
    addLog('error', `Error en API call: ${error.response?.status} - ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

// Forzar expiración del token
const forceTokenExpiry = () => {
  const expiredTime = new Date();
  expiredTime.setSeconds(expiredTime.getSeconds() - 10); // 10 segundos en el pasado
  
  authStore.tokenExpiration = expiredTime.toISOString();
  authStore.saveToLocalStorage();
  
  addLog('warning', 'Token forzado a expirar');
};

// Limpiar tokens
const clearTokens = () => {
  authStore.logout();
  addLog('info', 'Tokens limpiados manualmente');
};

// Limpiar logs
const clearLogs = () => {
  logs.value = [];
};

onMounted(() => {
  addLog('info', 'Panel de debug iniciado');
});
</script>

<style scoped>
.auth-debug-panel {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.debug-section {
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.debug-section h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 16px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.status-item {
  padding: 10px;
  border-radius: 4px;
  background: #f8f9fa;
}

.status-ok { color: #28a745; font-weight: bold; }
.status-error { color: #dc3545; font-weight: bold; }
.status-warning { color: #ffc107; font-weight: bold; }

.token-details {
  font-size: 14px;
  line-height: 1.5;
}

.token-details p {
  margin: 8px 0;
  word-break: break-all;
}

.no-token {
  color: #6c757d;
  font-style: italic;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.btn-test {
  padding: 10px 15px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-test:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-test:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  border-color: #bd2130;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #f8f9fa;
}

.log-entry {
  padding: 8px 12px;
  border-bottom: 1px solid #e9ecef;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: #6c757d;
  margin-right: 10px;
}

.log-info .log-message { color: #17a2b8; }
.log-success .log-message { color: #28a745; }
.log-warning .log-message { color: #ffc107; }
.log-error .log-message { color: #dc3545; }

.btn-clear {
  margin-top: 10px;
  padding: 5px 10px;
  border: 1px solid #6c757d;
  background: #6c757d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-clear:hover {
  background: #5a6268;
  border-color: #545b62;
}
</style>
