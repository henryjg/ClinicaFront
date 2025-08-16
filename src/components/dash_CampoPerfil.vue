<template>
    <li class="dropdown pc-h-item header-user-profile">
      <a class="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
        aria-haspopup="false" data-bs-auto-close="outside" aria-expanded="false">
       
        <div class="p-2 rounded-circle bg-blue-900 text-center justify-content-center align-content-center">
            <i class="fa fa-user"></i>
        </div>

      </a>
      <div class="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
        <div class="dropdown-header d-flex align-items-center justify-content-between">
          <h6 class="m-0">Perfil de Usuario </h6>
          <span class="badge bg-primary">{{Usuario?.oficina_nombre}}</span>
        </div>
        <div class="dropdown-body">
          <div class="profile-notification-scroll position-relative" style="max-height: calc(100vh - 225px)">
            <ul class="list-group list-group-flush w-100">
              <li class="list-group-item">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
              
                  </div>
                  <div class="flex-grow-1 mx-3">
                    <h6 class="mb-1">{{Usuario?.nombreusuario}}</h6>
                    <a class="link-primary" href="mailto:carson.darrin@company.io">{{Usuario?.correo}}</a>
                  </div>
                  
                </div>
              </li>
              <li class="list-group-item">
                <a href="#" class="dropdown-item" @click="openChangePasswordModal" >
                  <span class="d-flex align-items-center">
                    <i class="ph-duotone ph-key"></i>
                    <span>Cambiar Contraseña</span>
                  </span>
                </a>
           
              </li>
              <li class="list-group-item">
             
                <a  href="#" class="dropdown-item" @click="logout">
                  <span class="d-flex align-items-center">
                    <i class="ph-duotone ph-power text-warning"></i>
                    <span>Cerrar Sesión</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </li>    <!-- Modal de Bootstrap -->
    <div class="modal fade " id="dashChangePasswordModal" tabindex="-1" aria-labelledby="dashChangePasswordModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Loading overlay manual -->
          <div v-if="isLoadingModal" class="d-flex justify-content-center align-items-center py-4">
            <div class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2 text-muted">Preparando formulario...</p>
            </div>
          </div>
          
          <div v-else class="modal-header py-2 modal_head_bg" :class="{ 'opacity-50': isLoadingChange }">
            <h5 class="modal-title" id="dashChangePasswordModalLabel">
              <i class="ph-duotone ph-key"></i>
              Cambiar Contraseña</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" :disabled="isLoadingChange"></button>
          </div>
          <div v-if="!isLoadingModal" class="modal-body" :class="{ 'opacity-50': isLoadingChange }">
            <form @submit.prevent="changePasswordWithClose">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Contraseña Actual:</label>
                <input type="password" class="form-control" v-model="currentPassword" required :disabled="isLoadingChange" />
              </div>
              <div class="mb-3">
                <label for="newPassword" class="form-label">Nueva Contraseña:</label>
                <input type="password" class="form-control" v-model="newPassword" required :disabled="isLoadingChange" />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar Nueva Contraseña:</label>
                <input type="password" class="form-control" v-model="confirmPassword" required :disabled="isLoadingChange" />
              </div>
            </form>
          </div>
          <div v-if="!isLoadingModal" class="modal-footer py-1">
            <button 
              type="submit" 
              class="btn btn-primary" 
              @click="changePasswordWithClose"
              :disabled="isLoadingChange"
            >
              <span v-if="isLoadingChange" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <span v-if="isLoadingChange">Cambiando...</span>
              <span v-else>Cambiar Contraseña</span>
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { usarAutenticacion } from "../composables/AuthValidate";
import { useAuthStore } from '../stores/authStore';
import { Modal } from 'bootstrap';
import { ref, nextTick } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const { logout, changePassword, currentPassword, newPassword, confirmPassword, Usuario } = usarAutenticacion();

    // Estados de carga separados
    const isLoadingModal = ref(false);
    const isLoadingChange = ref(false);

    // Preparar formulario automáticamente
    const prepararFormulario = async () => {
      try {
        isLoadingModal.value = true;
        
        // Reset de campos
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        
        await nextTick();
      } catch (error) {
        console.error('Error preparando formulario:', error);
      } finally {
        isLoadingModal.value = false;
      }
    };

    const openChangePasswordModal = async () => {
      await prepararFormulario();
      
      const modalElement = document.getElementById('dashChangePasswordModal');
      if (modalElement) {
        document.body.appendChild(modalElement);
        const modal = new Modal(modalElement);
        modal.show();
      }
    };

    const closeChangePasswordModal = () => {
      // Reset de estados
      isLoadingModal.value = false;
      isLoadingChange.value = false;
      
      const modalElement = document.getElementById('dashChangePasswordModal');
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };

    const changePasswordWithClose = async () => {
      // Prevenir múltiples clicks
      if (isLoadingChange.value) return;
      
      try {
        isLoadingChange.value = true;
        await changePassword(); 
        closeChangePasswordModal(); 
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
      } finally {
        isLoadingChange.value = false;
      }
    };

    return {
      Usuario,
      logout,
      authStore,
      currentPassword,
      newPassword,
      confirmPassword,
      openChangePasswordModal,
      changePasswordWithClose,
      isLoadingModal,
      isLoadingChange,
    };
  }
};
</script>
<style>
.modal {
  z-index: 1055 !important;
}

.modal-backdrop {
  z-index: 1050 !important;
}


</style>
<!--  -->