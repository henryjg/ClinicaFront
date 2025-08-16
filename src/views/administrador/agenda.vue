<template>
  <div class="container-fluid py-3">
    <!-- Filtro por médico y botón nueva cita -->
    <div class="d-flex align-items-center mb-3">
      <label class="fw-bold text-secondary me-2">Filtrar por:</label>
      <select class="form-select form-select-sm w-auto me-3" v-model="medicoSeleccionado">
        <option v-for="med in medicos" :key="med" :value="med">{{ med }}</option>
      </select>
      <div class="ms-auto d-flex align-items-center">
        <button class="btn btn-light me-2"><i class="fa fa-calendar-week"></i></button>
        <button class="btn btn-light me-2"><i class="fa fa-list"></i></button>
        <button class="btn btn-primary px-4" @click="abrirNuevaCita"><i class="fa fa-plus me-2"></i>Nueva cita</button>
      </div>
    </div>
  <!-- Tabla agenda -->
    <div class="table-responsive">
      <table class="table table-bordered align-middle" style="min-width: 900px;">
        <thead>
          <tr class="bg-white">
            <th class="text-secondary fw-bold" style="width: 100px;">Adicionales</th>
            <th v-for="(dia, i) in dias" :key="i" class="text-primary fw-bold text-center" :class="{ 'border-bottom border-primary': i === 1 }">
              <span :class="{ 'fw-bold text-primary border-bottom border-2 border-primary pb-1': i === 1 }">{{ dia.fecha }}</span>
            </th>
          </tr>
          <tr class="bg-light">
            <th></th>
            <th v-for="(dia, i) in dias" :key="'adicionales-' + i" class="text-center">{{ dia.adicionales }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hora, hi) in horas" :key="hi">
            <td class="text-end text-secondary fw-bold">{{ hora }}</td>
            <td v-for="(dia, di) in dias" :key="'cell-' + hi + '-' + di" class="bg-white" style="height: 60px;">
              <div v-for="evento in eventosPorDiaHora(dia.fecha, hora)" :key="evento.id"
                class="bg-light border rounded px-2 py-1 mb-1 shadow-sm handpointer"
                style="font-size: 0.95em;"
                @click="abrirOffcanvas(evento)">
                <div class="fw-bold text-primary">{{ evento.titulo }}</div>
                <div class="text-secondary" style="font-size: 0.95em;">{{ evento.paciente }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Offcanvas detalle cita -->
    <div v-if="citaSeleccionada" class="offcanvas-backdrop" @click.self="cerrarOffcanvas">
      <div class="offcanvas-panel bg-white shadow-lg">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0"><i class="fa fa-calendar-check me-2"></i> Detalle cita</h5>
          <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <div class="mb-3">
            <span class="fw-bold text-secondary">Estado</span>
            <span class="badge bg-success ms-2"><i class="fa fa-check-circle me-1"></i> Confirmada</span>
          </div>
          <div class="mb-3">
            <span class="fw-bold text-secondary">Fecha y hora</span>
            <span class="ms-2">12/03/2024 06:00 pm</span>
          </div>
          <div class="mb-3">
            <span class="fw-bold text-secondary">Paciente</span>
            <span class="ms-2 text-primary">Aldana Valverde, Marco Antonio</span>
          </div>
          <div class="mb-3">
            <span class="fw-bold text-secondary">Tipo de servicio</span>
            <span class="ms-2">Consulta general</span>
          </div>
          <div class="mb-3">
            <span class="fw-bold text-secondary">Centro</span>
            <span class="ms-2">Consultorio Médico Dr. Leandro Guerrero</span>
          </div>
          <hr>
          <div class="mb-2 fw-bold text-primary">Pago</div>
          <div class="mb-2">
            <span class="fw-bold text-secondary">Valor</span>
            <span class="ms-2">S/ 150.00</span>
          </div>
          <div class="mb-2">
            <span class="fw-bold text-secondary">Estado</span>
            <span class="ms-2">Pagado</span>
          </div>
          <div class="mt-4 d-flex justify-content-end">
            <button class="btn btn-primary me-2"><i class="fa fa-play me-1"></i> Iniciar consulta</button>
            <button class="btn btn-outline-secondary" @click="cerrarOffcanvas"><i class="fa fa-times"></i> Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Offcanvas nueva cita -->
    <div v-if="showNuevaCita" class="offcanvas-backdrop" @click.self="cerrarNuevaCita">
      <div class="offcanvas-panel bg-white shadow-lg" style="max-width: 500px;">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Nueva cita</h5>
          <button class="btn btn-outline-secondary" @click="cerrarNuevaCita"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <form @submit.prevent="guardarCita">
            <div class="mb-3 d-flex align-items-center justify-content-between">
              <span class="fw-bold text-secondary">Adicional</span>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="citaForm.adicional" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Tipo de servicio *</label>
              <select class="form-select" v-model="citaForm.servicio" required>
                <option value="Consulta general">Consulta general</option>
                <option value="Lectura de resultados">Lectura de resultados</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Centro *</label>
              <select class="form-select" v-model="citaForm.centro" required>
                <option value="Consultorio Médico Dr. Leandro Guerrero">Consultorio Médico Dr. Leandro Guerrero</option>
                <option value="Consultorio Médico Dr. Macalupu">Consultorio Médico Dr. Macalupu</option>
              </select>
            </div>
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label fw-bold text-primary">Fecha *</label>
                <input type="date" class="form-control" v-model="citaForm.fecha" required />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold text-primary">Hora inicio *</label>
                <input type="time" class="form-control" v-model="citaForm.horaInicio" required />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold text-primary">Hora fin *</label>
                <input type="time" class="form-control" v-model="citaForm.horaFin" required />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Paciente *</label>
              <div class="input-group">
                <input class="form-control" v-model="citaForm.paciente" placeholder="Nro documento o nombre" required />
                <button class="btn btn-outline-secondary" type="button" @click="abrirRegistrarPersona"><i class="fa fa-search"></i></button>
              </div>
              <a href="#" class="d-block mt-1 text-primary fw-bold" style="font-size:0.95em;" @click.prevent="abrirRegistrarPersona">Registrar persona</a>
            </div>
            <div v-if="showNoRegistros" class="text-secondary mb-3">No se encontraron registros</div>
            <div class="mt-4 d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-primary px-4">Guardar</button>
              <button type="button" class="btn btn-outline-secondary px-4" @click="cerrarNuevaCita">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Offcanvas registrar persona -->
    <div v-if="showRegistrarPersona" class="offcanvas-backdrop" @click.self="cerrarRegistrarPersona">
      <div class="offcanvas-panel bg-white shadow-lg" style="max-width: 500px;">
        <div class="offcanvas-header border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold text-primary mb-0">Nuevo paciente</h5>
          <button class="btn btn-outline-secondary" @click="cerrarRegistrarPersona"><i class="fa fa-times"></i></button>
        </div>
        <div class="offcanvas-body px-4 py-3">
          <form @submit.prevent="guardarPersona">
            <div class="mb-3 d-flex align-items-center justify-content-between">
              <span class="fw-bold text-secondary">Es menor de edad</span>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="personaForm.menorEdad" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Tipo de documento *</label>
              <select class="form-select" v-model="personaForm.tipoDoc" required>
                <option value="DNI">Documento Nacional de Identidad - DNI</option>
                <option value="CE">Carnet de Extranjería</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Número de documento *</label>
              <input class="form-control" v-model="personaForm.nroDoc" required />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Nombres *</label>
              <input class="form-control" v-model="personaForm.nombres" required />
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-primary">Apellidos Paternos *</label>
                <input class="form-control" v-model="personaForm.apellidoPat" required />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-primary">Apellidos Maternos *</label>
                <input class="form-control" v-model="personaForm.apellidoMat" required />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold text-primary">Celular *</label>
                <input class="form-control" v-model="personaForm.celular" required />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold text-primary">Género *</label>
                <select class="form-select" v-model="personaForm.genero" required>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-primary">Correo *</label>
              <input class="form-control" v-model="personaForm.correo" required />
            </div>
            <div class="mt-4 d-flex justify-content-end gap-2">
              <button type="submit" class="btn btn-primary px-4">Guardar</button>
              <button type="button" class="btn btn-outline-secondary px-4" @click="cerrarRegistrarPersona">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmación guardar persona -->
    <div v-if="showConfirmPersona" class="offcanvas-backdrop" @click.self="cerrarConfirmPersona">
      <div class="offcanvas-panel bg-white shadow-lg d-flex flex-column justify-content-center align-items-center" style="max-width: 400px; min-height: 300px;">
        <div class="text-center">
          <i class="fa fa-check-circle text-success" style="font-size: 3em;"></i>
          <div class="fw-bold text-primary mt-3 mb-2">Paciente registrado correctamente</div>
          <button class="btn btn-primary px-4" @click="cerrarConfirmPersona">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    // Filtro por médico
    const medicos = ref(['José Macalupu', 'Leandro Guerrero']);
    const medicoSeleccionado = ref(medicos.value[0]);

    // Días de la semana
    const dias = ref([
      { fecha: 'Lunes 26/08', adicionales: 4 },
      { fecha: 'Martes 27/08', adicionales: 2 },
      { fecha: 'Miércoles 28/08', adicionales: 0 },
      { fecha: 'Jueves 29/08', adicionales: 0 },
      { fecha: 'Viernes 30/08', adicionales: 0 },
      { fecha: 'Sábado 31/08', adicionales: 0 },
      { fecha: 'Domingo 01/09', adicionales: 0 },
    ]);
    // Horas
    const horas = ref([
      '08:00 am', '09:00 am', '10:00 am', '11:00 am', '12:00 pm'
    ]);
    // Eventos ficticios
    const eventos = ref([
      { id: 1, fecha: 'Lunes 26/08', hora: '09:00 am', titulo: 'Consulta general', paciente: 'Aldana, Marco' },
      { id: 2, fecha: 'Martes 27/08', hora: '08:00 am', titulo: 'Lectura de resultados', paciente: 'Saavedra, Liliana' },
      { id: 3, fecha: 'Martes 27/08', hora: '10:00 am', titulo: 'Lectura de resultados', paciente: 'Trujillo, Pamela' },
      { id: 4, fecha: 'Jueves 29/08', hora: '09:00 am', titulo: 'Consulta general', paciente: 'Liliana Saavedra' },
      { id: 5, fecha: 'Viernes 30/08', hora: '10:00 am', titulo: 'Consulta general', paciente: 'Liliana Saavedra' },
    ]);
    // Filtra eventos por día y hora
    const eventosPorDiaHora = (fecha: string, hora: string) => {
      return eventos.value.filter(e => e.fecha === fecha && e.hora === hora);
    };
    // Offcanvas cita seleccionada
    const citaSeleccionada = ref<any | null>(null);
    const abrirOffcanvas = (evento: any) => {
      citaSeleccionada.value = {
        ...evento,
        estado: 'Confirmada',
        fechaHora: '12/03/2024 06:00 pm',
        paciente: 'Aldana Valverde, Marco Antonio',
        servicio: 'Consulta general',
        centro: 'Consultorio Médico Dr. Leandro Guerrero',
        pagoValor: 'S/ 150.00',
        pagoEstado: 'Pagado'
      };
    };
    const cerrarOffcanvas = () => {
      citaSeleccionada.value = null;
    };

    // Nueva cita
    const showNuevaCita = ref(false);
    const citaForm = ref({
      adicional: false,
      servicio: 'Consulta general',
      centro: 'Consultorio Médico Dr. Leandro Guerrero',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      paciente: ''
    });
    const showNoRegistros = ref(false);
    const abrirNuevaCita = () => {
      showNuevaCita.value = true;
      showNoRegistros.value = false;
    };
    const cerrarNuevaCita = () => {
      showNuevaCita.value = false;
    };
    const guardarCita = () => {
      cerrarNuevaCita();
    };

    // Registrar persona
    const showRegistrarPersona = ref(false);
    const personaForm = ref({
      menorEdad: false,
      tipoDoc: 'DNI',
      nroDoc: '',
      nombres: '',
      apellidoPat: '',
      apellidoMat: '',
      celular: '',
      genero: 'Femenino',
      correo: ''
    });
    const abrirRegistrarPersona = () => {
      showRegistrarPersona.value = true;
    };
    const cerrarRegistrarPersona = () => {
      showRegistrarPersona.value = false;
    };
    // Confirmación guardar persona
    const showConfirmPersona = ref(false);
    const guardarPersona = () => {
      // Construye el string del paciente como en el chip: "nroDoc - apellidoPat apellidoMat, nombres"
      const p = personaForm.value;
      citaForm.value.paciente = `${p.nroDoc} - ${p.apellidoPat} ${p.apellidoMat}, ${p.nombres}`;
      showRegistrarPersona.value = false;
      showConfirmPersona.value = true;
    };
    const cerrarConfirmPersona = () => {
      showConfirmPersona.value = false;
    };

    return {
      medicos,
      medicoSeleccionado,
      dias,
      horas,
      eventosPorDiaHora,
      citaSeleccionada,
      abrirOffcanvas,
      cerrarOffcanvas,
      showNuevaCita,
      citaForm,
      abrirNuevaCita,
      cerrarNuevaCita,
      guardarCita,
      showNoRegistros,
      showRegistrarPersona,
      personaForm,
      abrirRegistrarPersona,
      cerrarRegistrarPersona,
      guardarPersona,
      showConfirmPersona,
      cerrarConfirmPersona
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
.handpointer {
  cursor: pointer;
}
</style>
