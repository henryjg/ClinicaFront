<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Tipo de antecedente</label>
          <select v-model="filtroTipo" class="form-select form-select-sm w-auto">
            <option value="">Todos</option>
            <option v-for="tipo in tiposAntecedente" :key="tipo">{{ tipo }}</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Descripción</label>
          <input v-model="filtroDescripcion" class="form-control form-control-sm w-auto" placeholder="Buscar por descripción" />
        </div>
        <div class="col-md-5 d-flex align-items-center justify-content-end gap-2">
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

  <!-- Tabla de antecedentes usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="antecedentesFiltrados"
        :filterKeys="['tipo', 'descripcion']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.tipo }}</td>
            <td class="text-wrap f-12">{{ item.descripcion }}</td>
            <td class="text-wrap d-flex">
              <button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
              <button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
            </td>
          </tr>
        </template>
      </DataTable>
    </div>
  </div>

  <!-- Offcanvas personalizado agregar antecedente -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-file-medical me-2"></i> Nuevo antecedente</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarAntecedente">
          <div class="mb-3">
            <label class="form-label">Tipo de antecedente <span class="text-danger">*</span></label>
            <select v-model="nuevoAntecedente.tipo" class="form-select">
              <option v-for="tipo in tiposAntecedente" :key="tipo">{{ tipo }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción <span class="text-danger">*</span></label>
            <textarea v-model="nuevoAntecedente.descripcion" class="form-control" rows="3" placeholder="Ingrese la descripción"></textarea>
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
import { defineComponent, ref, computed, onMounted } from 'vue';
import DataTable from '../../../components/table/DataTable.vue';

export default defineComponent({
  components: { DataTable },
  setup() {
    // Tipos de antecedente según la imagen
    const tiposAntecedente = [
      'Especial',
      'Neonatal',
      'Familiares',
      'No patológico',
      'Ocupacional',
      'Patológico',
      'Prenatal',
      'Quirúrgico'
    ];
    // Datos de ejemplo
    const antecedentes = ref([
      { tipo: 'Especial', descripcion: 'Ejemplo de antecedente especial.' },
      { tipo: 'Neonatal', descripcion: 'Antecedente neonatal del paciente.' },
      { tipo: 'Familiares', descripcion: 'Antecedentes familiares relevantes.' },
      { tipo: 'No patológico', descripcion: 'No presenta antecedentes patológicos.' },
      { tipo: 'Ocupacional', descripcion: 'Antecedente relacionado con ocupación.' },
      { tipo: 'Patológico', descripcion: 'Antecedente patológico registrado.' },
      { tipo: 'Prenatal', descripcion: 'Antecedente prenatal del paciente.' },
      { tipo: 'Quirúrgico', descripcion: 'Antecedente de cirugía previa.' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Tipo de antecedente', width: '20%', key: 'tipo', type: 'string' as const, sortable: true },
      { text: 'Descripción', width: '60%', key: 'descripcion', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '17%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroTipo = ref('');
    const filtroDescripcion = ref('');
    // Filtrado de antecedentes
    const antecedentesFiltrados = computed(() => {
      return antecedentes.value.filter(a => {
        const tipoMatch = !filtroTipo.value || a.tipo === filtroTipo.value;
        const descMatch = !filtroDescripcion.value || a.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase());
        return tipoMatch && descMatch;
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
    // Nuevo antecedente
    const nuevoAntecedente = ref({ tipo: tiposAntecedente[0], descripcion: '' });
    const guardarAntecedente = () => {
      if (!nuevoAntecedente.value.tipo || !nuevoAntecedente.value.descripcion) return;
      antecedentes.value.push({
        tipo: nuevoAntecedente.value.tipo,
        descripcion: nuevoAntecedente.value.descripcion
      });
      nuevoAntecedente.value = { tipo: tiposAntecedente[0], descripcion: '' };
      cerrarOffcanvas();
    };
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroTipo.value = '';
      filtroDescripcion.value = '';
    };
  // No se requiere onMounted para offcanvas personalizado
    return {
      headers,
      antecedentes,
      tiposAntecedente,
      antecedentesFiltrados,
      filtroTipo,
      filtroDescripcion,
      showOffcanvas,
      abrirOffcanvas,
      cerrarOffcanvas,
      nuevoAntecedente,
      guardarAntecedente,
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
