<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body p-3">
      <div class="row">
        <div class="col-6 d-flex align-items-center">
          <label class="form-label px-2 text-secondary text-sm f-w-600 align-content-center text-nowrap">Especialidad</label>
          <input class="form-control f-6 mx-2" style="min-width: 250px;" placeholder="Seleccionar especialidad" />
        </div>
        <div class="col-4 d-flex align-items-center">
          <label class="form-label px-2 text-secondary text-sm f-w-600 text-nowrap">Nombre</label>
          <input class="form-control f-6 mx-2" style="min-width: 220px;" placeholder="Buscar por nombre" />
        </div>
      </div>
      <div class="d-flex pt-1">
        <div class="d-flex">
          <label class="form-label px-2 text-secondary text-sm f-w-600 align-content-center">Estado</label>
          <select class="form-select form-select-sm bg-light ">
            <option value="">Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        <button class="btn btn-primary mx-1">
          <i class="ti ti-search"></i> Buscar
        </button>
        <button class="btn btn-secondary btn-sm mx-1">
          <i class="fa fa-broom"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Tabla de médicos usando DataTablePaginacion -->
  <div class="card">
    <div class="card-body mx-0 p-1">
      <DataTablePaginacion
        :headers="headers"
        :items="listaMedicos"
        :currentPage="1"
        :perPage="10"
        :clasehead="'bg-info-200'"
      >
        <template #default="{ item, index, globalIndex }">
          <tr>
            <td class="mx-0 text-center f-12 px-1">{{ globalIndex }}</td>
            <td class="text-wrap f-12 f-w-500">{{ item.nombre }} {{ item.apellido }}</td>
            <td class="text-wrap f-12">{{ item.email }}</td>
            <td class="text-wrap f-12">{{ item.numero_contacto }}</td>
            <td class="text-wrap f-12">{{ item.celular }}</td>
            <td class="text-wrap f-12">{{ item.especialidad }}</td>
            <td><span :class="item.estado === 'Activo' ? 'badge bg-success' : 'badge bg-danger'">{{ item.estado }}</span></td>
            <td class="text-wrap d-flex">
              <button class="btn btn-light-warning btn-sm me-1"><i class="ti ti-edit"></i></button>
              <button class="btn btn-light-danger btn-sm"><i class="ti ti-trash"></i></button>
            </td>
          </tr>
        </template>
      </DataTablePaginacion>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import DataTablePaginacion from '../../components/table/DataTablePaginacion.vue';

export default defineComponent({
  components: {
    DataTablePaginacion
  },
  setup() {
    // Headers para la tabla de médicos
    const headers = ref([
      { text: '#', width: '3%', key: 'index', type: 'string' as const, sortable: false },
      { text: 'NOMBRE', width: '15%', key: 'nombre', type: 'string' as const, sortable: true },
      { text: 'EMAIL', width: '15%', key: 'email', type: 'string' as const, sortable: true },
      { text: 'CONTACTO', width: '10%', key: 'numero_contacto', type: 'string' as const, sortable: true },
      { text: 'CELULAR', width: '10%', key: 'celular', type: 'string' as const, sortable: true },
      { text: 'ESPECIALIDAD', width: '12%', key: 'especialidad', type: 'string' as const, sortable: true },
      { text: 'ESTADO', width: '8%', key: 'estado', type: 'string' as const, sortable: true },
      { text: 'ACCIONES', width: '10%', key: 'acciones', type: 'string' as const, sortable: false },
    ]);

    // Ejemplo de datos para la tabla
    const listaMedicos = ref([
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        numero_contacto: '123456789',
        celular: '987654321',
        especialidad: 'Cardiología',
        estado: 'Activo'
      },
      {
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana.garcia@ejemplo.com',
        numero_contacto: '234567890',
        celular: '876543210',
        especialidad: 'Pediatría',
        estado: 'Inactivo'
      }
    ]);

    return {
      headers,
      listaMedicos
    };
  }
});
</script>
