<template>
  <div class="container py-4">
    <!-- Card principal con foto y datos básicos -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body d-flex align-items-center gap-4">
        <img :src="foto" alt="Foto médico" class="rounded-circle border" style="width: 120px; height: 120px; object-fit: cover;">
        <div>
          <h3 class="mb-1">
            <span class="fw-bold">{{ apellido }}</span>,
            <span class="text-primary">{{ nombre }}</span>
          </h3>
          <div class="mb-1 f-18">{{ dni }} <span class="badge bg-success ms-2">{{ especialidad }}</span></div>
          <div class="text-muted f-16">{{ edad }} años</div>
        </div>
      </div>
    </div>

    <!-- Datos de contacto -->
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold f-20 text-primary">Datos de contacto</span>
        <button class="btn btn-link text-primary p-0 f-16" @click="abrirOffcanvasContacto">Editar</button>
      </div>
      <div class="row mb-2">
        <div class="col fw-bold">Correo</div>
        <div class="col fw-bold">Celular</div>
        <div class="col fw-bold">Celular adicional</div>
      </div>
      <div class="row mb-3">
        <div class="col">{{ contacto.correo }}</div>
        <div class="col">{{ contacto.celular }}</div>
        <div class="col">{{ contacto.celularAdicional || '-' }}</div>
      </div>
      <hr>
    </div>

    <!-- Datos demográficos -->
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold f-20 text-primary">Datos demográficos</span>
        <button class="btn btn-link text-primary p-0 f-16" @click="abrirOffcanvasDemografico">Editar</button>
      </div>
      <div class="row mb-2">
        <div class="col fw-bold">Departamento</div>
        <div class="col fw-bold">Ciudad</div>
        <div class="col fw-bold">Dirección</div>
      </div>
      <div class="row mb-3">
        <div class="col">{{ demografico.departamento }}</div>
        <div class="col">{{ demografico.ciudad }}</div>
        <div class="col">{{ demografico.direccion }}</div>
      </div>
      <hr>
    </div>

    <!-- Experiencia médica -->
    <div class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-bold f-20 text-primary">Experiencia médica</span>
        <button class="btn btn-link text-primary p-0 f-16" @click="abrirOffcanvasExperiencia">Editar</button>
      </div>
      <div class="row mb-2">
        <div class="col fw-bold">Centro</div>
        <div class="col fw-bold">Año / Periodo</div>
        <div class="col fw-bold">Área / Cargo</div>
      </div>
      <div v-for="(exp, idx) in experiencia" :key="idx" class="row mb-1 align-items-center">
        <div class="col">{{ exp.centro }}</div>
        <div class="col">{{ exp.anio }}</div>
        <div class="col">{{ exp.area }}</div>
      </div>
    </div>

    <!-- Offcanvas contacto -->
    <div v-if="showOffcanvasContacto" class="offcanvas-backdrop" @click.self="cerrarOffcanvasContacto">
      <div class="offcanvas-panel bg-white shadow-lg">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Datos de contacto</h5>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvasContacto"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <form @submit.prevent="guardarContacto">
            <div class="mb-3">
              <label class="form-label">Correo <span class="text-danger">*</span></label>
              <input type="email" class="form-control" v-model="formContacto.correo" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Celular <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formContacto.celular" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Celular adicional</label>
              <input type="text" class="form-control" v-model="formContacto.celularAdicional" />
            </div>
            <div class="mt-4 d-flex gap-2">
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-outline-primary" @click="cerrarOffcanvasContacto">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Offcanvas demográfico -->
    <div v-if="showOffcanvasDemografico" class="offcanvas-backdrop" @click.self="cerrarOffcanvasDemografico">
      <div class="offcanvas-panel bg-white shadow-lg">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Datos demográficos</h5>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvasDemografico"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <form @submit.prevent="guardarDemografico">
            <div class="mb-3">
              <label class="form-label">Departamento <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formDemografico.departamento" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Ciudad <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formDemografico.ciudad" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Dirección <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formDemografico.direccion" required />
            </div>
            <div class="mt-4 d-flex gap-2">
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-outline-primary" @click="cerrarOffcanvasDemografico">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Offcanvas experiencia médica -->
    <div v-if="showOffcanvasExperiencia" class="offcanvas-backdrop" @click.self="cerrarOffcanvasExperiencia">
      <div class="offcanvas-panel bg-white shadow-lg" style="max-width: 700px;">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Experiencia médica</h5>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvasExperiencia"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <div class="row mb-2">
            <div class="col fw-bold">Centro</div>
            <div class="col fw-bold">Año / Periodo</div>
            <div class="col fw-bold">Área / Cargo</div>
            <div class="col"></div>
          </div>
          <div v-for="(exp, idx) in experienciaTemp" :key="idx" class="row mb-1 align-items-center">
            <div class="col">{{ exp.centro }}</div>
            <div class="col">{{ exp.anio }}</div>
            <div class="col">{{ exp.area }}</div>
            <div class="col-auto">
              <button class="btn btn-sm btn-link text-danger" @click="eliminarExperiencia(idx)"><i class="fa fa-trash"></i></button>
            </div>
          </div>
          <form @submit.prevent="agregarExperiencia" class="mt-3">
            <div class="row mb-2">
              <div class="col">
                <label class="form-label">Centro <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formExperiencia.centro" required />
              </div>
              <div class="col">
                <label class="form-label">Año / Periodo <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formExperiencia.anio" required />
              </div>
              <div class="col">
                <label class="form-label">Cargo <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="formExperiencia.area" required />
              </div>
            </div>
            <div class="d-flex gap-2 mb-3">
              <button type="submit" class="btn btn-link text-primary">Agregar</button>
            </div>
          </form>
          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary" @click="guardarExperienciaFinal">Guardar</button>
            <button type="button" class="btn btn-outline-primary" @click="cerrarOffcanvasExperiencia">Cancelar</button>
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
    // Datos básicos
    const foto = ref('https://randomuser.me/api/portraits/men/32.jpg');
    const nombre = ref('Leandro Martin');
    const apellido = ref('Guerrero Guerra');
    const dni = ref('73995752');
    const edad = ref(27);
    const especialidad = ref('Medicina general');

    // Contacto
    const contacto = ref({ correo: 'leandro.guerrero@gmail.com', celular: '943521489', celularAdicional: '' });
    const formContacto = ref({ ...contacto.value });
    const showOffcanvasContacto = ref(false);
    const abrirOffcanvasContacto = () => {
      formContacto.value = { ...contacto.value };
      showOffcanvasContacto.value = true;
    };
    const cerrarOffcanvasContacto = () => {
      showOffcanvasContacto.value = false;
    };
    const guardarContacto = () => {
      contacto.value = { ...formContacto.value };
      cerrarOffcanvasContacto();
    };

    // Demográfico
    const demografico = ref({ departamento: 'Piura', ciudad: 'Piura', direccion: 'Calle Las Esmeraldas N° 504 Piso 4' });
    const formDemografico = ref({ ...demografico.value });
    const showOffcanvasDemografico = ref(false);
    const abrirOffcanvasDemografico = () => {
      formDemografico.value = { ...demografico.value };
      showOffcanvasDemografico.value = true;
    };
    const cerrarOffcanvasDemografico = () => {
      showOffcanvasDemografico.value = false;
    };
    const guardarDemografico = () => {
      demografico.value = { ...formDemografico.value };
      cerrarOffcanvasDemografico();
    };

    // Experiencia médica
    const experiencia = ref([
      { centro: 'Hospital nacional', anio: '2020–2021', area: 'Consulta general' },
      { centro: 'Carita Feliz', anio: '2019', area: 'Pediatra' },
      { centro: 'SANNA', anio: '1998–2008', area: 'Cardiólogo' }
    ]);
    const experienciaTemp = ref([...experiencia.value]);
    const formExperiencia = ref({ centro: '', anio: '', area: '' });
    const showOffcanvasExperiencia = ref(false);
    const abrirOffcanvasExperiencia = () => {
      experienciaTemp.value = [...experiencia.value];
      formExperiencia.value = { centro: '', anio: '', area: '' };
      showOffcanvasExperiencia.value = true;
    };
    const cerrarOffcanvasExperiencia = () => {
      showOffcanvasExperiencia.value = false;
    };
    const agregarExperiencia = () => {
      if (!formExperiencia.value.centro || !formExperiencia.value.anio || !formExperiencia.value.area) return;
      experienciaTemp.value.push({ ...formExperiencia.value });
      formExperiencia.value = { centro: '', anio: '', area: '' };
    };
    const eliminarExperiencia = (idx: number) => {
      experienciaTemp.value.splice(idx, 1);
    };
    const guardarExperienciaFinal = () => {
      experiencia.value = [...experienciaTemp.value];
      cerrarOffcanvasExperiencia();
    };

    return {
      foto,
      nombre,
      apellido,
      dni,
      edad,
      especialidad,
      contacto,
      formContacto,
      showOffcanvasContacto,
      abrirOffcanvasContacto,
      cerrarOffcanvasContacto,
      guardarContacto,
      demografico,
      formDemografico,
      showOffcanvasDemografico,
      abrirOffcanvasDemografico,
      cerrarOffcanvasDemografico,
      guardarDemografico,
      experiencia,
      experienciaTemp,
      formExperiencia,
      showOffcanvasExperiencia,
      abrirOffcanvasExperiencia,
      cerrarOffcanvasExperiencia,
      agregarExperiencia,
      eliminarExperiencia,
      guardarExperienciaFinal
    };
  }
});
</script>

<style scoped>
.f-16 { font-size: 1.05rem; }
.f-18 { font-size: 1.15rem; }
.f-20 { font-size: 1.25rem; }
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
  width: 540px;
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
