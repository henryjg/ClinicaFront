<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Código</label>
          <input v-model="filtroCodigo" class="form-control form-control-sm w-auto" placeholder="Buscar código" />
        </div>
        <div class="col-md-4 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Enfermedad</label>
          <input v-model="filtroEnfermedad" class="form-control form-control-sm w-auto" placeholder="Buscar enfermedad" />
        </div>
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Categoría</label>
          <input v-model="filtroCategoria" class="form-control form-control-sm w-auto" placeholder="Buscar categoría" />
        </div>
        <div class="col-md-2 d-flex align-items-center justify-content-end gap-2">
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

  <!-- Tabla de diagnósticos usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="diagnosticosFiltrados"
        :filterKeys="['codigo', 'enfermedad', 'categoria']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12">{{ item.codigo }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.enfermedad }}</td>
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

  <!-- Offcanvas personalizado agregar diagnóstico -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-plus me-2"></i> Nuevo diagnóstico</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarDiagnostico">
          <div class="mb-3">
            <label class="form-label">Código <span class="text-danger">*</span></label>
            <input v-model="nuevoDiagnostico.codigo" class="form-control" placeholder="Ingrese el código" />
          </div>
          <div class="mb-3">
            <label class="form-label">Enfermedad <span class="text-danger">*</span></label>
            <input v-model="nuevoDiagnostico.enfermedad" class="form-control" placeholder="Ingrese la enfermedad" />
          </div>
          <div class="mb-3">
            <label class="form-label">Categoría <span class="text-danger">*</span></label>
            <input v-model="nuevoDiagnostico.categoria" class="form-control" placeholder="Ingrese la categoría" />
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
    // Datos de ejemplo diagnósticos
    const diagnosticos = ref([
      { codigo: 'A00', enfermedad: 'Cólera', categoria: 'Enfermedades infecciosas intestinales' },
      { codigo: 'A01', enfermedad: 'Fiebres tifoidea y paratifoidea', categoria: 'Enfermedades infecciosas intestinales' },
      { codigo: 'A03', enfermedad: 'Shigelosis', categoria: 'Enfermedades infecciosas intestinales' },
      { codigo: 'A04', enfermedad: 'Otras infecciones intestinales bacterianas', categoria: 'Enfermedades infecciosas intestinales' },
      { codigo: 'A06', enfermedad: 'Amebiasis', categoria: 'Enfermedades infecciosas intestinales' },
      { codigo: 'A07', enfermedad: 'Otras enfermedades intestinales debidas a protozoarios', categoria: 'Enfermedades infecciosas intestinales' },
      { codigo: 'A15', enfermedad: 'Tuberculosis respiratoria, confirmada bacteriológica e histológicamente', categoria: 'Tuberculosis' },
      { codigo: 'A16', enfermedad: 'Tuberculosis respiratoria, no confirmada bacteriológica o histológicamente', categoria: 'Tuberculosis' },
      { codigo: 'A17', enfermedad: 'Tuberculosis del sistema nervioso', categoria: 'Tuberculosis' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Código', width: '12%', key: 'codigo', type: 'string' as const, sortable: true },
      { text: 'Enfermedad', width: '50%', key: 'enfermedad', type: 'string' as const, sortable: true },
      { text: 'Categoría', width: '20%', key: 'categoria', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '15%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroCodigo = ref('');
    const filtroEnfermedad = ref('');
    const filtroCategoria = ref('');
    // Filtrado de diagnósticos
    const diagnosticosFiltrados = computed(() => {
      return diagnosticos.value.filter(a => {
        const codigoMatch = !filtroCodigo.value || a.codigo.toLowerCase().includes(filtroCodigo.value.toLowerCase());
        const enfermedadMatch = !filtroEnfermedad.value || a.enfermedad.toLowerCase().includes(filtroEnfermedad.value.toLowerCase());
        const categoriaMatch = !filtroCategoria.value || a.categoria.toLowerCase().includes(filtroCategoria.value.toLowerCase());
        return codigoMatch && enfermedadMatch && categoriaMatch;
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
    // Nuevo diagnóstico
    const nuevoDiagnostico = ref({ codigo: '', enfermedad: '', categoria: '' });
    const guardarDiagnostico = () => {
      if (!nuevoDiagnostico.value.codigo || !nuevoDiagnostico.value.enfermedad || !nuevoDiagnostico.value.categoria) return;
      diagnosticos.value.push({
        codigo: nuevoDiagnostico.value.codigo,
        enfermedad: nuevoDiagnostico.value.enfermedad,
        categoria: nuevoDiagnostico.value.categoria
      });
      nuevoDiagnostico.value = { codigo: '', enfermedad: '', categoria: '' };
      cerrarOffcanvas();
    };
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroCodigo.value = '';
      filtroEnfermedad.value = '';
      filtroCategoria.value = '';
    };
    return {
      headers,
      diagnosticos,
      diagnosticosFiltrados,
      filtroCodigo,
      filtroEnfermedad,
      filtroCategoria,
      showOffcanvas,
      abrirOffcanvas,
      cerrarOffcanvas,
      nuevoDiagnostico,
      guardarDiagnostico,
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
  width: 600px;
  max-width: 95vw;
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
