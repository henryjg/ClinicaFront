<template>
  <!-- Filtros superiores -->
  <div class="d-print-none card mb-3">
    <div class="card-body py-3 px-4">
      <div class="row align-items-center gx-2 gy-2">
        <div class="col-lg-4 col-md-5 col-12">
          <label class="form-label text-secondary text-sm f-w-600 mb-1">Especialidad</label>
          <select class="form-select">
            <option value="">Seleccionar especialidad</option>
            <option>Cardiología</option>
            <option>Pediatría</option>
            <option>Dermatología</option>
            <option>Traumatología</option>
          </select>
        </div>
        <div class="col-lg-4 col-md-4 col-12">
          <label class="form-label text-secondary text-sm f-w-600 mb-1">Nombre</label>
          <input class="form-control" placeholder="Buscar por nombre" />
        </div>
        <div class="col-lg-2 col-md-2 col-6">
          <label class="form-label text-secondary text-sm f-w-600 mb-1">Estado</label>
          <select class="form-select bg-light">
            <option value="">Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-1 col-6 d-flex align-items-end gap-2">
          <button class="btn btn-primary w-50">
            <i class="ti ti-search"></i> Buscar
          </button>
          <button class="btn btn-secondary w-50">
            <i class="fa fa-broom"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="mb-0">Lista de médicos</h5>
        <button class="btn btn-primary d-flex align-items-center" @click="mostrarOffcanvas = true">
          <i class="fa fa-plus me-2"></i> Agregar médico
        </button>
      </div>
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
      <!-- Offcanvas para agregar médico -->
      <div class="offcanvas offcanvas-end show" tabindex="-1" v-if="mostrarOffcanvas" style="visibility: visible; background: #fff; box-shadow: -2px 0 16px rgba(0,0,0,0.08); width: 400px;">
        <div class="offcanvas-header border-bottom">
          <h5 class="offcanvas-title"><i class="fa fa-user-md me-2 text-primary"></i> Nuevo médico</h5>
          <button type="button" class="btn-close" @click="cerrarOffcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <form @submit.prevent="guardarMedico">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="nuevoMedico.nombre" type="text" class="form-control" placeholder="Nombre" />
            </div>
            <div class="mb-3">
              <label class="form-label">Apellido</label>
              <input v-model="nuevoMedico.apellido" type="text" class="form-control" placeholder="Apellido" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="nuevoMedico.email" type="email" class="form-control" placeholder="Email" />
            </div>
            <div class="mb-3">
              <label class="form-label">Contacto</label>
              <input v-model="nuevoMedico.numero_contacto" type="text" class="form-control" placeholder="Número de contacto" />
            </div>
            <div class="mb-3">
              <label class="form-label">Celular</label>
              <input v-model="nuevoMedico.celular" type="text" class="form-control" placeholder="Celular" />
            </div>
            <div class="mb-3">
              <label class="form-label">Especialidad</label>
              <select v-model="nuevoMedico.especialidad" class="form-select">
                <option value="">Seleccionar especialidad</option>
                <option>Cardiología</option>
                <option>Pediatría</option>
                <option>Dermatología</option>
                <option>Traumatología</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select v-model="nuevoMedico.estado" class="form-select">
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            <div class="d-flex justify-content-end mt-4">
              <button type="button" class="btn btn-light me-2" @click="cerrarOffcanvas">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
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

    // Estado para mostrar/ocultar el offcanvas
    const mostrarOffcanvas = ref(false);
    // Modelo para nuevo médico
    const nuevoMedico = ref({
      nombre: '',
      apellido: '',
      email: '',
      numero_contacto: '',
      celular: '',
      especialidad: '',
      estado: 'Activo'
    });

    function cerrarOffcanvas() {
      mostrarOffcanvas.value = false;
      // Limpiar el modelo si se desea
      nuevoMedico.value = {
        nombre: '',
        apellido: '',
        email: '',
        numero_contacto: '',
        celular: '',
        especialidad: '',
        estado: 'Activo'
      };
    }

    function guardarMedico() {
      // Validación simple
      if (!nuevoMedico.value.nombre || !nuevoMedico.value.apellido || !nuevoMedico.value.email) return;
      listaMedicos.value.push({ ...nuevoMedico.value });
      cerrarOffcanvas();
    }

    return {
      headers,
      listaMedicos,
      mostrarOffcanvas,
      nuevoMedico,
      cerrarOffcanvas,
      guardarMedico
    };
  }
});
</script>
