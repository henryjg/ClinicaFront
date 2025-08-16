<template>
  <CardLayout :title="'Usuarios'" :clase="'text-info'" :clasehead="' border-0'" class="pt-1">
    <!-- Botones de la parte superior derecha -->
    <template #buttons>
      <div class="d-flex columns justify-content-end">
        <button type="button" class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#addUsuarioModal">
          <i class="fas fa-user-plus"></i> Agregar
        </button>
        <button @click="Listar_Usuarios" class="btn btn-blue b-dark btn-sm mx-1">
          <i class="ti ti-refresh"></i>
        </button>
        <button @click="resetear" class="btn btn-secondary btn-sm mx-1">
          <i class="fa fa-broom"></i>
        </button>
      </div>
    </template>

    <!-- Contenido principal de la tarjeta -->
    <template #default>
      <Divloading v-if="isLoading_Usuarios"/>
      <div v-else>
        <DataTable
          :headers="headers"
          :items="paginatedUsuarios"
          :filterKeys="['usuarioNombre', 'rol', 'fechaRegistro','lastconexion','nroingresos']"
          :clasehead="'bg-info-100'"
          :currentPage.sync="currentPage"
          :itemsPerPage.sync="itemsPerPage"
          :totalItems="filteredUsuarios.length"
          @update:currentPage="onPageChange"
        >
          <template #default="{ item, index,currentPage, itemsPerPage }">
            <tr :id="'tr_usuario_'+ (index+1)">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.usuarioNombre }}</td>
              <td>{{ item.rol }}</td>
              <td>{{ FormatFecha.fecha_dd_mm_yyyy(item.fechaRegistro) }}</td>
              <td>{{ item.nroingresos }}</td>
              <td>{{ FormatFecha.fecha_dd_mm_yyyy(item.lastconexion) }}</td>
              <td>
                <a href="#" @click.prevent="eliminarFilaUsuario(item.id,true)" class="btn btn-light-danger btn-sm">
                  <i class="ti ti-trash f-20"></i>
                </a>
                <a href="#" @click.prevent="abrirModalCambiarContrasena(item.id)" class="btn btn-light-warning btn-sm">
                  <i class="ti ti-key f-20"></i>
                </a>
              </td>
            </tr>
          </template>
        </DataTable>
      </div>
    </template>
  </CardLayout>

  <!-- Modal para agregar usuario -->
  <div class="modal fade" id="addUsuarioModal" tabindex="-1" aria-labelledby="addUsuarioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title" id="addUsuarioModalLabel">Agregar Usuario</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarUsuarioYcerrarModal">
            <div class="mb-3">
              <label for="usuarioNombre" class="form-label">Nombre de Usuario</label>
              <input type="text" class="form-control" id="usuarioNombre" v-model="NuevoUsuario.usuarioNombre" required>
              <ErrorMessage :error="errors.usuarioNombre" />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" v-model="NuevoUsuario.pass" required>
              <ErrorMessage :error="errors.pass" />
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para cambiar contraseña -->
  <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header modal_head_bg py-2">
          <h5 class="modal-title" id="changePasswordModalLabel">Cambiar Contraseña</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarNuevaContrasena">
            <div class="mb-3">
              <label for="newPassword" class="form-label">Nueva Contraseña</label>
              <input type="password" class="form-control" id="newPassword" v-model="newPassword" required>
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
              <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { CardLayout, DataTable, Divloading, ErrorMessage } from '../../components/_components';
import { useUsuario, usarAutenticacion } from '../../composables/_composables';
import { FormatFecha, Alerta } from '../../utils/_utils';
// import { cambiarPass } from '../../composables/AuthValidate';

export default {
  components: {
    CardLayout,
    DataTable,
    Divloading,
    ErrorMessage
  },
  setup() {    
    const { listaUsuarios, Listar_Usuarios, Eliminar_Usuario, Crear_Usuario, NuevoUsuario, errors, isLoading_Usuarios,eliminarFilaUsuario } = useUsuario();
    const searchQuery = ref('');
    const itemsPerPage = ref(10);
    const currentPage = ref(1);
    const newPassword = ref('');
    const confirmPassword = ref('');
    const selectedUserId = ref<string | null>(null);
    const { cambiarPass } = usarAutenticacion();
    onMounted(async () => {
      await Listar_Usuarios();
    });

    const filteredUsuarios = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return listaUsuarios.value.filter((usuario) => {
        return Object.values(usuario).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          return false;
        });
      }) ?? [];
    });

    const paginatedUsuarios = computed(() => {
      return filteredUsuarios.value; // Devuelve todos los usuarios sin limitar a 10
    });

    const headers = ref([
      { text: '#', width: '5%', key: 'index' },
      { text: 'Usuario', width: '35%', key: 'usuarioNombre' },
      { text: 'Rol', width: '20%', key: 'rol' },
      { text: 'Fecha de Registro', width: '20%', key: 'fechaRegistro' },
      { text: 'Ingresos', width: '10%', key: 'nroingresos' },
      { text: 'Ultima Conexion', width: '10%', key: 'lastconexion' },
      { text: 'Acciones', width: '5%', key: 'acciones' },
    ]);    const resetear = () => {
      Listar_Usuarios();
    };

    const closeModal = () => {
      const modalElement = document.getElementById("addUsuarioModal");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };    const guardarUsuarioYcerrarModal = async () => {
      await Crear_Usuario();
      closeModal();
    };

    const onPageChange = (newPage: number) => {
      currentPage.value = newPage;
    };

    const abrirModalCambiarContrasena = (userId: string) => {
      selectedUserId.value = userId;
      const modalElement = document.getElementById("changePasswordModal");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.show();
      }
    };

    const guardarNuevaContrasena = async () => {
      if (!selectedUserId.value) {
        Alerta.Advertencia('Campos incompletos','No se ha seleccionado un usuario válido.');
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        Alerta.Advertencia('Cuidado','Las contraseñas no coinciden');
        return;
      }
      try {
        await cambiarPass(selectedUserId.value, newPassword.value);
        Alerta.Sucessfull('Exito', 'La contraseña ha sido cambiada exitosamente.');
        const modalElement = document.getElementById("changePasswordModal");
        if (modalElement) {
          const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
          if (modal) modal.hide();
        }
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        Alerta.Error('Error','Error al cambiar la contraseña');
      }
    };

    return {
      listaUsuarios,
      Eliminar_Usuario,
      guardarUsuarioYcerrarModal,
      NuevoUsuario,
      errors,
      searchQuery,
      filteredUsuarios,
      paginatedUsuarios,
      currentPage,
      itemsPerPage,
      headers,
      isLoading_Usuarios,
      resetear,
      Listar_Usuarios,
      closeModal,
      FormatFecha,
      onPageChange,
      eliminarFilaUsuario,
      newPassword,
      confirmPassword,
      abrirModalCambiarContrasena,
      guardarNuevaContrasena
    };
  },
};
</script>

<style lang="scss" scoped>
/* Estilos opcionales para el input de búsqueda y paginación */
</style>
