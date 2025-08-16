<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-5 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Vacuna</label>
          <input v-model="filtroVacuna" class="form-control form-control-sm w-auto" placeholder="Buscar vacuna" />
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

  <!-- Tabla de vacunas usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="vacunasFiltradas"
        :filterKeys="['vacuna', 'descripcion']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.vacuna }}</td>
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

  <!-- Offcanvas personalizado agregar vacuna -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-syringe me-2"></i> Nueva vacuna</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarVacuna">
          <div class="mb-3">
            <label class="form-label">Vacuna <span class="text-danger">*</span></label>
            <input v-model="nuevaVacuna.vacuna" class="form-control" placeholder="Ingrese la vacuna" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción <span class="text-danger">*</span></label>
            <input v-model="nuevaVacuna.descripcion" class="form-control" placeholder="Ingrese la descripción" />
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
    const vacunas = ref([
      { vacuna: 'Sarampión', descripcion: '' },
      { vacuna: 'Varicela', descripcion: '' },
      { vacuna: 'Viruela', descripcion: '' },
      { vacuna: 'Fiebre amarilla', descripcion: '' },
      { vacuna: 'Hepatitis A', descripcion: '' },
      { vacuna: 'Gripe', descripcion: '' },
      { vacuna: 'Virus papiloma humano', descripcion: '' },
      { vacuna: 'Poliomelitis', descripcion: '' },
      { vacuna: 'Tétanos', descripcion: '' },
      { vacuna: 'Gripe', descripcion: '' },
      { vacuna: 'Vacuna contra la influenza', descripcion: '' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Vacuna', width: '47%', key: 'vacuna', type: 'string' as const, sortable: true },
      { text: 'Descripción', width: '37%', key: 'descripcion', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '13%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroVacuna = ref('');
    const filtroDescripcion = ref('');
    // Filtrado de vacunas
    const vacunasFiltradas = computed(() => {
      return vacunas.value.filter(a => {
        const vacunaMatch = !filtroVacuna.value || a.vacuna.toLowerCase().includes(filtroVacuna.value.toLowerCase());
        const descMatch = !filtroDescripcion.value || a.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase());
        return vacunaMatch && descMatch;
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
    // Nueva vacuna
    const nuevaVacuna = ref({ vacuna: '', descripcion: '' });
    const guardarVacuna = () => {
      if (!nuevaVacuna.value.vacuna || !nuevaVacuna.value.descripcion) return;
      vacunas.value.push({
        vacuna: nuevaVacuna.value.vacuna,
        descripcion: nuevaVacuna.value.descripcion
      });
      nuevaVacuna.value = { vacuna: '', descripcion: '' };
      cerrarOffcanvas();
    };
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroVacuna.value = '';
      filtroDescripcion.value = '';
    };
    return {
      headers,
      vacunas,
      vacunasFiltradas,
      filtroVacuna,
      filtroDescripcion,
      showOffcanvas,
      abrirOffcanvas,
      cerrarOffcanvas,
      nuevaVacuna,
      guardarVacuna,
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
