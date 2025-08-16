<template>
  <div class="datatable-paginated">
    <!-- Información de resultados y controles integrados -->
    <div class="row mb-2" v-if="paginationInfo">
      <div class="col-12">
        <small class="text-muted">
          Mostrando {{ paginationInfo.desde }} - {{ paginationInfo.hasta }} 
          de {{ paginationInfo.total_registros }} documentos
        </small>
      </div>
    </div>

    <!-- Barra de controles integrada -->
    <div class="row mb-3 align-items-end">
      <!-- Selector de registros por página -->
      <div class="col-auto">
        <select :value="perPage" @change="handlePerPageChange" class="form-select" style="width: auto;">
          <option v-for="option in perPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- Campo de búsqueda -->
      <div class="col-6">
        <input 
          :value="searchTerm" 
          @input="handleSearchInput"
          type="text" 
          class="form-control " 
          :placeholder="searchPlaceholder"
        />
      </div>
        <!-- Botón para limpiar búsqueda -->
        <div class="col-auto">
                    <!-- Paginación personalizada -->
            <div class="row " v-if="paginationInfo && paginationInfo.total_paginas > 1">
            <div class="col-12">
                <nav aria-label="Navegación de páginas">
                <ul class="pagination justify-content-center mb-0">
                    <!-- Botón anterior -->
                    <li class="page-item" :class="{ disabled: !paginationInfo.pagina_anterior }">
                    <button 
                        class="page-link" 
                        @click="goToPage(paginationInfo.pagina_anterior)"
                        :disabled="!paginationInfo.pagina_anterior"
                    >
                        <i class="fa fa-chevron-left"></i> {{ prevLabel }}
                    </button>
                    </li>

                    <!-- Páginas -->
                    <li 
                    v-for="pagina in paginasVisibles" 
                    :key="pagina"
                    class="page-item"
                    :class="{ 
                        active: pagina === paginationInfo.pagina_actual,
                        disabled: pagina === '...'
                    }"
                    >
                    <button 
                        v-if="pagina !== '...'"
                        class="page-link" 
                        @click="goToPage(pagina)"
                    >
                        {{ pagina }}
                    </button>
                    <span v-else class="page-link">...</span>
                    </li>

                    <!-- Botón siguiente -->
                    <li class="page-item" :class="{ disabled: !paginationInfo.pagina_siguiente }">
                    <button 
                        class="page-link" 
                        @click="goToPage(paginationInfo.pagina_siguiente)"
                        :disabled="!paginationInfo.pagina_siguiente"
                    >
                        {{ nextLabel }} <i class="fa fa-chevron-right"></i>
                    </button>
                    </li>
                </ul>
                </nav>
            </div>
            </div>
         </div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ loadingLabel }}...</span>
      </div>
      <p class="mt-2">{{ loadingLabel }}...</p>
    </div>

    <!-- Tabla -->
    <div v-else class="table-responsive">
      <table class="table table-hover table-striped table-xs">
        <thead :class="clasehead">
          <tr class="b-gray">
            <th 
              v-for="(header, index) in headers" 
              :key="index" 
              :style="{ width: header.width }"
              @click="header.sortable !== false ? sortBy(header.key) : null" 
              :class="header.sortable !== false ? 'sortable text-sm' : 'text-sm'"
            >
              {{ header.text }}
              <span v-if="sortKey === header.key && header.sortable !== false">
                <i v-if="sortOrder === 'asc'" class="fa fa-arrow-up"></i>
                <i v-else class="fa fa-arrow-down"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <slot 
            v-for="(item, index) in items"
            :item="item"
            :index="index"
            :key="item.id || index"
            :globalIndex="((currentPage - 1) * perPage) + index + 1"
          >
          </slot>
        </tbody>
      </table>
    </div>

    <!-- Paginación personalizada -->
    <div class="row mt-3" v-if="paginationInfo && paginationInfo.total_paginas > 1">
      <div class="col-12">
        <nav aria-label="Navegación de páginas">
          <ul class="pagination justify-content-center">
            <!-- Botón anterior -->
            <li class="page-item" :class="{ disabled: !paginationInfo.pagina_anterior }">
              <button 
                class="page-link" 
                @click="goToPage(paginationInfo.pagina_anterior)"
                :disabled="!paginationInfo.pagina_anterior"
              >
                <i class="fa fa-chevron-left"></i> {{ prevLabel }}
              </button>
            </li>

            <!-- Páginas -->
            <li 
              v-for="pagina in paginasVisibles" 
              :key="pagina"
              class="page-item"
              :class="{ 
                active: pagina === paginationInfo.pagina_actual,
                disabled: pagina === '...'
              }"
            >
              <button 
                v-if="pagina !== '...'"
                class="page-link" 
                @click="goToPage(pagina)"
              >
                {{ pagina }}
              </button>
              <span v-else class="page-link">...</span>
            </li>

            <!-- Botón siguiente -->
            <li class="page-item" :class="{ disabled: !paginationInfo.pagina_siguiente }">
              <button 
                class="page-link" 
                @click="goToPage(paginationInfo.pagina_siguiente)"
                :disabled="!paginationInfo.pagina_siguiente"
              >
                {{ nextLabel }} <i class="fa fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Interfaces
interface Header {
  text: string;
  width: string;
  key: string;
  type?: 'string' | 'number' | 'date'; // Tipo de dato para ordenamiento correcto
  sortable?: boolean; // Si la columna es ordenable
}

interface SearchField {
  value: string;
  label: string;
}

interface PaginationInfo {
  pagina_actual: number;
  registros_por_pagina: number;
  total_registros: number;
  total_paginas: number;
  pagina_anterior: number | null;
  pagina_siguiente: number | null;
  paginas_visibles: (number | string)[];
  desde: number;
  hasta: number;
}

// Props
export interface Props {
  headers: Header[];
  items: any[];
  paginationInfo?: PaginationInfo | null;
  searchTerm?: string;
  perPage?: number;
  currentPage?: number;
  loading?: boolean;
  clasehead?: string;
  perPageOptions?: number[];
  searchPlaceholder?: string;
  loadingLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchTerm: '',
  perPage: 25,
  currentPage: 1,
  loading: false,
  clasehead: 'bg-info-100',
  perPageOptions: () => [25, 50, 100],
  searchPlaceholder: 'Buscar...',
  loadingLabel: 'Cargando',
  prevLabel: 'Anterior',
  nextLabel: 'Siguiente',
});

// Emits
const emit = defineEmits<{
  search: [{ term: string; field: string }];
  'page-change': [page: number];
  'per-page-change': [perPage: number];
  'clear-search': [];
  sort: [{ key: string; order: string; type: string }];
}>();

// Variables de ordenamiento
const sortKey = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Computed para generar páginas visibles inteligentes
const paginasVisibles = computed(() => {
  if (!props.paginationInfo) return [];
  
  const { pagina_actual, total_paginas } = props.paginationInfo;
  const paginas: (number | string)[] = [];
  
  if (total_paginas <= 7) {
    // Si hay 7 páginas o menos, mostrar todas
    for (let i = 1; i <= total_paginas; i++) {
      paginas.push(i);
    }
  } else {
    // Lógica para paginación inteligente
    paginas.push(1);
    
    if (pagina_actual <= 4) {
      // Inicio: 1, 2, 3, 4, ..., último
      for (let i = 2; i <= 4; i++) {
        paginas.push(i);
      }
      paginas.push('...');
      paginas.push(total_paginas);
    } else if (pagina_actual >= total_paginas - 3) {
      // Final: 1, ..., antepenúltimo, penúltimo, último
      paginas.push('...');
      for (let i = total_paginas - 3; i <= total_paginas; i++) {
        paginas.push(i);
      }
    } else {
      // Medio: 1, ..., actual-1, actual, actual+1, ..., último
      paginas.push('...');
      for (let i = pagina_actual - 1; i <= pagina_actual + 1; i++) {
        paginas.push(i);
      }
      paginas.push('...');
      paginas.push(total_paginas);
    }
  }
  
  return paginas;
});

// Computed
const searchDebounceTime = 500;
let searchTimeout: NodeJS.Timeout | null = null;

// Methods
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const term = target.value;
  
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    emit('search', { term, field: '' });
  }, searchDebounceTime);
};

const handlePerPageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const perPage = parseInt(target.value);
  emit('per-page-change', perPage);
};

const goToPage = (page: number | string | null) => {
  if (page && typeof page === 'number' && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const sortBy = (key: string) => {
  // Buscar el header para obtener el tipo de dato
  const header = props.headers.find(h => h.key === key);
  
  // Solo ordenar si la columna es sortable
  if (header && header.sortable === false) {
    return;
  }
  
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  
  // Emitir evento con información del tipo de dato
  emit('sort', { 
    key: sortKey.value, 
    order: sortOrder.value,
    type: header?.type || 'string'
  });
};
</script>

<style scoped>
.datatable-paginated {
  width: 100%;
}

.pagination {
  margin: 0;
}

.page-link {
  border-color: #dee2e6;
  color: #6c757d;
}

.page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* Estilos para columnas ordenables */
.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.sortable i {
  margin-left: 5px;
  font-size: 0.8em;
}

.fa-arrow-up, .fa-arrow-down {
  color: #007bff;
}

/* Indicador visual para columnas ordenables */
.sortable::after {
  content: ' ⇅';
  opacity: 0.3;
  font-size: 0.8em;
}

.sortable:hover::after {
  opacity: 0.6;
}
</style>
