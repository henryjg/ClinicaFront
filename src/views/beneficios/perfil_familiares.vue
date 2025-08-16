<template>
      <h6>FAMILIARES</h6>
      <div class="mb-1 justify-content-end">
        <button @click="openAddFamiliarModal" class="btn btn-success ">
          <i class="fa fa-plus"></i> Nuevo Familiar
        </button>
      </div>
      <Divloading v-if="isloading"/>
      <div v-else>
        <!-- //RESONSIVO -->
        <div class="row">
            <div class="col-lg-6 col-md-12  col-12"  v-for="(familiar, index) in listaFamiliar" :key="index">
              <!-- ------------- -->
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">                    
                    <div class="flex-grow-1 me-3">                      
                      <p class="mb-1 fw-medium text-yellow-700">Familiar {{ index+1 }}</p>
                      <h5 class="mb-1">{{ familiar.nombre }}<br> {{ familiar.apePaterno }} {{ familiar.apeMaterno }}</h5>
                      <p class="mb-0 "><span class="f-w-600">DNI: </span>{{ familiar.dni }}</p>
                      <p class="mb-0 "><span class="f-w-600">CELULAR:</span> {{ familiar.telefono }}</p>
                      <p class="mb-0 "><span class="f-w-600">CORREO:</span> {{ familiar.correo }}</p>
                    </div>
                    <div class="flex-shrink-0">
                      <div :class="familiar.genero==='Masculino' ? 'bg-light-info' : 'bg-light-danger'" class="avtar avtar-l rounded-circle">
                        <i class="ph-duotone ph-user f-28"></i>
                      </div>
                    </div>
                  </div>
                  <hr class="b-gray py-0 mb-0">
                  <div class="">
                   
                    <div class=" float-end">
                        <button @click="editFamiliar(familiar)" class="btn btn-sm btn-link-success rounded-3 m-0">
                          <i class="ph-duotone ph-pencil-line"></i>
                        </button>
                        <button @click="Eliminar_Familiar(familiar.id)" class="btn btn-sm btn-link-danger rounded-3 m-0">
                          <i class="ph-duotone ph-trash"></i>
                        </button>
                    </div>
                    <div v-if="familiar.fechaRegistro" class=" float-star">
                      <p class="mb-0 text-sm text-info ">Registrado el {{ FormatFecha.fecha_dddd_mmmm_yyyy(familiar.fechaRegistro) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ------------- -->
            </div>
          </div>
      </div>
            

      <!-- Modal para Añadir/Editar Familiar -->
      <div class="modal fade" id="familiarModal" tabindex="-1" aria-labelledby="familiarModalLabel" 
          aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header modal_head_bg py-2">
              <h5 class="modal-title" id="familiarModalLabel">{{ isEditing ? 'Editar Familiar' : 'Añadir Familiar' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addFamiliar">
                <div class="mb-1">
                  <label  class="form-label">DNI</label>
                  <input type="text" class="form-control" id="dni" v-model="nuevoFamiliar.dni" @change="onDniChange" required>
                </div>
                <div class="mb-1">
                  <label class="form-label">Nombres</label>
                  <input type="text" class="form-control" id="nombres" v-model="nuevoFamiliar.nombre" :disabled="isLoadingDni" required>
                </div>
                <div class="mb-1">
                  <label class="form-label">Apellido Paterno</label>
                  <input type="text" class="form-control" id="apellidoPaterno" v-model="nuevoFamiliar.apePaterno" :disabled="isLoadingDni" required>
                </div>
                <div class="mb-1">
                  <label  class="form-label">Apellido Materno</label>
                  <input type="text" class="form-control" id="apellidoMaterno" v-model="nuevoFamiliar.apeMaterno" :disabled="isLoadingDni" required>
                </div>
                <div class="mb-1">
                  <label class="form-label">Teléfono</label>
                  <input type="text" class="form-control" id="telefono" v-model="nuevoFamiliar.telefono" required>
                </div>
                <div class="mb-1">
                  <label  class="form-label">Correo</label>
                  <input type="email" class="form-control" id="correo" v-model="nuevoFamiliar.correo" required>
                </div>
                <label class="form-label">Genero</label>
                <select v-model="nuevoFamiliar.genero" class="form-select">
                  <option value="" disabled>Selecciona uno</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
                <div class="mb-1 ">
                  <button type="submit" class="btn btn-primary my-3 ">{{ isEditing ? 'Guardar Cambios' : 'Añadir Familiar' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { Modal } from "bootstrap";
import { Alerta, FormatFecha } from '../../utils/_utils';
import { useFamiliars, useTrabajador, Sunat } from "../../composables/_composables";
import { Divloading } from "../../components/_components";
import type { Familiar } from "../../interfaces/_interface";
import NProgress from 'nprogress'; 
import { useAuthStore } from "../../stores/authStore";
import { initializeFamiliar } from "../../interfaces/_interface";

export default defineComponent({
  name: "Perfil",
  components: {
    Divloading
  },
  setup() {
    const {
      listaFamiliar,
      nuevoFamiliar,
      // errors,
      Listar_Familiares,
      Crear_Familiar_Cliente_Logueado,
      Actualizar_Familiar,
      Eliminar_Familiar,
      Listar_Familiar_Cliente,
      Listar_Familiar_Trabajador
    } = useFamiliars();
    const { trabajador } = useTrabajador();
    const { Validar_DNI, PersonaData } = Sunat(); 
    const isLoadingDni = ref(false);
    
    const isEditing = ref(false);
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const perfil = ref({
      nombre: '',
      dni: '',
      apePaterno: '',
      apeMaterno: '',
      rol: '',
      email: '',
      fecharegistro: ''
    });
    
    const isloading = ref(true);

    

    const onDniChange = async () => {
      isLoadingDni.value=true;
      try {
        NProgress.start(); 
        if (nuevoFamiliar.value.dni.length == 8) {
          const Respuesta = await Validar_DNI(nuevoFamiliar.value.dni);
          if(Respuesta){
            // PersonaData.value=Respuesta.value;
            nuevoFamiliar.value.nombre = PersonaData.value.nombres;
            nuevoFamiliar.value.apePaterno = PersonaData.value.apellidoPaterno;
            nuevoFamiliar.value.apeMaterno = PersonaData.value.apellidoMaterno;
          }
          isLoadingDni.value=false
        }
      } catch (error) {
        Alerta.Error('Error', 'No se pudo obtener los datos del trabajador.');
      } finally {
        NProgress.done(); 
      }
    };

   
    //  ------------------------------------------------------

    const openAddFamiliarModal = () => {
      isEditing.value = false;
      nuevoFamiliar.value = initializeFamiliar();
      const modalElement = document.getElementById('familiarModal');
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    };

    const addFamiliar = async (event: Event) => {
      event.preventDefault();
      if (isEditing.value) {
        if (await Actualizar_Familiar(nuevoFamiliar.value.id)) {
          CargarFamiliar();
          closeModal();
        }
      } else {
        if (await Crear_Familiar_Cliente_Logueado()) { 
          CargarFamiliar();
          closeModal();
        }
      }
    };

    const editFamiliar = (familiar: Familiar) => {
      isEditing.value = true;
      Object.assign(nuevoFamiliar.value, familiar);
      const modalElement = document.getElementById('familiarModal');
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    };

    const closeModal = () => {
      const modalElement = document.getElementById("familiarModal");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };
    
    const CargarFamiliar = async () =>{
      if(Usuario.value.idrol==1){
        await Listar_Familiar_Cliente(Usuario.value.id);
      }else{
        await Listar_Familiar_Trabajador(Usuario.value.id);
      }
      isloading.value = false;
    }
 
   
    onMounted(async () => {
      await CargarFamiliar();
      
    });

    return {
      listaFamiliar,
      nuevoFamiliar,
      // errors,
      Listar_Familiares,
      Crear_Familiar_Cliente_Logueado,
      Actualizar_Familiar,
      Eliminar_Familiar,
      isEditing,
      openAddFamiliarModal,
      editFamiliar,
      FormatFecha,
      perfil,
      Usuario,
      trabajador,
      onDniChange,
      isLoadingDni,
      Listar_Familiar_Cliente,
      Listar_Familiar_Trabajador,
      addFamiliar,
      isloading
    };
  }
});
</script>


<style>
.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
}
.card {
  margin-bottom: 1rem;
}
.modal {
  z-index: 1150 !important; /* Bootstrap usa 1050 por defecto */
}

.modal-backdrop {
  z-index: 1140 !important; /* Asegura que el fondo oscuro también esté por debajo del modal */
}

</style>