<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-4 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Alergia</label>
          <input v-model="filtroAlergia" class="form-control form-control-sm w-auto" placeholder="Buscar alergia" />
        </div>
        <div class="col-md-4 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Categoría</label>
          <select v-model="filtroCategoria" class="form-select form-select-sm w-auto">
            <option value="">Todas</option>
            <option v-for="cat in categoriasAlergia" :key="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-center justify-content-end gap-2">
          <button class="btn btn-primary btn-sm d-flex align-items-center gap-1" @click="abrirOffcanvas">
            <i class="fa fa-plus"></i> Agregar
          </button>
          <button class="btn btn-secondary btn-sm d-flex align-items-center" @click="limpiarFiltros">
            <i class="fa fa-broom"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla de alergias usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="alergiasFiltradas"
        :filterKeys="['alergia', 'categoria']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.alergia }}</td>
            <td class="text-wrap f-12">{{ item.categoria }}</td>
            <td class="text-wrap d-flex">
              <button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
              <button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>
  </div>

  <!-- Offcanvas personalizado agregar alergia -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-allergies me-2"></i> Nueva alergia</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarAlergia">
          <div class="mb-3">
            <label class="form-label">Alergia <span class="text-danger">*</span></label>
            <input v-model="nuevaAlergia.alergia" class="form-control" placeholder="Ingrese la alergia" />
          </div>
          <div class="mb-3">
            <label class="form-label">Categoría <span class="text-danger">*</span></label>
            <select v-model="nuevaAlergia.categoria" class="form-select">
              <option v-for="cat in categoriasAlergia" :key="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="mt-4 d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" class="btn btn-outline-secondary" @click="cerrarOffcanvas">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import DataTable from '../../../components/table/DataTable.vue';

export default defineComponent({
  components: { DataTable },
  setup() {
    // Categorías de alergia según la imagen
    const categoriasAlergia = [
      'Alergias alimentarias',
      'Alergia a las picaduras de insectos',
      'Alergia a los ácaros',
      'Alergia a medicamentos'
    ];
    // Datos de ejemplo
    const alergias = ref([
      { alergia: 'Alergia a los mariscos', categoria: 'Alergias alimentarias' },
      { alergia: 'Alergia a la leche', categoria: 'Alergias alimentarias' },
      { alergia: 'Alergia a los huevos', categoria: 'Alergias alimentarias' },
      { alergia: 'Alergia a los pescados', categoria: 'Alergias alimentarias' },
      { alergia: 'Alergia a himenópteros', categoria: 'Alergia a las picaduras de insectos' },
      { alergia: 'Alergia a los ácaros', categoria: 'Alergia a los ácaros' },
      { alergia: 'Penicilinas', categoria: 'Alergia a medicamentos' },
      { alergia: 'Sulfamidas', categoria: 'Alergia a medicamentos' },
      { alergia: 'Aspirina', categoria: 'Alergia a medicamentos' },
      { alergia: 'Anestesia', categoria: 'Alergia a medicamentos' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Alergia', width: '47%', key: 'alergia', type: 'string' as const, sortable: true },
      { text: 'Categoría', width: '37%', key: 'categoria', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '13%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroAlergia = ref('');
    const filtroCategoria = ref('');
    // Filtrado de alergias
    const alergiasFiltradas = computed(() => {
      return alergias.value.filter(a => {
        const alergiaMatch = !filtroAlergia.value || a.alergia.toLowerCase().includes(filtroAlergia.value.toLowerCase());
        const categoriaMatch = !filtroCategoria.value || a.categoria === filtroCategoria.value;
        return alergiaMatch && categoriaMatch;
      });
    });
    // Offcanvas personalizado
    const showOffcanvas = ref(false);
    const abrirOffcanvas = () => {
      showOffcanvas.value = true;
    };
    const cerrarOffcanvas = () => {
      showOffcanvas.value = false;
    };
    // Nueva alergia
    const nuevaAlergia = ref({ alergia: '', categoria: categoriasAlergia[0] });
    const guardarAlergia = () => {
      if (!nuevaAlergia.value.alergia || !nuevaAlergia.value.categoria) return;
      alergias.value.push({
        alergia: nuevaAlergia.value.alergia,
        categoria: nuevaAlergia.value.categoria
      });
      nuevaAlergia.value = { alergia: '', categoria: categoriasAlergia[0] };
      cerrarOffcanvas();
    };
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroAlergia.value = '';
      filtroCategoria.value = '';
    };
    return {
      headers,
      alergias,
      categoriasAlergia,
      alergiasFiltradas,
      filtroAlergia,
      filtroCategoria,
      showOffcanvas,
      abrirOffcanvas,
      cerrarOffcanvas,
      nuevaAlergia,
      guardarAlergia,
      limpiarFiltros
    };
  }
});
</script>

<style scoped>
.f-w-500 { font-weight: 500; }
.f-12 { font-size: 0.95em; }
.offcanvas-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.15);
  z-index: 1050;
  display: flex;
  justify-content: flex-end;
}
.offcanvas-panel {
  background: #fff;
  width: 400px;
  max-width: 90vw;
  height: 100vh;
  box-shadow: -2px 0 12px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
}
.offcanvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.offcanvas-body {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}
</style>
