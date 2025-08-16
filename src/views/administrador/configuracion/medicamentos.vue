<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Tipo</label>
          <select class="form-select form-select-sm w-auto" v-model="filtroTipo">
            <option value="">Todos</option>
            <option>Genérico</option>
            <option>Comercial</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Categoría</label>
          <select class="form-select form-select-sm w-auto" v-model="filtroCategoria">
            <option value="">Todas</option>
            <option>Analgésicos</option>
            <option>Antidiarreicos</option>
            <option>Antipiréticos</option>
            <option>Antimicóticos</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0">Medicamento</label>
          <input class="form-control form-control-sm w-auto" v-model="filtroNombre" placeholder="Buscar por nombre" />
        </div>
        <div class="col-md-6 d-flex align-items-center justify-content-end gap-2">
          <button class="btn btn-primary btn-sm d-flex align-items-center gap-1" @click="abrirOffcanvas">
            <i class="fa fa-plus"></i> Agregar medicamento
          </button>
          <button class="btn btn-secondary btn-sm d-flex align-items-center" @click="limpiarFiltros">
            <i class="fa fa-broom"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabla de medicamentos -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th>Tipo</th>
            <th>Medicamento</th>
            <th>Vía de administración</th>
            <th>Cmax.</th>
            <th>Categoría</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in medicamentosFiltrados" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.tipo }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.via }}</td>
            <td>{{ item.cmax }}</td>
            <td>
              <span :class="['badge', categoriaColor(item.categoria)]">{{ item.categoria }}</span>
            </td>
            <td class="text-center">
              <button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
              <button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Offcanvas personalizado agregar medicamento -->
  <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-plus me-2"></i> Nuevo medicamento</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <form @submit.prevent="guardarMedicamento">
          <div class="mb-3 d-flex align-items-center gap-2">
            <label class="form-label mb-0">Genérico</label>
            <label class="switch">
              <input type="checkbox" v-model="form.generico" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="mb-3">
            <label class="form-label">Medicamento <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="form.nombre" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Categoría <span class="text-danger">*</span></label>
            <select class="form-select" v-model="form.categoria" required>
              <option value="">Seleccione</option>
              <option>Analgésicos</option>
              <option>Antidiarreicos</option>
              <option>Antipiréticos</option>
              <option>Antimicóticos</option>
            </select>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label">Vía administración <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.via" required />
            </div>
            <div class="col">
              <label class="form-label">Cmax. <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="form.cmax" required />
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
    const filtroTipo = ref('');
    const filtroCategoria = ref('');
    const filtroNombre = ref('');

    // Datos de ejemplo
    const medicamentos = ref([
      { tipo: 'Genérico', nombre: 'Aspirina (ácido acetilsalicílico)', via: 'Oral', cmax: '100 mg', categoria: 'Analgésicos' },
      { tipo: 'Comercial', nombre: 'Somatostatina', via: 'Subcutánea', cmax: '200 mg', categoria: 'Antidiarreicos' },
      { tipo: 'Genérico', nombre: 'Paracetamol (acetaminofén)', via: 'Oral', cmax: '100 mg', categoria: 'Antipiréticos' },
      { tipo: 'Genérico', nombre: 'Fluconazol', via: 'Oral', cmax: '100 mg', categoria: 'Antimicóticos' },
      { tipo: 'Comercial', nombre: 'Prometazina', via: 'Intramuscular', cmax: '100 mg', categoria: 'Analgésicos' },
      { tipo: 'Genérico', nombre: 'Anfotericina B', via: 'Intravenosa', cmax: '100 mg', categoria: 'Antimicóticos' },
    ]);

    // Filtro reactivo
    const medicamentosFiltrados = computed(() => {
      return medicamentos.value.filter(m =>
        (filtroTipo.value === '' || m.tipo === filtroTipo.value) &&
        (filtroCategoria.value === '' || m.categoria === filtroCategoria.value) &&
        (filtroNombre.value === '' || m.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase()))
      );
    });

    // Offcanvas
    const showOffcanvas = ref(false);
    const form = ref({
      generico: false,
      nombre: '',
      categoria: '',
      via: '',
      cmax: ''
    });
    const abrirOffcanvas = () => {
      showOffcanvas.value = true;
    };
    const cerrarOffcanvas = () => {
      showOffcanvas.value = false;
      form.value = { generico: false, nombre: '', categoria: '', via: '', cmax: '' };
    };
    const guardarMedicamento = () => {
      medicamentos.value.push({
        tipo: form.value.generico ? 'Genérico' : 'Comercial',
        nombre: form.value.nombre,
        categoria: form.value.categoria,
        via: form.value.via,
        cmax: form.value.cmax
      });
      cerrarOffcanvas();
    };
    const limpiarFiltros = () => {
      filtroTipo.value = '';
      filtroCategoria.value = '';
      filtroNombre.value = '';
    };
    // Badge color para categoría
    const categoriaColor = (cat: string) => {
      switch (cat) {
        case 'Analgésicos': return 'bg-success';
        case 'Antidiarreicos': return 'bg-secondary';
        case 'Antipiréticos': return 'bg-primary';
        case 'Antimicóticos': return 'bg-danger';
        default: return 'bg-light text-dark';
      }
    };
    return {
      filtroTipo,
      filtroCategoria,
      filtroNombre,
      medicamentos,
      medicamentosFiltrados,
      showOffcanvas,
      form,
      abrirOffcanvas,
      cerrarOffcanvas,
      guardarMedicamento,
      limpiarFiltros,
      categoriaColor
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
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e0e0e0;
  transition: .4s;
  border-radius: 22px;
}
.switch input:checked + .slider {
  background-color: #1565c0;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.switch input:checked + .slider:before {
  transform: translateX(18px);
}
.badge {
  font-size: 0.95em;
  padding: 0.45em 1em;
  border-radius: 1em;
}
</style>
