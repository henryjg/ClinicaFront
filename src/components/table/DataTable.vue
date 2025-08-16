<template>
  <div>
    <!-- Buscador y selector de elementos por página -->
    <div v-show="!loading || hideLoading" class="px-3">
      <div class="d-flex my-1">
        <div class="wid-100">
          <select v-model="itemsPerPage" class="form-control" @change="resetPage">
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="w-50 px-1">
          <input v-model="searchQuery" class="form-control" placeholder="Buscar..." @input="filterData" />
        </div>
        <div class="w-50">
          <!-- Paginación -->
          <nav aria-label="Page navigation">
            <ul class="pagination justify-content-end mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">
                  <i class="fas fa-angle-left"></i>
                </a>
              </li>
              <li class="page-item" v-for="page in paginationPages" :key="page" :class="{ active: currentPage === page }">
                <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                <span v-else class="page-link disabled">...</span>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="nextPage">
                  <i class="fas fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading && !hideLoading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ loadingLabel }}...</span>
      </div>
      <p class="mt-2">{{ loadingLabel }}...</p>
    </div>

    <!-- Tabla -->
    <div 
      v-show="!loading || hideLoading"
      ref="tableContainerRef"
      class="table-responsive table-container" 
      tabindex="0"
      @focus="onTableFocus"
      @click="onTableClick"
      :style="{ 
        height: autoHeight && (!loading || hideLoading) ? calculatedHeight : 'auto'
      }">
      <table class="table   table-xs" >
        <thead class="table_head_bg sticky-md-top border-1">
          <tr class="b-gray ">
            <!-- Checkbox para selección múltiple -->
            <th v-if="selectable" class="text-center mx-2 px-2 " style="width: 1%;">
              <div class="form-check">
                <input 
                  type="checkbox"
                  class="form-check-input input-primary"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                  id="selectAll"
                />
              </div>
            </th>
            
            <th v-for="(header, index) in headers" :key="index" :style="{ width: header.width }"
              :class="[
                'text-sm', 
                header.sortable !== false ? 'sortable' : 'not-sortable'
              ]">
              <div class="d-flex align-items-center justify-content-between">
                <span @click="sortBy(header.key)" class="header-text">
                  {{ header.text }}
                  <span v-if="header.sortable !== false">
                    <span v-if="sortKey === header.key">
                      <i v-if="sortOrder === 'asc'" class="fa fa-arrow-up"></i>
                      <i v-else class="fa fa-arrow-down"></i>
                    </span>
                    <span v-else class="sort-indicator">⇅</span>
                  </span>
                </span>
                
                <!-- Botón de filtro tipo Excel -->
                <span v-if="header.filterable !== false" 
                      @click="toggleFilterDropdown(header.key, $event)"
                      class="filter-button"
                      :class="{ 'filter-active': isFilterActive(header.key) }">
                  <i class="fas fa-filter"></i>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
            <slot v-for="(item, index) in paginatedAndSortedItems"
                :item="item"
                :index="index"
                :key="item.id"
                :currentPage="currentPage"
                :itemsPerPage="itemsPerPage"
                :selectable="selectable"
                :isItemSelected="isItemSelected"
                :toggleSelectItem="toggleSelectItem"
                :itemIdKey="itemIdKey"
                :selectedItems="selectedItemsArray"
                :clearSelection="clearSelection"
                :handleMouseDown="handleMouseDown"
                :isDragging="isDragging"
                :focusedRowIndex="focusedRowIndex"
                :isKeyboardNavigation="isKeyboardNavigation">
            </slot>
        </tbody>
      </table>
    </div>

    <!-- Dropdown de filtros tipo Excel -->
    <div v-if="activeFilterDropdown" 
         class="filter-dropdown"
         :style="{ 
           top: filterDropdownPosition.top + 'px', 
           left: filterDropdownPosition.left + 'px' 
         }"
         @click.stop>
      <div class="filter-dropdown-header">
        <h6 class="mb-2">Filtrar valores</h6>
        <button @click="closeFilterDropdown" class="btn-close-filter">×</button>
      </div>
      
      <!-- Campo de búsqueda dentro del filtro -->
      <div class="filter-search-container">
        <input 
          v-model="filterSearchQuery" 
          type="text" 
          class="form-control form-control-sm" 
          placeholder="Buscar valores..."
          @click.stop>
      </div>
      
      <div class="filter-actions mb-2">
        <button @click="selectAllFilterValues(activeFilterDropdown)" 
                class="btn btn-sm btn-outline-primary me-1">
          Seleccionar todo
        </button>
        <button @click="clearAllFilterValues(activeFilterDropdown)" 
                class="btn btn-sm btn-outline-secondary">
          Limpiar
        </button>
      </div>
      
      <div class="filter-values">
        <div v-if="getUniqueValues(activeFilterDropdown).length === 0 && filterSearchQuery" 
             class="filter-no-results">
          <span class="text-muted">No se encontraron valores que coincidan con "{{ filterSearchQuery }}"</span>
        </div>
        <div v-for="value in getUniqueValues(activeFilterDropdown)" 
             :key="value" 
             class="filter-value-item">
          <label class="d-flex align-items-center">
            <input type="checkbox" 
                   :checked="columnFilters[activeFilterDropdown]?.includes(value)"
                   @change="toggleFilterValue(activeFilterDropdown, value)"
                   class="me-2 ">
            <span>{{ value || '(Vacío)' }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar dropdown -->
    <div v-if="activeFilterDropdown" 
         class="filter-overlay"
         @click="closeFilterDropdown">
    </div>

    <!-- Selector visual para drag selection -->
    <div v-if="selectorVisible" 
         class="drag-selector"
         :class="{ 'deselecting': isDeselecting }"
         :style="{
           position: 'fixed',
           top: selectorPosition.top + 'px',
           left: selectorPosition.left + 'px',
           width: selectorPosition.width + 'px',
           height: selectorPosition.height + 'px',
           zIndex: 1000
         }">
    </div>

    <!-- Paginación -->
    <nav v-show="!loading || hideLoading" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">Anterior</a>
        </li>
        <li class="page-item" v-for="page in paginationPages" :key="page" :class="{ active: currentPage === page }">
            <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            <span v-else class="page-link disabled">...</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">Siguiente</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, PropType, onMounted, onUnmounted, nextTick, watch } from 'vue';

export interface Header {
  text: string;
  width: string;
  key: string; // Clave que se usará para ordenar y filtrar los datos
  type?: 'string' | 'number' | 'date'; // Tipo de dato para ordenamiento inteligente
  sortable?: boolean; // Si la columna es ordenable
  filterable?: boolean; // Si la columna permite filtrado tipo Excel
}

export default defineComponent({
  name: 'DataTable',
  props: {
    headers: {
      type: Array as PropType<Header[]>,
      required: true,
    },
    items: {
      type: Array as PropType<any[]>, // Puedes tipar mejor si tienes una interfaz para tus items
      required: true,
    },
    filterKeys: {
      type: Array as PropType<(keyof any)[]>, // Claves que se usarán para filtrar los datos
      required: true,
    },
    // Nuevas props para selección múltiple
    selectable: {
      type: Boolean,
      default: false, // Por defecto deshabilitado para mantener compatibilidad
    },
    itemIdKey: {
      type: String,
      default: 'id', // Clave que identifica únicamente cada item
    },
    // Prop para ajuste automático de altura
    autoHeight: {
      type: Boolean,
      default: false, // Por defecto deshabilitado para mantener compatibilidad
    },
    heightOffset: {
      type: Number,
      default: 100, // Offset en píxeles para dejar espacio al final (paginación, etc.)
    },
    // Props para loading
    loading: {
      type: Boolean,
      default: false, // Por defecto sin loading
    },
    loadingLabel: {
      type: String,
      default: 'Cargando', // Texto que se muestra durante la carga
    },
    hideLoading: {
      type: Boolean,
      default: false, // Permite ocultar completamente el loading
    },
  },
  emits: [
    'selection-change', // Evento que se emite cuando cambia la selección
  ],
  setup(props, { emit }) {
    const searchQuery = ref<string>('');
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(25);
    const itemsPerPageOptions = ref<number[]>([25, 50, 100, 250]);

    // Variables para manejo de la ordenación
    const sortKey = ref<string | null>(null);
    const sortOrder = ref<'asc' | 'desc'>('asc');

    // Variables para manejo de filtros tipo Excel
    const columnFilters = ref<Record<string, string[]>>({});
    const activeFilterDropdown = ref<string | null>(null);
    const filterDropdownPosition = ref({ top: 0, left: 0 });
    const filterSearchQuery = ref<string>(''); // Búsqueda dentro del dropdown de filtros

    // Variables para selección múltiple
    const selectedItems = ref<Set<any>>(new Set());
    const isAllSelected = ref<boolean>(false);
    const isIndeterminate = ref<boolean>(false);

    // Variables para selección por rango con Ctrl
    const isDragging = ref<boolean>(false);
    const dragStartIndex = ref<number | null>(null);
    const dragEndIndex = ref<number | null>(null);
    const isCtrlPressed = ref<boolean>(false);
    
    // Variables para el selector visual
    const selectorVisible = ref<boolean>(false);
    const selectorPosition = ref({
      top: 0,
      left: 0,
      width: 0,
      height: 0
    });
    const dragStartPosition = ref({ x: 0, y: 0 });
    const isDeselecting = ref<boolean>(false);

    // Variables para altura automática
    const tableContainerRef = ref<HTMLElement>();
    const calculatedHeight = ref<string>('auto');

    // Variables para navegación con teclado
    const focusedRowIndex = ref<number>(-1);
    const isKeyboardNavigation = ref<boolean>(false);

    // Filtrar los elementos según la búsqueda y filtros de columna
    const filteredItems = computed(() => {
      if (!props.items || !Array.isArray(props.items)) return [];
      
      let filtered = props.items;
      
      // Aplicar filtro de búsqueda general
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(item => {
          return props.filterKeys.some((key) => {
            const value = String(item[key]).toLowerCase();
            return value.includes(query);
          });
        });
      }
      
      // Aplicar filtros de columna
      Object.entries(columnFilters.value).forEach(([columnKey, selectedValues]) => {
        if (selectedValues.length > 0) {
          filtered = filtered.filter(item => {
            const itemValue = String(item[columnKey] || '');
            return selectedValues.includes(itemValue);
          });
        }
      });
      
      return filtered;
    });

    // Ordenar los elementos según el sortKey y sortOrder
    const sortedItems = computed(() => {
      if (!sortKey.value) return filteredItems.value;
      
      // Encontrar el header correspondiente para obtener el tipo
      const header = props.headers.find(h => h.key === sortKey.value);
      const dataType = header?.type || 'string';
      
      return [...filteredItems.value].sort((a, b) => {
        const aValue = a[sortKey.value as keyof typeof a];
        const bValue = b[sortKey.value as keyof typeof b];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        
        switch (dataType) {
          case 'number':
            const numA = parseFloat(String(aValue));
            const numB = parseFloat(String(bValue));
            comparison = numA - numB;
            break;
            
          case 'date':
            const dateA = new Date(String(aValue));
            const dateB = new Date(String(bValue));
            comparison = dateA.getTime() - dateB.getTime();
            break;
            
          default: // 'string'
            comparison = String(aValue).localeCompare(String(bValue));
            break;
        }
        
        return sortOrder.value === 'asc' ? comparison : -comparison;
      });
    });

    // Paginación y ordenación
    const paginatedAndSortedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return sortedItems.value.slice(start, end);
    });

    const totalPages = computed(() => {
      const itemsLength = filteredItems.value ? filteredItems.value.length : 0;
      return Math.ceil(itemsLength / itemsPerPage.value);
    });

    const paginationPages = computed(() => {
      const pages: Array<number | string> = [];
      const total = totalPages.value;
      const current = currentPage.value;

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, 2);

        if (current > 4) pages.push("...");

        const start = Math.max(3, current - 1);
        const end = Math.min(total - 2, current + 1);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (current < total - 3) pages.push("...");

        pages.push(total - 1, total);
      }

      return pages;
    });

    // Funciones para ordenar las columnas
    const sortBy = (key: string) => {
      // Verificar si la columna es ordenable
      const header = props.headers.find(h => h.key === key);
      if (header?.sortable === false) return;
      
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
      }
    };

    // Funciones para filtros tipo Excel
    const getUniqueValues = (columnKey: string) => {
      if (!props.items || !Array.isArray(props.items)) return [];
      const values = props.items.map(item => String(item[columnKey] || ''));
      let uniqueValues = [...new Set(values)].sort();
      
      // Aplicar filtro de búsqueda si existe
      if (filterSearchQuery.value) {
        const searchTerm = filterSearchQuery.value.toLowerCase();
        uniqueValues = uniqueValues.filter(value => 
          value.toLowerCase().includes(searchTerm)
        );
      }
      
      return uniqueValues;
    };

    const toggleFilterDropdown = (columnKey: string, event: Event) => {
      if (activeFilterDropdown.value === columnKey) {
        activeFilterDropdown.value = null;
        filterSearchQuery.value = ''; // Limpiar búsqueda al cerrar
        return;
      }
      
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      filterDropdownPosition.value = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      };
      
      activeFilterDropdown.value = columnKey;
      filterSearchQuery.value = ''; // Limpiar búsqueda al cambiar de columna
      
      // Inicializar filtros si no existen
      if (!columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = [];
      }
    };

    const toggleFilterValue = (columnKey: string, value: string) => {
      if (!columnFilters.value[columnKey]) {
        columnFilters.value[columnKey] = [];
      }
      
      const index = columnFilters.value[columnKey].indexOf(value);
      if (index > -1) {
        columnFilters.value[columnKey].splice(index, 1);
      } else {
        columnFilters.value[columnKey].push(value);
      }
      
      // Resetear a la primera página cuando se aplican filtros
      currentPage.value = 1;
    };

    const selectAllFilterValues = (columnKey: string) => {
      const uniqueValues = getUniqueValues(columnKey);
      columnFilters.value[columnKey] = [...uniqueValues];
      currentPage.value = 1;
    };

    const clearAllFilterValues = (columnKey: string) => {
      columnFilters.value[columnKey] = [];
      currentPage.value = 1;
    };

    const closeFilterDropdown = () => {
      activeFilterDropdown.value = null;
      filterSearchQuery.value = ''; // Limpiar búsqueda al cerrar
    };

    const isFilterActive = (columnKey: string) => {
      return columnFilters.value[columnKey] && columnFilters.value[columnKey].length > 0;
    };

    // Funciones para selección múltiple
    const selectedItemsArray = computed(() => {
      return Array.from(selectedItems.value);
    });

    const selectedCount = computed(() => {
      return selectedItems.value.size;
    });

    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        // Deseleccionar todos
        selectedItems.value.clear();
      } else {
        // Seleccionar todos los items de la página actual
        paginatedAndSortedItems.value.forEach(item => {
          selectedItems.value.add(item[props.itemIdKey]);
        });
      }
      updateSelectionState();
      emitSelectionChange();
    };

    const toggleSelectItem = (itemId: any) => {
      if (selectedItems.value.has(itemId)) {
        selectedItems.value.delete(itemId);
      } else {
        selectedItems.value.add(itemId);
      }
      updateSelectionState();
      emitSelectionChange();
    };

    const isItemSelected = (itemId: any) => {
      return selectedItems.value.has(itemId);
    };

    const updateSelectionState = () => {
      const currentPageItemIds = paginatedAndSortedItems.value.map(item => item[props.itemIdKey]);
      const selectedCurrentPageItems = currentPageItemIds.filter(id => selectedItems.value.has(id));
      
      isAllSelected.value = currentPageItemIds.length > 0 && selectedCurrentPageItems.length === currentPageItemIds.length;
      isIndeterminate.value = selectedCurrentPageItems.length > 0 && selectedCurrentPageItems.length < currentPageItemIds.length;
    };

    const clearSelection = () => {
      selectedItems.value.clear();
      updateSelectionState();
      emitSelectionChange();
    };

    const emitSelectionChange = () => {
      const selectedItemsData = props.items.filter(item => 
        selectedItems.value.has(item[props.itemIdKey])
      );
      emit('selection-change', {
        selectedIds: Array.from(selectedItems.value),
        selectedItems: selectedItemsData,
        count: selectedItems.value.size
      });
    };

    // Funciones para selección por rango con Ctrl + drag
    const handleMouseDown = (index: number, event: MouseEvent) => {
      // Limpiar foco de teclado cuando se usa el mouse
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
      
      if (event.ctrlKey) {
        isDragging.value = true;
        dragStartIndex.value = index;
        dragEndIndex.value = index;
        isCtrlPressed.value = true;
        
        // Capturar posición inicial para el selector visual usando las coordenadas de la página
        dragStartPosition.value = {
          x: event.pageX,
          y: event.pageY
        };
        
        // Inicializar selector visual en la posición exacta del click
        selectorPosition.value = {
          top: event.pageY,
          left: event.pageX,
          width: 0,
          height: 0
        };
        selectorVisible.value = true;
        
        // Prevenir selección de texto
        event.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging.value || !isCtrlPressed.value) return;
      
      // Actualizar selector visual usando coordenadas de la página
      if (selectorVisible.value) {
        const currentX = event.pageX;
        const currentY = event.pageY;
        
        // Calcular posición y tamaño del selector
        const left = Math.min(dragStartPosition.value.x, currentX);
        const top = Math.min(dragStartPosition.value.y, currentY);
        const width = Math.abs(currentX - dragStartPosition.value.x);
        const height = Math.abs(currentY - dragStartPosition.value.y);
        
        selectorPosition.value = { left, top, width, height };
      }
      
      // Encontrar el índice de la fila sobre la que está el mouse
      const target = event.target as HTMLElement;
      const row = target.closest('tr');
      if (row && row.parentNode) {
        const tbody = row.parentNode as HTMLElement;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const currentIndex = rows.indexOf(row);
        
        if (currentIndex >= 0) {
          dragEndIndex.value = currentIndex;
          
          // Seleccionar rango visual temporalmente
          highlightRange();
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging.value && dragStartIndex.value !== null && dragEndIndex.value !== null) {
        selectRange(dragStartIndex.value, dragEndIndex.value);
      }
      
      // Limpiar estado de drag
      isDragging.value = false;
      dragStartIndex.value = null;
      dragEndIndex.value = null;
      isCtrlPressed.value = false;
      selectorVisible.value = false;
      isDeselecting.value = false;
      
      // Remover event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Limpiar highlights
      clearRangeHighlight();
    };

    const selectRange = (startIndex: number, endIndex: number) => {
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      // Verificar si todos los items en el rango ya están seleccionados
      let allSelected = true;
      const rangeItems = [];
      
      for (let i = start; i <= end; i++) {
        if (i < paginatedAndSortedItems.value.length) {
          const item = paginatedAndSortedItems.value[i];
          rangeItems.push(item);
          if (!selectedItems.value.has(item[props.itemIdKey])) {
            allSelected = false;
          }
        }
      }
      
      // Si todos están seleccionados, deseleccionar; si no, seleccionar
      if (allSelected && rangeItems.length > 0) {
        // Deseleccionar todos los items en el rango
        rangeItems.forEach(item => {
          selectedItems.value.delete(item[props.itemIdKey]);
        });
      } else {
        // Seleccionar todos los items en el rango
        rangeItems.forEach(item => {
          selectedItems.value.add(item[props.itemIdKey]);
        });
      }
      
      updateSelectionState();
      emitSelectionChange();
    };

    const highlightRange = () => {
      if (dragStartIndex.value === null || dragEndIndex.value === null) return;
      
      const start = Math.min(dragStartIndex.value, dragEndIndex.value);
      const end = Math.max(dragStartIndex.value, dragEndIndex.value);
      
      // Limpiar highlights previos
      clearRangeHighlight();
      
      // Verificar si el rango está completamente seleccionado
      let allSelected = true;
      for (let i = start; i <= end; i++) {
        if (i < paginatedAndSortedItems.value.length) {
          const item = paginatedAndSortedItems.value[i];
          if (!selectedItems.value.has(item[props.itemIdKey])) {
            allSelected = false;
            break;
          }
        }
      }
      
      // Actualizar estado de deselección
      isDeselecting.value = allSelected;
      
      // Agregar clase de highlight al rango
      const tbody = document.querySelector('tbody');
      if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        for (let i = start; i <= end && i < rows.length; i++) {
          rows[i].classList.add('drag-selecting');
          // Agregar clase adicional si todos están seleccionados (para deseleccionar)
          if (allSelected) {
            rows[i].classList.add('drag-deselecting');
          }
        }
      }
    };

    const clearRangeHighlight = () => {
      const rows = document.querySelectorAll('tr.drag-selecting, tr.drag-deselecting');
      rows.forEach(row => {
        row.classList.remove('drag-selecting');
        row.classList.remove('drag-deselecting');
      });
    };

    // Event listeners para detectar Ctrl y navegación con teclado
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        isCtrlPressed.value = true;
      }

      // Navegación con teclado solo si hay items y está habilitada la selección
      if (props.selectable && paginatedAndSortedItems.value.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            moveToNextRow();
            break;
          case 'ArrowUp':
            event.preventDefault();
            moveToPreviousRow();
            break;
          case ' ': // Barra espaciadora
            // Solo seleccionar si se presiona Ctrl + Espacio
            if (event.ctrlKey) {
              event.preventDefault();
              selectCurrentRow();
            }
            // Si no se presiona Ctrl, permitir el comportamiento normal (scroll)
            break;
          case 'Escape':
            // Limpiar foco al presionar Escape
            focusedRowIndex.value = -1;
            isKeyboardNavigation.value = false;
            break;
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        isCtrlPressed.value = false;
      }
    };

    // Funciones para navegación con teclado
    const moveToNextRow = () => {
      if (focusedRowIndex.value < paginatedAndSortedItems.value.length - 1) {
        focusedRowIndex.value++;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      } else if (focusedRowIndex.value === -1 && paginatedAndSortedItems.value.length > 0) {
        // Si no hay fila enfocada, empezar en la primera
        focusedRowIndex.value = 0;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      }
    };

    const moveToPreviousRow = () => {
      if (focusedRowIndex.value > 0) {
        focusedRowIndex.value--;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      } else if (focusedRowIndex.value === -1 && paginatedAndSortedItems.value.length > 0) {
        // Si no hay fila enfocada, empezar en la última
        focusedRowIndex.value = paginatedAndSortedItems.value.length - 1;
        isKeyboardNavigation.value = true;
        scrollToFocusedRow();
      }
    };

    const selectCurrentRow = () => {
      if (focusedRowIndex.value >= 0 && focusedRowIndex.value < paginatedAndSortedItems.value.length) {
        const currentItem = paginatedAndSortedItems.value[focusedRowIndex.value];
        const itemId = currentItem[props.itemIdKey];
        
        // Alternar selección: si está seleccionado, deseleccionar; si no, seleccionar
        toggleSelectItem(itemId);
      }
    };

    const scrollToFocusedRow = () => {
      nextTick(() => {
        const tbody = document.querySelector('.table-container tbody');
        if (tbody && focusedRowIndex.value >= 0) {
          const rows = tbody.querySelectorAll('tr');
          const targetRow = rows[focusedRowIndex.value];
          if (targetRow) {
            targetRow.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }
      });
    };

    // Funciones para manejo de foco en la tabla
    const onTableFocus = () => {
      // Cuando la tabla recibe foco, activar la navegación por teclado si no hay fila enfocada
      if (focusedRowIndex.value === -1 && paginatedAndSortedItems.value.length > 0) {
        focusedRowIndex.value = 0;
        isKeyboardNavigation.value = true;
      }
    };

    const onTableClick = (event: MouseEvent) => {
      // Enfocar la tabla cuando se hace click en ella para habilitar navegación por teclado
      if (tableContainerRef.value) {
        tableContainerRef.value.focus();
      }
    };

    // Funciones para la paginación
    const changePage = (page: number | string) => {
      if (typeof page === 'number') {
        currentPage.value = page;
        // Resetear foco cuando cambie la página
        focusedRowIndex.value = -1;
        isKeyboardNavigation.value = false;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        // Resetear foco cuando cambie la página
        focusedRowIndex.value = -1;
        isKeyboardNavigation.value = false;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        // Resetear foco cuando cambie la página
        focusedRowIndex.value = -1;
        isKeyboardNavigation.value = false;
      }
    };

    const filterData = () => {
      currentPage.value = 1;
      // Resetear foco cuando se filtren los datos
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
    };

    const resetPage = () => {
      currentPage.value = 1;
      // Resetear foco cuando se reinicie la página
      focusedRowIndex.value = -1;
      isKeyboardNavigation.value = false;
    };

    // Funciones para altura automática
    const calculateAutoHeight = () => {
      if (!props.autoHeight) return;
      
      // Si está cargando y no se debe mostrar la tabla, no calcular altura
      if (props.loading && !props.hideLoading) {
        calculatedHeight.value = 'auto';
        return;
      }
      
      // Esperar a que el DOM se actualice
      nextTick(() => {
        if (!tableContainerRef.value) return;
        
        const container = tableContainerRef.value;
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calcular altura disponible desde la posición actual hasta el final de la pantalla
        const availableHeight = windowHeight - rect.top - props.heightOffset;
        
        // Asegurar que la altura mínima sea razonable
        const minHeight = 200;
        const finalHeight = Math.max(availableHeight, minHeight);
        
        calculatedHeight.value = `${finalHeight}px`;
      });
    };

    const handleResize = () => {
      if (props.autoHeight) {
        calculateAutoHeight();
      }
    };

    // Lifecycle hooks para event listeners
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
      window.addEventListener('resize', handleResize);
      
      // Calcular altura inicial si autoHeight está habilitado
      if (props.autoHeight) {
        nextTick(() => {
          calculateAutoHeight();
        });
      }
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    });

    // Watcher para recalcular altura cuando cambie autoHeight
    watch(() => props.autoHeight, (newValue) => {
      if (newValue) {
        calculateAutoHeight();
      } else {
        calculatedHeight.value = 'auto';
      }
    });

    // Watcher para recalcular altura cuando cambie el estado de loading
    watch(() => props.loading, (newValue) => {
      if (props.autoHeight) {
        // Si termina de cargar, recalcular altura
        if (!newValue) {
          nextTick(() => {
            calculateAutoHeight();
          });
        }
      }
    });

    // Watcher para recalcular altura cuando cambien los items (después de cargar datos)
    watch(() => props.items, () => {
      if (props.autoHeight && !props.loading) {
        nextTick(() => {
          calculateAutoHeight();
        });
      }
    });

    // Exposer métodos para el componente padre
    const limpiarSeleccion = () => {
      clearSelection();
    };

    const setKeyboardFocus = (index: number) => {
      focusedRowIndex.value = index;
      isKeyboardNavigation.value = true;
      scrollToFocusedRow();
    };

    return {
      searchQuery,
      itemsPerPage,
      itemsPerPageOptions,
      currentPage,
      totalPages,
      paginationPages,
      paginatedAndSortedItems,
      sortKey,
      sortOrder,
      sortBy,
      changePage,
      prevPage,
      nextPage,
      filterData,
      resetPage,
      // Filtros tipo Excel
      columnFilters,
      activeFilterDropdown,
      filterDropdownPosition,
      filterSearchQuery,
      getUniqueValues,
      toggleFilterDropdown,
      toggleFilterValue,
      selectAllFilterValues,
      clearAllFilterValues,
      closeFilterDropdown,
      isFilterActive,
      // Selección múltiple
      selectedItems,
      selectedItemsArray,
      selectedCount,
      isAllSelected,
      isIndeterminate,
      toggleSelectAll,
      toggleSelectItem,
      isItemSelected,
      clearSelection,
      // Selección por rango
      isDragging,
      handleMouseDown,
      // Selector visual
      selectorVisible,
      selectorPosition,
      isDeselecting,
      // Altura automática
      tableContainerRef,
      calculatedHeight,
      // Navegación con teclado
      focusedRowIndex,
      isKeyboardNavigation,
      onTableFocus,
      onTableClick,
      // Métodos expuestos
      limpiarSeleccion,
      setKeyboardFocus,
    };
  },
});
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.not-sortable {
  cursor: default;
  user-select: none;
}

.header-text {
  cursor: pointer;
  flex: 1;
}

.sortable i {
  margin-left: 5px;
}

.sort-indicator {
  margin-left: 5px;
  color: #ccc;
  font-size: 0.8em;
}

.fa-arrow-up {
  color: #22ff0096;
}

.fa-arrow-down {
  color: #22ff0096;
}

/* Estilos para el botón de filtro */
.filter-button {
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  color: #ffffff;
  font-size: 0.8em;
  transition: all 0.2s;
}

.filter-button:hover {
  background-color: #22ff0096;
  color: #ffffff;
}

/* Forzar color negro en los textos de los headers si el fondo es oscuro */
.bg-blue-800 th,
.bg-blue-800 .table_head_bg th,
.table_head_bg.bg-blue-800 th {
  color: #000 !important;
}
.filter-button.filter-active {
  background-color: #ff6a00;
  color: white;
}

/* Estilos para el dropdown de filtros */
.filter-dropdown {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1050;
  min-width: 250px;
  max-width: 350px;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.filter-dropdown-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.filter-dropdown-header h6 {
  margin: 0;
  flex: 1;
}

.btn-close-filter {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-search-container {
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
}

.filter-search-container input {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-actions {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.filter-values {
  padding: 8px 0;
  max-height: 250px;
  overflow-y: auto;
}

.filter-value-item {
  padding: 4px 16px;
}

.filter-value-item:hover {
  background-color: #f8f9fa;
}

.filter-value-item label {
  cursor: pointer;
  margin: 0;
  width: 100%;
  font-size: 0.9em;
}

.filter-no-results {
  padding: 16px;
  text-align: center;
  font-style: italic;
}

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1040;
  background: transparent;
}

th.sortable {
  white-space: pre-line;
}
tbody > tr> td {
  padding: 0 !important;
}

.table-container {
  position: relative;
}

/* Estilos para selección por rango */
.drag-selecting {
  background-color: rgba(0, 123, 255, 0.2) !important;
  transition: background-color 0.1s ease;
}

.drag-deselecting {
  background-color: rgba(255, 0, 0, 0.2) !important;
  transition: background-color 0.1s ease;
}

.drag-selector {
  background-color: rgba(0, 123, 255, 0.1);
  border: 2px dashed #007bff;
  pointer-events: none;
  box-sizing: border-box;
}

/* Selector visual cuando va a deseleccionar */
.drag-selector.deselecting {
  background-color: rgba(255, 0, 0, 0.1);
  border: 2px dashed #dc3545;
}

tbody tr {
  cursor: pointer;
  user-select: none;
}

tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Estilos para navegación con teclado */
tbody tr.keyboard-focused {
  background-color: #fef3c7 !important; /* bg-yellow-100 equivalent */
  /* border: 1px solid #f9ba4e !important; */
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3) !important;
  position: relative !important;
  z-index: 10 !important;
}

tbody tr.keyboard-focused:hover {
  background-color: #fde68a !important; /* bg-yellow-200 equivalent */
}

/* Asegurar que el fondo amarillo sea visible por encima de otros estilos */
tbody tr.keyboard-focused td {
  background-color: inherit !important;
}

/* Mejorar el contraste del foco */
.table-container {
  transition: outline 0.2s ease;
}

</style>
