<template>
      <h6>MI PERFIL</h6>
      <form >
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="usuarioNombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="usuarioNombre" v-model="perfil.nombre" :readonly="!isEditing">
          </div>
          <div class="col-md-6 mb-3">
            <label for="dni" class="form-label">DNI</label>
            <input type="text" class="form-control" id="dni" v-model="perfil.dni" readonly>
          </div>
        </div>
        <div class="row" v-if="Usuario.idrol === 2">

          <div class="col-md-6 mb-3">
            <label for="apellidoPaterno" class="form-label">Apellido Paterno</label>
            <input type="text" class="form-control" id="apellidoPaterno" v-model="perfil.apePaterno" :readonly="!isEditing">
          </div>
          <div class="col-md-6 mb-3">
            <label for="apellidoMaterno" class="form-label">Apellido Materno</label>
            <input type="text" class="form-control" id="apellidoMaterno" v-model="perfil.apeMaterno" :readonly="!isEditing">
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="rol" class="form-label">Rol</label>
            <input type="text" class="form-control" id="rol" v-model="perfil.rol" readonly>
          </div>
          <div class="col-md-6 mb-3">
            <label for="correo" class="form-label">Correo</label>
            <input type="text" class="form-control" id="correo" v-model="perfil.email" :readonly="!isEditing">
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
            <input type="text" class="form-control" id="fechaRegistro" v-model="perfil.fecharegistro" readonly>
          </div>
            <div class="col-md-6 mb-3">
            <label for="celular" class="form-label">Celular</label>
            <input type="text" class="form-control" id="celular" v-model="perfil.celular" :readonly="!isEditing">
          </div>
        </div>
      
         <div class="text-end">
        <button type="button" class="btn btn-primary" @click="toggleEdit">{{ isEditing ? 'Guardar' : 'Editar' }}</button>
      </div>
      </form>
            
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/authStore";
import { useUsuario, useTrabajador, useCliente } from "../../composables/_composables";

export default defineComponent({
  name: "Perfil",
  setup() {
    
    const { Obtener_Trabajador, trabajador, Actualizar_Trabajador } = useTrabajador();
    const { Obtener_Cliente, cliente, Actualizar_Cliente, nuevoCliente } = useCliente();

    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const idUsuarioLogueado = ref<number | null>(authStore.usuarioLogueado?.id || null);
    const perfil = ref({
      nombre: '',
      dni: '',
      apePaterno: '',
      apeMaterno: '',
      rol: '',
      email: '',
      fecharegistro: '',
      celular: ''
    });

       const isEditing = ref(false);

 const toggleEdit = async () => {
      if (isEditing.value) {
        // Guardar cambios
        const updatedData = {
          nombre: perfil.value.nombre,
          apePaterno: perfil.value.apePaterno,
          apeMaterno: perfil.value.apeMaterno,
          email: perfil.value.email,
          celular: perfil.value.celular 
        };

        try {
          if (Usuario.value.idrol === 2) {
            // Actualizar trabajador
            await Actualizar_Trabajador(Usuario.value.id, updatedData);
          } else if (Usuario.value.idrol === 1) {
            // Actualizar cliente
            Object.assign(nuevoCliente.value, updatedData); // Actualizar datos en nuevoCliente
            await Actualizar_Cliente(Usuario.value.id);
          }
        } catch (error) {
          console.error("Error al guardar los cambios:", error);
        }
      }
      isEditing.value = !isEditing.value;
    };


    const loadUserProfile = async () => {
      console.table(Usuario.value);
      try {
        if (Usuario.value.idrol === 2) {
          // Aquí deberías obtener los datos del trabajador, pero parece que tu API está devolviendo datos de cliente.
          // Si recibes la estructura que muestras, entonces debes acceder a response.data
          const trabajadorResponse = await Obtener_Trabajador(Usuario.value.id);
          const trabajadorData = trabajadorResponse?.data || trabajadorResponse;
          perfil.value = {
            nombre: trabajadorData?.nombre || '',
            dni: trabajadorData?.dni || '',
            apePaterno: trabajadorData?.apePaterno || '', 
            apeMaterno: trabajadorData?.apeMaterno || '', // No hay campo para apellido materno en la respuesta
            rol: 'Trabajador',
            email: trabajadorData?.email || '',
            fecharegistro: trabajadorData?.fechaRegistro || '',
            celular: trabajadorData?.celular || ''
          };
        } else if (Usuario.value.idrol === 1) {
          const clienteResponse = await Obtener_Cliente(Usuario.value.id);
          const clienteData = clienteResponse?.data || clienteResponse;
          perfil.value = {
            nombre: clienteData?.nombreCompleto || '',
            dni: clienteData?.nroDocumentoTitular || '',
            apePaterno: '', // No hay campo para apellido paterno en la respuesta
            apeMaterno: '', // No hay campo para apellido materno en la respuesta
            rol: 'Cliente',
            email: clienteData?.correo || '',
            fecharegistro: clienteData?.fechaRegistro || '',
            celular: clienteData?.celular || ''
          };
          
        } else {
          const { Obtener_Usuario, usuario } = useUsuario();
          const usuarioResponse = await Obtener_Usuario(idUsuarioLogueado.value ?? 0);
          perfil.value = {
            nombre: usuario.value?.usuarioNombre || '',
            dni: '',
            apePaterno: '',
            apeMaterno: '',
            rol: usuario.value?.rol || '',
            email: usuario.value?.correoVerificado || '',
            fecharegistro: usuario.value?.fechaRegistro || '',
            celular:  ''
          };
        }
        console.log("Perfil del cliente:", perfil.value);
          console.table(perfil.value);
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
      }
    };
   
    const currentSection = ref("Mi perfil");
    onMounted(async () => {
      await loadUserProfile();
    });
    return {
      perfil,
      loadUserProfile,
      Usuario,
      trabajador,
      isEditing,
      toggleEdit,
      cliente
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
  z-index: 1050 !important; /* Bootstrap usa 1050 por defecto */
}

.modal-backdrop {
  z-index: 1040 !important; /* Asegura que el fondo oscuro también esté por debajo del modal */
}

</style>