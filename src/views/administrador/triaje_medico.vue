<template>
  <div class="container py-4">
        <h5 class="fw-bold text-primary mb-2">Triaje</h5>
        <div class="d-flex align-items-center mb-2">
          <span class="fw-bold text-secondary me-2">Datos recopilados</span>
          <a href="#" class="text-primary text-decoration-none" @click.prevent="abrirOffcanvas">Editar</a>
        </div>
        <div class="mb-3">
          <div v-for="dato in datosRecopilados" :key="dato.key" class="d-flex align-items-center mb-2">
            <span class="me-2 fs-5" v-html="dato.icon"></span>
            <span class="me-2">{{ dato.label }}</span>
            <span :class="dato.habilitado ? 'badge bg-success' : 'badge bg-secondary'" class="ms-3">{{ dato.habilitado ? 'Habilitado' : 'Inactivo' }}</span>
          </div>
        </div>
        <hr>
        <div class="d-flex align-items-center mb-2">
          <span class="fw-bold text-primary me-2">Sistema de medición</span>
          <a href="#" class="text-primary text-decoration-none" @click.prevent="abrirOffcanvasSistema">Editar</a>
        </div>
        <div>
          <div v-for="sistema in sistemasMedicion" :key="sistema.key" class="d-flex align-items-center mb-2">
            <span class="me-2 fs-5" v-html="sistema.icon"></span>
            <span class="me-2">{{ sistema.label }}</span>
            <span :class="sistema.habilitado ? 'badge bg-success' : 'badge bg-secondary'" class="ms-3">{{ sistema.habilitado ? 'Habilitado' : 'Inactivo' }}</span>
          </div>
        </div>

    <!-- Offcanvas editar datos recopilados -->
    <div v-if="showOffcanvas" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
      <div class="offcanvas-panel bg-white shadow-lg">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Experiencia médica</h5>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <div v-for="dato in datosRecopiladosEdit" :key="dato.key" class="d-flex align-items-center mb-3">
            <span class="me-2 fs-5" v-html="dato.icon"></span>
            <span class="me-2">{{ dato.label }}</span>
            <div class="form-check form-switch ms-auto">
              <input class="form-check-input" type="checkbox" v-model="dato.habilitado">
            </div>
          </div>
          <div class="mt-4 d-flex justify-content-end">
            <button class="btn btn-primary me-2" @click="guardarCambios">Guardar</button>
            <button class="btn btn-outline-secondary" @click="cerrarOffcanvas">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Offcanvas editar sistema de medición -->
    <div v-if="showOffcanvasSistema" class="offcanvas-backdrop" @click.self="cerrarOffcanvasSistema">
      <div class="offcanvas-panel bg-white shadow-lg">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Sistema de medición</h5>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvasSistema"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <div v-for="sistema in sistemasMedicionEdit" :key="sistema.key" class="d-flex align-items-center mb-3">
            <span class="me-2 fs-5" v-html="sistema.icon"></span>
            <span class="me-2">{{ sistema.label }}</span>
            <div class="form-check form-switch ms-auto">
              <input class="form-check-input" type="checkbox" v-model="sistema.habilitado">
            </div>
          </div>
          <div class="mt-4 d-flex justify-content-end">
            <button class="btn btn-primary me-2" @click="guardarCambiosSistema">Guardar</button>
            <button class="btn btn-outline-secondary" @click="cerrarOffcanvasSistema">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    // Datos recopilados
    const datosRecopilados = ref([
  { key: 'peso', label: 'Peso', icon: '<i class="fa fa-weight-hanging text-info"></i>', habilitado: false },
      { key: 'estatura', label: 'Estatura', icon: '<i class="fa fa-ruler-vertical text-warning"></i>', habilitado: true },
      { key: 'imc', label: 'Índice de masa corporal', icon: '<i class="fa fa-user text-success"></i>', habilitado: true },
      { key: 'temperatura', label: 'Temperatura', icon: '<i class="fa fa-thermometer-half text-primary"></i>', habilitado: true },
      { key: 'frecuencia_respiratoria', label: 'Frecuencia respiratoria', icon: '<i class="fa fa-wave-square text-warning"></i>', habilitado: true },
      { key: 'frecuencia_cardiaca', label: 'Frecuencia cardiaca', icon: '<i class="fa fa-heart text-danger"></i>', habilitado: true },
    ]);
    // Sistemas de medición
    const sistemasMedicion = ref([
      { key: 'si', label: 'Sistema internacional (SI)', icon: '<i class="fa fa-flag text-danger"></i>', habilitado: true },
      { key: 'ingles', label: 'Sistema inglés', icon: '<i class="fa fa-flag text-warning"></i>', habilitado: false },
    ]);
    // Offcanvas states
    const showOffcanvas = ref(false);
    const showOffcanvasSistema = ref(false);
    // Copias para edición
    const datosRecopiladosEdit = ref([] as any[]);
    const sistemasMedicionEdit = ref([] as any[]);
    // Abrir/cerrar offcanvas
    const abrirOffcanvas = () => {
      datosRecopiladosEdit.value = datosRecopilados.value.map(d => ({ ...d }));
      showOffcanvas.value = true;
    };
    const cerrarOffcanvas = () => {
      showOffcanvas.value = false;
    };
    const guardarCambios = () => {
      datosRecopilados.value = datosRecopiladosEdit.value.map(d => ({ ...d }));
      showOffcanvas.value = false;
    };
    // Offcanvas sistema medición
    const abrirOffcanvasSistema = () => {
      sistemasMedicionEdit.value = sistemasMedicion.value.map(s => ({ ...s }));
      showOffcanvasSistema.value = true;
    };
    const cerrarOffcanvasSistema = () => {
      showOffcanvasSistema.value = false;
    };
    const guardarCambiosSistema = () => {
      sistemasMedicion.value = sistemasMedicionEdit.value.map(s => ({ ...s }));
      showOffcanvasSistema.value = false;
    };
    return {
      datosRecopilados,
      sistemasMedicion,
      showOffcanvas,
      showOffcanvasSistema,
      datosRecopiladosEdit,
      sistemasMedicionEdit,
      abrirOffcanvas,
      cerrarOffcanvas,
      guardarCambios,
      abrirOffcanvasSistema,
      cerrarOffcanvasSistema,
      guardarCambiosSistema
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
