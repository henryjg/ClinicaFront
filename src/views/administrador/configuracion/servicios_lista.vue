<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Servicio</label>
          <input v-model="filtroServicio" class="form-control form-control-sm w-auto" placeholder="Buscar servicio" />
        </div>
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Descripción</label>
          <input v-model="filtroDescripcion" class="form-control form-control-sm w-auto" placeholder="Buscar descripción" />
        </div>
        <div class="col-md-3 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Duración</label>
          <input v-model="filtroDuracion" class="form-control form-control-sm w-auto" placeholder="Buscar duración" />
        </div>
        <div class="col-md-3 d-flex align-items-center justify-content-end gap-2">
          <button class="btn btn-primary btn-sm d-flex align-items-center gap-1" @click="abrirOffcanvas">
            <i class="fa fa-plus"></i> Agregar servicio
          </button>
          <button class="btn btn-secondary btn-sm d-flex align-items-center" @click="limpiarFiltros">
            <i class="fa fa-broom"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla de servicios -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th>Servicio</th>
            <th>Descripción</th>
            <th>Duración</th>
            <th>Valor</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in serviciosFiltrados" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.servicio }}</td>
            <td>{{ item.descripcion }}</td>
            <td>{{ item.duracion }}</td>
            <td>{{ item.valor }}</td>
            <td class="text-center">
              <button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
              <button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Offcanvas personalizado agregar servicio -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-plus me-2"></i> Nuevo servicio</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarServicio">
          <div class="mb-3">
            <label class="form-label">Servicio <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="form.servicio" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="form.descripcion" required />
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label">Duración <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.duracion" required />
            </div>
            <div class="col">
              <label class="form-label">Valor <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.valor" required />
            </div>
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

export default defineComponent({
  setup() {
    // Filtros
    const filtroServicio = ref('');
    const filtroDescripcion = ref('');
    const filtroDuracion = ref('');

    // Datos de ejemplo
    const servicios = ref([
      { servicio: 'Consulta general', descripcion: 'Lorem Ipsum is simply dummy text', duracion: '01h 00min', valor: 'S/ 150.00' },
      { servicio: 'Interconsulta', descripcion: 'Lorem Ipsum is simply dummy text', duracion: '01h 00min', valor: 'S/ 120.00' },
      { servicio: 'Segunda opinión', descripcion: '-', duracion: '00h 30min', valor: 'S/ 100.00' },
      { servicio: 'Consulta especializada', descripcion: 'Lorem Ipsum is simply dummy text', duracion: '01h 00min', valor: 'S/ 200.00' },
      { servicio: 'Lectura de resultados', descripcion: 'Lorem Ipsum is simply dummy text', duracion: '00h 15min', valor: 'S/ 50.00' },
      { servicio: 'Otro', descripcion: 'Lorem Ipsum is simply dummy text', duracion: '00h 30min', valor: 'S/ 100.00' },
    ]);

    // Filtro reactivo
    const serviciosFiltrados = computed(() => {
      return servicios.value.filter(m =>
        (filtroServicio.value === '' || m.servicio.toLowerCase().includes(filtroServicio.value.toLowerCase())) &&
        (filtroDescripcion.value === '' || m.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase())) &&
        (filtroDuracion.value === '' || m.duracion.toLowerCase().includes(filtroDuracion.value.toLowerCase()))
      );
    });

    // Offcanvas
    const showOffcanvas = ref(false);
    const form = ref({
      servicio: '',
      descripcion: '',
      duracion: '',
      valor: ''
    });
    const abrirOffcanvas = () => {
      showOffcanvas.value = true;
    };
    const cerrarOffcanvas = () => {
      showOffcanvas.value = false;
      form.value = { servicio: '', descripcion: '', duracion: '', valor: '' };
    };
    const guardarServicio = () => {
      servicios.value.push({
        servicio: form.value.servicio,
        descripcion: form.value.descripcion,
        duracion: form.value.duracion,
        valor: form.value.valor
      });
      cerrarOffcanvas();
    };
    const limpiarFiltros = () => {
      filtroServicio.value = '';
      filtroDescripcion.value = '';
      filtroDuracion.value = '';
    };
    return {
      filtroServicio,
      filtroDescripcion,
      filtroDuracion,
      servicios,
      serviciosFiltrados,
      showOffcanvas,
      form,
      abrirOffcanvas,
      cerrarOffcanvas,
      guardarServicio,
      limpiarFiltros
    };
  }
});
</script>

<style scoped>
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
