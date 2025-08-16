<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row g-1 align-items-center">
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0 text-secondary text-sm text-nowrap">Seguro</label>
          <select class="form-select form-select-sm w-auto">
            <option value="">Seguro</option>
            <option>SIS</option>
            <option>Particular</option>
            <option>EPS</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0 text-secondary text-sm text-nowrap">Nro Doc</label>
          <input class="form-control form-control-sm w-auto" placeholder="Nro Documento" />
        </div>
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0 text-secondary text-sm text-nowrap">Nombre</label>
          <input class="form-control form-control-sm w-auto" placeholder="Nombre" />
        </div>
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0 text-secondary text-sm text-nowrap">Apellido Pat.</label>
          <input class="form-control form-control-sm w-auto" placeholder="Apellido Paterno" />
        </div>
        <div class="col-md-2 d-flex align-items-center gap-1">
          <label class="form-label fw-bold mb-0 text-secondary text-sm text-nowrap">Apellido Mat.</label>
          <input class="form-control form-control-sm w-auto" placeholder="Apellido Materno" />
        </div>
        <div class="col-md-2 d-flex align-items-center justify-content-end gap-2">
          <button class="btn btn-success btn-sm d-flex align-items-center gap-1">
            <i class="ti ti-search"></i> Buscar
          </button>
          <button class="btn btn-secondary btn-sm d-flex align-items-center">
            <i class="fa fa-broom"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <CardLayout :title="'Pacientes'" :clase="'text-white'" :clasehead="'bg-blue-800 border-0'">
    <template #buttons>
      <div class="d-flex columns justify-content-end">
        <button class="btn btn-success b-dark btn-sm mx-1">
          <i class="ti ti-refresh"></i>
        </button>
        <button class="btn btn-warning btn-sm mx-1">
          <i class="fa fa-broom"></i>
        </button>
      </div>
    </template>
    <template #default>
      <!-- Tabla de pacientes -->
      <div class="card mt-2">
        <div class="card-body mx-0 p-1">
          <DataTable
            :headers="headers"
            :items="listaPacientes"
            :filterKeys="['nombre', 'apellidos', 'dni', 'email', 'celular', 'direccion', 'tiposeguro', 'estado']"
            :clasehead="'bg-blue-800 text-white'"
            :selectable="true"
            :itemIdKey="'id'"
            :auto-height="true"
            :height-offset="120"
            :loading="isLoading"
            :loadingLabel="'Cargando pacientes'"
            @selection-change="onSelectionChange"
            ref="dataTableRef"
          >
            <template #default="{ item, index, currentPage, itemsPerPage, selectable, isItemSelected, toggleSelectItem, itemIdKey, handleMouseDown, isDragging, focusedRowIndex, isKeyboardNavigation }">
              <tr @click="handleRowClick(item, index, $event)" @mousedown="handleMouseDown(index, $event)"
                :class="{ 
                'bg-blue-100 bg-opacity-25': selectable && isItemSelected(item[itemIdKey]) && !(isKeyboardNavigation && focusedRowIndex === index),
                'keyboard-focused': isKeyboardNavigation && focusedRowIndex === index
                }">
                <td v-if="selectable" class="text-center mx-2 px-2" width="2%" @click.stop>
                  <div class="form-check form-check-inline m-0 pc-icon-checkbox">
                    <input 
                      type="checkbox"
                      class="form-check-input"
                      :checked="isItemSelected(item[itemIdKey])"
                      @change="toggleSelectItem(item[itemIdKey])"
                    />
                    <i class="material-icons-two-tone pc-icon-uncheck">check_box_outline_blank</i>
                    <i class="material-icons-two-tone text-primary pc-icon-check">check_box</i>
                  </div>
                </td>
                <td class="mx-0 text-center f-12 px-1">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="text-wrap f-12 f-w-500">{{ item.nombre }} {{ item.apellidos }}</td>
                <td class="text-wrap f-12">{{ item.dni }}</td>
                <td class="text-wrap f-12">{{ item.email }}</td>
                <td class="text-wrap f-12">{{ item.celular }}</td>
                <td class="text-wrap f-12">{{ item.direccion }}</td>
                <td class="text-wrap f-12">{{ item.tiposeguro }}</td>
                <td><span :class="item.estado === 'Activo' ? 'badge bg-success' : 'badge bg-danger'">{{ item.estado }}</span></td>
                <td class="text-wrap d-flex">
                  <button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
                  <button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
                </td>
              </tr>
            </template>
          </DataTable>
        </div>
      </div>
    </template>
  </CardLayout>

  <!-- Offcanvas detalle paciente -->
  <div v-if="pacienteSeleccionado" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
    <div class="offcanvas-panel bg-white shadow-lg">
      <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
        <h5 class="fw-bold text-primary mb-0"><i class="fa fa-user-md me-2"></i> Detalle paciente</h5>
        <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
      </div>
      <div class="offcanvas-body px-4 py-3">
        <div class="mb-3">
          <span class="fw-bold text-secondary">Estado</span>
          <span :class="pacienteSeleccionado.estado === 'Activo' ? 'badge bg-success ms-2' : 'badge bg-danger ms-2'">
            <i class="fa fa-check-circle me-1" v-if="pacienteSeleccionado.estado === 'Activo'"></i>
            <i class="fa fa-times-circle me-1" v-else></i>
            {{ pacienteSeleccionado.estado }}
          </span>
        </div>
        <div class="mb-3">
          <span class="fw-bold text-secondary"><i class="fa fa-id-card me-2"></i> DNI</span>
          <span class="ms-2">{{ pacienteSeleccionado.dni }}</span>
        </div>
        <div class="mb-3">
          <span class="fw-bold text-secondary"><i class="fa fa-user me-2"></i> Nombre</span>
          <span class="ms-2">{{ pacienteSeleccionado.nombre }} {{ pacienteSeleccionado.apellidos }}</span>
        </div>
        <div class="mb-3">
          <span class="fw-bold text-secondary"><i class="fa fa-envelope me-2"></i> Email</span>
          <span class="ms-2">{{ pacienteSeleccionado.email }}</span>
        </div>
        <div class="mb-3">
          <span class="fw-bold text-secondary"><i class="fa fa-phone me-2"></i> Celular</span>
          <span class="ms-2">{{ pacienteSeleccionado.celular }}</span>
        </div>
        <div class="mb-3">
          <span class="fw-bold text-secondary"><i class="fa fa-map-marker-alt me-2"></i> Dirección</span>
          <span class="ms-2">{{ pacienteSeleccionado.direccion }}</span>
        </div>
        <div class="mb-3">
          <span class="fw-bold text-secondary"><i class="fa fa-shield-alt me-2"></i> Seguro</span>
          <span class="ms-2">{{ pacienteSeleccionado.tiposeguro }}</span>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <button class="btn btn-primary me-2"><i class="fa fa-edit me-1"></i> Editar</button>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i> Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DataTable from '../../components/table/DataTable.vue';
import CardLayout from '../../layout/CardLayout.vue';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  components: {
    DataTable,
    CardLayout
  },
  setup() {
    const isLoading = ref(false);
    const dataTableRef = ref();
    const listaPacientes = ref([
      {
        id: 1,
        nombre: 'Carlos',
        apellidos: 'Ramírez',
        dni: '12345678',
        email: 'carlos.ramirez@ejemplo.com',
        celular: '999888777',
        direccion: 'Av. Siempre Viva 123',
        tiposeguro: 'SIS',
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'Lucía',
        apellidos: 'Fernández',
        dni: '87654321',
        email: 'lucia.fernandez@ejemplo.com',
        celular: '888777666',
        direccion: 'Jr. Los Olivos 456',
        tiposeguro: 'Particular',
        estado: 'Inactivo'
      },
      {
        id: 3,
        nombre: 'Pedro',
        apellidos: 'Gómez',
        dni: '11223344',
        email: 'pedro.gomez@ejemplo.com',
        celular: '911223344',
        direccion: 'Calle Falsa 123',
        tiposeguro: 'EPS',
        estado: 'Activo'
      },
      {
        id: 4,
        nombre: 'María',
        apellidos: 'Lozano',
        dni: '44332211',
        email: 'maria.lozano@ejemplo.com',
        celular: '944332211',
        direccion: 'Av. Primavera 789',
        tiposeguro: 'SIS',
        estado: 'Activo'
      },
      {
        id: 5,
        nombre: 'Jorge',
        apellidos: 'Vargas',
        dni: '55667788',
        email: 'jorge.vargas@ejemplo.com',
        celular: '955667788',
        direccion: 'Jr. Las Flores 321',
        tiposeguro: 'Particular',
        estado: 'Inactivo'
      }
    ]);
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false, filterable: false },
      { text: 'NOMBRE', width: '18%', key: 'nombre', type: 'string' as const, sortable: true, filterable: true },
      { text: 'DNI', width: '10%', key: 'dni', type: 'string' as const, sortable: true, filterable: true },
      { text: 'EMAIL', width: '15%', key: 'email', type: 'string' as const, sortable: true, filterable: true },
      { text: 'CELULAR', width: '10%', key: 'celular', type: 'string' as const, sortable: true, filterable: true },
      { text: 'DIRECCIÓN', width: '15%', key: 'direccion', type: 'string' as const, sortable: true, filterable: true },
      { text: 'SEGURO', width: '10%', key: 'tiposeguro', type: 'string' as const, sortable: true, filterable: true },
      { text: 'ESTADO', width: '8%', key: 'estado', type: 'string' as const, sortable: true, filterable: true },
      { text: 'ACCIONES', width: '11%', key: 'acciones', type: 'string' as const, sortable: false, filterable: false },
    ]);

    // Estado para offcanvas
    const pacienteSeleccionado = ref<any | null>(null);

    // Mostrar offcanvas al seleccionar paciente
    const handleRowClick = (
      item: Record<string, unknown>,
      index: number,
      event: MouseEvent
    ) => {
      const target = event.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.btn') ||
        target.tagName === 'INPUT'
      ) {
        return;
      }
      if (dataTableRef.value && dataTableRef.value.toggleSelectItem) {
        dataTableRef.value.toggleSelectItem(item.id);
      }
      pacienteSeleccionado.value = item;
    };

    const cerrarOffcanvas = () => {
      pacienteSeleccionado.value = null;
    };

    const onSelectionChange = () => {};
    return {
      headers,
      listaPacientes,
      isLoading,
      dataTableRef,
      onSelectionChange,
      handleRowClick,
      pacienteSeleccionado,
      cerrarOffcanvas
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
