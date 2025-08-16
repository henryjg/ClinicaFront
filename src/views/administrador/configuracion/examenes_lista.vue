<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-5 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Examen</label>
          <input v-model="filtroExamen" class="form-control form-control-sm w-auto" placeholder="Buscar examen" />
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

  <!-- Tabla de exámenes usando DataTable -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTable
        :headers="headers"
        :items="examenesFiltrados"
        :filterKeys="['examen', 'descripcion']"
        :selectable="false"
        :autoHeight="true"
      >
        <template #default="{ item, index }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ index + 1 }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.examen }}</td>
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

  <!-- Offcanvas personalizado agregar examen -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-vial me-2"></i> Nuevo examen</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarExamen">
          <div class="mb-3">
            <label class="form-label">Examen <span class="text-danger">*</span></label>
            <input v-model="nuevoExamen.examen" class="form-control" placeholder="Ingrese el examen" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción <span class="text-danger">*</span></label>
            <input v-model="nuevoExamen.descripcion" class="form-control" placeholder="Ingrese la descripción" />
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
    // Datos de ejemplo exámenes
    const examenes = ref([
      { examen: 'Análisis de hemoglobina', descripcion: 'Mide los niveles de hemoglobina en la sangre' },
      { examen: 'Análisis de complemento', descripcion: 'Mide los niveles y/o la actividad de un grupo de proteínas que forman parte del sistema del complemento' },
      { examen: 'Análisis de líquido sinovial', descripcion: 'Estas pruebas buscan la causa del dolor y la hinchazón en las articulaciones.' },
      { examen: 'Biopsia de piel', descripcion: 'Procedimiento en el que se extrae una pequeña muestra de piel para examinarla' },
      { examen: 'Conteo de glóbulos blancos', descripcion: 'Este conteo mide el número de glóbulos blancos en la sangre.' },
      { examen: 'Conteo de glóbulos rojos', descripcion: 'El conteo de glóbulos rojos mide el número de glóbulos rojos,' },
      { examen: 'Conteo sanguíneo completo', descripcion: 'Un conteo sanguíneo completo o CSC es un análisis de sangre que mide muchos componentes y características de la sangre.' },
      { examen: 'Evaluación de trastornos del espectro autista (TEA)', descripcion: 'El trastorno del espectro autista (TEA) es un problema del desarrollo causado por diferencias en el cerebro de una persona.' }
    ]);
    // Headers para DataTable
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'Examen', width: '47%', key: 'examen', type: 'string' as const, sortable: true },
      { text: 'Descripción', width: '37%', key: 'descripcion', type: 'string' as const, sortable: true },
      { text: 'Acciones', width: '13%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);
    // Filtros
    const filtroExamen = ref('');
    const filtroDescripcion = ref('');
    // Filtrado de exámenes
    const examenesFiltrados = computed(() => {
      return examenes.value.filter(a => {
        const examenMatch = !filtroExamen.value || a.examen.toLowerCase().includes(filtroExamen.value.toLowerCase());
        const descMatch = !filtroDescripcion.value || a.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase());
        return examenMatch && descMatch;
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
    // Nuevo examen
    const nuevoExamen = ref({ examen: '', descripcion: '' });
    const guardarExamen = () => {
      if (!nuevoExamen.value.examen || !nuevoExamen.value.descripcion) return;
      examenes.value.push({
        examen: nuevoExamen.value.examen,
        descripcion: nuevoExamen.value.descripcion
      });
      nuevoExamen.value = { examen: '', descripcion: '' };
      cerrarOffcanvas();
    };
    // Limpiar filtros
    const limpiarFiltros = () => {
      filtroExamen.value = '';
      filtroDescripcion.value = '';
    };
    return {
      headers,
      examenes,
      examenesFiltrados,
      filtroExamen,
      filtroDescripcion,
      showOffcanvas,
      abrirOffcanvas,
      cerrarOffcanvas,
      nuevoExamen,
      guardarExamen,
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
