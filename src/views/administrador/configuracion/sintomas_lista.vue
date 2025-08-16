<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Código</label>
          <input v-model="filtroCodigo" class="form-control form-control-sm w-auto" placeholder="Buscar código" />
        </div>
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Síntoma</label>
          <input v-model="filtroSintoma" class="form-control form-control-sm w-auto" placeholder="Buscar síntoma" />
        </div>
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Categoría</label>
          <input v-model="filtroCategoria" class="form-control form-control-sm w-auto" placeholder="Buscar categoría" />
        </div>
        <div class="col-md-3 d-flex align-items-center justify-content-end gap-2">
          <button class="btn btn-primary btn-sm d-flex align-items-center gap-1" @click="abrirOffcanvasAgregar">
            <i class="fa fa-plus"></i> Agregar
          </button>
          <button class="btn btn-secondary btn-sm d-flex align-items-center" @click="limpiarFiltros">
            <i class="fa fa-broom"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla de síntomas usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="sintomasFiltrados"
        :filterKeys="['codigo', 'sintoma', 'categoria']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12">{{ item.codigo }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.sintoma }}</td>
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

  <!-- Offcanvas personalizado agregar síntoma -->
  <div v-if="showOffcanvasAgregar" class="offcanvas-backdrop" @click.self="cerrarOffcanvasAgregar">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-plus me-2"></i> Nuevo síntoma</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvasAgregar"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarSintoma">
          <div class="mb-3">
            <label class="form-label">Código <span class="text-danger">*</span></label>
            <input v-model="nuevoSintoma.codigo" class="form-control" placeholder="Ingrese el código" />
          </div>
          <div class="mb-3">
            <label class="form-label">Síntoma <span class="text-danger">*</span></label>
            <input v-model="nuevoSintoma.sintoma" class="form-control" placeholder="Ingrese el síntoma" />
          </div>
          <div class="mb-3">
            <label class="form-label">Categoría <span class="text-danger">*</span></label>
            <input v-model="nuevoSintoma.categoria" class="form-control" placeholder="Ingrese la categoría" />
          </div>
          <div class="mt-4 d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" class="btn btn-outline-secondary" @click="cerrarOffcanvasAgregar">Cancelar</button>
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
    // Datos de ejemplo síntomas
    const sintomas = ref([
      { codigo: 'R06.1', sintoma: 'Estridor', categoria: 'Anormalidades de la respiración' },
      { codigo: 'R06.3', sintoma: 'Respiración periódica', categoria: 'Anormalidades de la respiración' },
      { codigo: 'R07.0', sintoma: 'Dolor de garganta', categoria: 'Dolor de garganta y en el pecho' },
      { codigo: 'R07.2', sintoma: 'Dolor precordial', categoria: 'Dolor de garganta y en el pecho' },
      { codigo: 'R07.4', sintoma: 'Dolor en el pecho, no especificado', categoria: 'Dolor de garganta y en el pecho' },
      { codigo: 'R10.0', sintoma: 'Abdomen agudo', categoria: 'Dolor abdominal y pélvico' },
      { codigo: 'R10.2', sintoma: 'Dolor pélvico y perineal', categoria: 'Dolor abdominal y pélvico' },
      { codigo: 'R11', sintoma: 'Náusea y vómito', categoria: 'Náusea y vómito' },
      { codigo: 'R20.0', sintoma: 'Anestesia de la piel', categoria: 'Alteraciones de la sensibilidad cutánea' },
      { codigo: 'R20.3', sintoma: 'Hiperestesia', categoria: 'Alteraciones de la sensibilidad cutánea' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Código', width: '12%', key: 'codigo', type: 'string' as const, sortable: true },
      { text: 'Síntoma', width: '35%', key: 'sintoma', type: 'string' as const, sortable: true },
      { text: 'Categoría', width: '35%', key: 'categoria', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '15%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroCodigo = ref('');
    const filtroSintoma = ref('');
    const filtroCategoria = ref('');
    // Filtrado de síntomas
    const sintomasFiltrados = computed(() => {
      return sintomas.value.filter(a => {
        const codigoMatch = !filtroCodigo.value || a.codigo.toLowerCase().includes(filtroCodigo.value.toLowerCase());
        const sintomaMatch = !filtroSintoma.value || a.sintoma.toLowerCase().includes(filtroSintoma.value.toLowerCase());
        const categoriaMatch = !filtroCategoria.value || a.categoria.toLowerCase().includes(filtroCategoria.value.toLowerCase());
        return codigoMatch && sintomaMatch && categoriaMatch;
      });
    });
    // Offcanvas agregar síntoma
    const showOffcanvasAgregar = ref(false);
    const abrirOffcanvasAgregar = () => {
      showOffcanvasAgregar.value = true;
    };
    const cerrarOffcanvasAgregar = () => {
      showOffcanvasAgregar.value = false;
    };
    // Offcanvas categorías
    const showOffcanvasCategorias = ref(false);
    const abrirOffcanvasCategorias = () => {
      showOffcanvasCategorias.value = true;
    };
    const cerrarOffcanvasCategorias = () => {
      showOffcanvasCategorias.value = false;
    };
    // Nueva síntoma
    const nuevoSintoma = ref({ codigo: '', sintoma: '', categoria: '' });
    const guardarSintoma = () => {
      if (!nuevoSintoma.value.codigo || !nuevoSintoma.value.sintoma || !nuevoSintoma.value.categoria) return;
      sintomas.value.push({
        codigo: nuevoSintoma.value.codigo,
        sintoma: nuevoSintoma.value.sintoma,
        categoria: nuevoSintoma.value.categoria
      });
      nuevoSintoma.value = { codigo: '', sintoma: '', categoria: '' };
      cerrarOffcanvasAgregar();
    };
    // Categorías de síntomas (ejemplo)
    const categoriasSintoma = ref([
      { categoria: 'Anormalidades de la respiración', descripcion: 'Lorem Ipsum is simply dummy text simply dummy text simply dummy text' },
      { categoria: 'Dolor de garganta y en el pecho', descripcion: 'Lorem Ipsum is simply dummy text simply dummy text simply dummy text' },
      { categoria: 'Dolor abdominal y pélvico', descripcion: 'Lorem Ipsum is simply dummy text simply dummy text simply dummy text' },
      { categoria: 'Náusea y vómito', descripcion: 'Lorem Ipsum is simply dummy text simply dummy text is simply' },
      { categoria: 'Alteraciones de la sensibilidad cutánea', descripcion: 'Lorem Ipsum is simply dummy text simply dummy text' }
    ]);
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroCodigo.value = '';
      filtroSintoma.value = '';
      filtroCategoria.value = '';
    };
    return {
      headers,
      sintomas,
      sintomasFiltrados,
      filtroCodigo,
      filtroSintoma,
      filtroCategoria,
      showOffcanvasAgregar,
      abrirOffcanvasAgregar,
      cerrarOffcanvasAgregar,
      nuevoSintoma,
      guardarSintoma,
      showOffcanvasCategorias,
      abrirOffcanvasCategorias,
      cerrarOffcanvasCategorias,
      categoriasSintoma,
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
.table-bordered th, .table-bordered td {
  border: 1px solid #dee2e6;
}
</style>
