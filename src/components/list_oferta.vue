<template>
  <div>
    
    <!-- Botón Nuevo -->
    <div class="mb-1 justify-content-end">
      <button @click="openAddModal" class="btn btn-success">
        <i class="fa fa-plus"></i> Nuevo
      </button>
    </div>
    <!-- Tabla de Ofertas -->
    <Divloading v-if="isloading"/>
    <div v-else>
      <table class="table table-xs" v-if="listaCitas.length > 0">
        <thead>
          <tr>
            <th style="width: 5%;">N°</th>
            <th style="width: 8%;">Img</th> 
            <th style="width: 30%;">Nombre de Oferta</th>
            <th style="width: 10%;">% Cli.</th>
            <th style="width: 10%;">% Tra.</th>
            <th style="width: 10%;">NMC</th>
            <th style="width: 10%;">CA</th>
            <th style="width: 10%;">CU</th>
            <th style="width: 5%;">Fecha Inicio</th>
            <th style="width: 10%;">Estado</th>
            <th style="width: 5%;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(oferta, index) in listaCitas" :key="oferta.id" class="py-0">
            <td>{{ index + 1 }}</td>
            <td>
              <!-- <div v-if="oferta.imagenUrl!==''" class="image-container">
                <img :src="oferta.imagenUrl" width="100%" class="card-img">
              </div> -->
              <!-- <div v-else class="image-container" >
                <img src="../assets/images/fondoimg.jpeg" class="card-img">
              </div> -->
            </td>
            <td class="text-wrap">{{ oferta.nombre_paciente.length > 40 ? oferta.nombre_paciente.slice(0, 40) + '...' : oferta.nombre_paciente }}</td>
            <td class="text-wrap fw-bold text-success">{{ oferta.estado }}</td>
            <td class="text-wrap fw-bold text-purple ">{{ oferta.estado }}</td>
            <td class="text-wrap">{{ oferta.nro_cons }}</td>
            <td class="text-wrap">{{ oferta.nro_cons }}</td>
            <td class="text-wrap">{{ oferta.nro_cons }}</td>
            <td class="text-wrap text-md">{{ FormatFecha.fecha_mmmm_yyyy(oferta.hora_inicio) }}</td>            <td class="text-wrap">
              <!-- <div class="form-check form-switch custom-switch-v1 mb-1">
                <input type="checkbox"  
                       class="form-check-input input-success" 
                       :id="`customswitch-${oferta.id}`" 
                       :checked="oferta.estado === 'Activo'" 
                       :disabled="loadingStates[oferta.id]"
                       @change="cambiarEstado(oferta, ($event.target as HTMLInputElement).checked)" />
                  <div v-if="loadingStates[oferta.id]" class="d-flex align-items-center me-2 position-absolute">
                    <span class="spinner-border spinner-border-sm text-info me-2 " role="status" aria-hidden="true"></span>
                  </div>
              </div> -->
            </td>
            <td>
              <button @click="openEditModal(oferta)" class="btn btn-sm btn-success rounded-3 m-0">
                <i class="ph-duotone ph-pencil-line"></i>
              </button>
              <button @click="Eliminar_Cita(oferta.id, idnegocio)" class="btn btn-sm btn-danger rounded-3 m-0">
                <i class="ph-duotone ph-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Mensaje si no hay ofertas -->
      <div v-else class="alert alert-secondary text-center ">
        <i class="ph-duotone ph-warning"></i> No hay ofertas disponibles.
      </div>
    </div>    <!-- Modal de Añadir/Editar Oferta -->
    <ModalAddOferta :id="negocioId" :oferta="selectedCita.id ? selectedCita : undefined" @updated="Listar_Citas_porIdNegocio(negocioId)" />
  </div>
  <p class="text-sm mb-0">
    *C.A: Cupones Activos
      </p>
    <p class="text-sm mb-0">
    *C.U: Cupones Usados
    </p>
    <p class="text-sm mb-0">
    *N.M.C: Numero Maximo de Cupones
    </p>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { Modal } from 'bootstrap';
import { Citas } from '../interfaces/citas.interface';
import ModalAddOferta from '../views/Modals/modal_add_oferta.vue';
// import { useOfertas } from '../composables/useCitas'; 
import Divloading from './div_loading.vue';
import {FormatFecha } from '../utils/FormatFecha'
import Notif from '../utils/notificaciones';
import Alerta from '../utils/alertas';
import { useCitas } from '../composables/useCitas';


export default defineComponent({
  name: 'ListOferta',
  components: {
      ModalAddOferta,
      Divloading
  },
  props: {
      negocioId: {
        type: Number,
        required: true,
      },
  },
  emits: ['update-fotos'],
    setup(props) {
    const { listaCitas, Listar_Citas_porIdNegocio, Eliminar_Cita, selectedCita, Actualizar_Estado_Cita } = useCitas();
    const idnegocio = computed(() => props.negocioId);
    const isloading = ref(true);
    
    // Estado de carga individual para cada oferta
    const loadingStates = ref<{ [key: number]: boolean }>({});

    // Manejo de modales
    const openAddModal = () => {
      selectedCita.value = {} as Citas; // Limpiar selección para modo crear
      const modalElement = document.getElementById('add_OfertaModal');
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    };

    const openEditModal = (oferta: Citas) => {
      selectedCita.value = { ...oferta }; // Clonar la oferta seleccionada
      const modalElement = document.getElementById('add_OfertaModal');
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    };

    const cargarCitaNegocio_id = async () => {
      isloading.value = true;
      await Listar_Citas_porIdNegocio(idnegocio.value);
      isloading.value = false; 
    };

    // Cargar ofertas cuando negocioId tenga un valor válido
    watch(idnegocio, (newVal) => {
      if (newVal && newVal > 0) {
        cargarCitaNegocio_id();
      }
    }, { immediate: true });    
    
    // const cambiarEstado = async (oferta: Citas, nuevoEstado: boolean) => {
    //   const estadoOriginal = oferta.estado;
    //   const nuevoEstadoStr = nuevoEstado ? 'Activo' : 'Inactivo';
      
    //   // Evitar múltiples clicks mientras se procesa
    //   if (loadingStates.value[oferta.id]) {
    //     return;
    //   }
      
    //   // Mostrar indicador de carga para esta oferta específica
    //   loadingStates.value[oferta.id] = true;
      
    //   try {
    //     // Encontrar el índice de la oferta en la lista
    //     const ofertaIndex = listaOfertas.value.findIndex(o => o.id === oferta.id);
    //     if (ofertaIndex === -1) {
    //       throw new Error('Oferta no encontrada en la lista');
    //     }
    //       // Actualizar SOLO el estado en la UI inmediatamente (actualización optimista)
    //     listaOfertas.value[ofertaIndex] = {
    //       ...listaOfertas.value[ofertaIndex],
    //       estado: nuevoEstadoStr
    //     };
        
    //     // Intentar actualizar el estado en el servidor
    //     await Actualizar_Estado_Oferta(oferta.id, nuevoEstadoStr);
    //   } catch (error) {
    //     // En caso de error, revertir SOLO el estado del item específico
    //     const ofertaIndex = listaOfertas.value.findIndex(o => o.id === oferta.id);
    //     if (ofertaIndex !== -1) {
    //       listaOfertas.value[ofertaIndex] = {
    //         ...listaOfertas.value[ofertaIndex],
    //         estado: estadoOriginal
    //       };
    //     }
    //     Alerta.Error('Error', 'No se pudo actualizar el estado.');
    //     console.error('Error al cambiar estado:', error);
    //   } finally {
    //     // Quitar indicador de carga
    //     loadingStates.value[oferta.id] = false;
    //   }
    // };
    return {
      listaCitas,
      selectedCita,
      cargarCitaNegocio_id,
      Eliminar_Cita,
      idnegocio,
      openAddModal,
      openEditModal,
      isloading,
      FormatFecha,
      // cambiarEstado,
      Listar_Citas_porIdNegocio,
      loadingStates
    };
  },
});
</script>

<style scoped>
.badge {
  font-size: 12px;
}

.form-check-input:checked {
  background-color: #28a745; /* Color verde para el estado activo */
  border-color: #28a745;
}

.form-check-input {
  width: 2.5em;
  height: 1.5em;
  margin-left: -1.5em;
  cursor: pointer;
}

.form-check-input:focus {
  box-shadow: none;
}

.form-check-label {
  margin-left: 0.5em;
  cursor: pointer;
}

/* Transiciones suaves para estados */
.transition-all {
  transition: color 0.3s ease, transform 0.2s ease;
}

/* Animación para el spinner */
.spinner-border-sm {
  animation: spin 1s linear infinite;
}

/* Estados del texto */
.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

/* Efecto hover para toda la fila */
tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
  transition: background-color 0.2s ease;
}

/* Loading state para la fila */
tbody tr.loading {
  background-color: rgba(255, 193, 7, 0.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
