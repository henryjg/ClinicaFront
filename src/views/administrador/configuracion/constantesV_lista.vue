<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-5 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Constante vital</label>
          <input v-model="filtroConstante" class="form-control form-control-sm w-auto" placeholder="Buscar constante vital" />
        </div>
        <div class="col-md-5 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Descripción</label>
          <input v-model="filtroDescripcion" class="form-control form-control-sm w-auto" placeholder="Buscar descripción" />
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

  <!-- Tabla de constantes vitales usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="constantesFiltradas"
        :filterKeys="['constante', 'descripcion']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.constante }}</td>
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

  <!-- Offcanvas personalizado agregar constante vital -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-heartbeat me-2"></i> Nueva constante vital</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarConstante">
          <div class="mb-3">
            <label class="form-label">Constante vital <span class="text-danger">*</span></label>
            <input v-model="nuevaConstante.constante" class="form-control" placeholder="Ingrese la constante vital" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción <span class="text-danger">*</span></label>
            <input v-model="nuevaConstante.descripcion" class="form-control" placeholder="Ingrese la descripción" />
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
    // Datos de ejemplo
    const constantes = ref([
      { constante: 'Saturación de oxígeno', descripcion: '' },
      { constante: 'Presión arterial sistólica', descripcion: '' },
      { constante: 'Presión arterial diastolica', descripcion: '' },
      { constante: 'Presión arterial media', descripcion: '' },
      { constante: 'Diámetro cefálico', descripcion: '' },
      { constante: '% grasa temporal', descripcion: '' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Constante vital', width: '47%', key: 'constante', type: 'string' as const, sortable: true },
      { text: 'Descripción', width: '37%', key: 'descripcion', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '13%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroConstante = ref('');
    const filtroDescripcion = ref('');
    // Filtrado de constantes
    const constantesFiltradas = computed(() => {
      return constantes.value.filter(a => {
        const constanteMatch = !filtroConstante.value || a.constante.toLowerCase().includes(filtroConstante.value.toLowerCase());
        const descMatch = !filtroDescripcion.value || a.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase());
        return constanteMatch && descMatch;
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
    // Nueva constante vital
    const nuevaConstante = ref({ constante: '', descripcion: '' });
    const guardarConstante = () => {
      if (!nuevaConstante.value.constante || !nuevaConstante.value.descripcion) return;
      constantes.value.push({
        constante: nuevaConstante.value.constante,
        descripcion: nuevaConstante.value.descripcion
      });
      nuevaConstante.value = { constante: '', descripcion: '' };
      cerrarOffcanvas();
    };
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroConstante.value = '';
      filtroDescripcion.value = '';
    };
    return {
      headers,
      constantes,
      constantesFiltradas,
      filtroConstante,
      filtroDescripcion,
      showOffcanvas,
      abrirOffcanvas,
      cerrarOffcanvas,
      nuevaConstante,
      guardarConstante,
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
