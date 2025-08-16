<template>
  <div class="card border-warning">
    <div class="card-header bg-warning text-dark">
      <h6 class="mb-0">🔧 Token Debugger</h6>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h6>Estado del Token:</h6>
          <ul class="list-unstyled">
            <li><strong>Autenticado:</strong> 
              <span class="badge" :class="authStore.isAuthenticated ? 'bg-success' : 'bg-danger'">
                {{ authStore.isAuthenticated ? 'Sí' : 'No' }}
              </span>
            </li>
            <li><strong>Token Length:</strong> {{ authStore.accessToken?.length || 0 }}</li>
            <li><strong>Refresh Token:</strong> 
              <span class="badge" :class="authStore.refreshToken ? 'bg-success' : 'bg-danger'">
                {{ authStore.refreshToken ? 'Disponible' : 'No disponible' }}
              </span>
            </li>
            <li><strong>Expiración:</strong> {{ formatExpiration }}</li>
            <li><strong>¿Expirando pronto?:</strong> 
              <span class="badge" :class="authStore.isTokenExpiringSoon() ? 'bg-warning' : 'bg-success'">
                {{ authStore.isTokenExpiringSoon() ? 'Sí' : 'No' }}
              </span>
            </li>
          </ul>
        </div>
        <div class="col-md-6">
          <h6>Acciones:</h6>
          <div class="d-grid gap-2">
            <button 
              class="btn btn-primary btn-sm" 
              @click="testRefresh"
              :disabled="!authStore.refreshToken || isRefreshing"
            >
              <span v-if="isRefreshing">
                <i class="spinner-border spinner-border-sm me-1"></i>
                Renovando...
              </span>
              <span v-else>🔄 Test Refresh</span>
            </button>
            <button class="btn btn-info btn-sm" @click="showTokenDetails">
              🔍 Ver Detalles Token
            </button>
            <button class="btn btn-secondary btn-sm" @click="forceReload">
              🔄 Recargar Estado
            </button>
          </div>
        </div>
      </div>
      
      <!-- Token Preview -->
      <div class="mt-3" v-if="showDetails">
        <h6>Detalles del Token:</h6>
        <div class="bg-light p-2 rounded">
          <small class="text-muted">
            <strong>Token Start:</strong> {{ authStore.accessToken?.substring(0, 50) }}...<br>
            <strong>Token End:</strong> ...{{ authStore.accessToken?.substring(-20) }}<br>
            <strong>Refresh Start:</strong> {{ authStore.refreshToken?.substring(0, 30) }}...
          </small>
        </div>
      </div>
      
      <!-- Logs -->
      <div class="mt-3" v-if="logs.length > 0">
        <h6>Logs Recientes:</h6>
        <div class="bg-dark text-light p-2 rounded" style="max-height: 200px; overflow-y: auto;">
          <small v-for="(log, index) in logs" :key="index" class="d-block">
            <span class="text-muted">{{ log.time }}</span> {{ log.message }}
          </small>
        </div>
        <button class="btn btn-sm btn-outline-secondary mt-1" @click="clearLogs">
          Limpiar Logs
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const isRefreshing = ref(false);
const showDetails = ref(false);
const logs = ref<Array<{ time: string; message: string }>>([]);

const formatExpiration = computed(() => {
  if (!authStore.tokenExpiration) return 'No disponible';
  const date = new Date(authStore.tokenExpiration);
  return date.toLocaleString();
});

const addLog = (message: string) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  });
  // Mantener solo los últimos 10 logs
  if (logs.value.length > 10) {
    logs.value = logs.value.slice(0, 10);
  }
};

const testRefresh = async () => {
  if (!authStore.refreshToken) {
    addLog('❌ No hay refresh token disponible');
    return;
  }
  
  isRefreshing.value = true;
  addLog('🔄 Iniciando test de refresh...');
  
  try {
    const oldToken = authStore.accessToken;
    await authStore.refreshAccessToken();
    const newToken = authStore.accessToken;
    
    addLog(`✅ Refresh exitoso! Token cambió: ${oldToken !== newToken}`);
    addLog(`🔑 Nuevo token length: ${newToken?.length || 0}`);
  } catch (error: any) {
    addLog(`❌ Error en refresh: ${error.message}`);
  } finally {
    isRefreshing.value = false;
  }
};

const showTokenDetails = () => {
  showDetails.value = !showDetails.value;
  addLog(`👁️ ${showDetails.value ? 'Mostrando' : 'Ocultando'} detalles del token`);
};

const forceReload = () => {
  addLog('🔄 Recargando estado del auth store...');
  // Forzar reactividad
  authStore.saveToLocalStorage();
};

const clearLogs = () => {
  logs.value = [];
};

onMounted(() => {
  addLog('🚀 Token Debugger iniciado');
  addLog(`📊 Estado inicial - Auth: ${authStore.isAuthenticated}, Token: ${!!authStore.accessToken}`);
});
</script>

<style scoped>
.card {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
}

.bg-dark {
  background-color: #1a1a1a !important;
}
</style>
