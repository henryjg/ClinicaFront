<template>
    <!-- Modal para cambiar contraseña -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" 
        aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Loader -->
          <ModalLoader :loading="isLoadingModal" message="Preparando formulario..." />
          
          <div class="modal-body py-0" :class="{ 'opacity-50': isLoadingChange }">
            <Vue3Lottie :animationData="lock" :height="150" :width="150" />
            <div class="text-center"><h5 class="text-yellow-700">Bienvenido a nuestra plataforma de beneficios IMP</h5></div>
            <div class="alert alert-warning">
              <i class="fa fa-exclamation-triangle p-r-5"></i>Por su seguridad, debe cambiar su contraseña.
            </div>
            <form @submit.prevent="handleChangePassword" class="p-2">
              <div class="mb-2">
                <label for="newPassword" class="form-label">Nueva Contraseña:</label>
                <input type="password" class="form-control" v-model="newPassword" required />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar Nueva Contraseña:</label>
                <input type="password" class="form-control" v-model="confirmPassword" required />
              </div>
              <!-- Mostrar las condiciones de validación -->
              <div class="alert alert-secondary">
                <div>
                  <span :class="passwordErrors.hasUpperCase ? 'text-success' : 'text-danger'">
                    <i class="f-16 p-r-5" :class="passwordErrors.hasUpperCase ? 'ph-duotone ph-check-circle' : 'ph-duotone ph-x-circle'"></i>
                    Debe tener al menos una letra mayúscula</span>
                </div>
                <div>
                  <span :class="passwordErrors.hasNumbersAndLetters ? 'text-success' : 'text-danger'">
                    <i class="f-16 p-r-5" :class="passwordErrors.hasUpperCase ? 'ph-duotone ph-check-circle' : 'ph-duotone ph-x-circle'"></i>
                    Debe contener números y letras</span>
                </div>
                <div>
                  <span :class="passwordErrors.hasMinLength ? 'text-success' : 'text-danger'">
                    <i class="f-16 p-r-5" :class="passwordErrors.hasUpperCase ? 'ph-duotone ph-check-circle' : 'ph-duotone ph-x-circle'"></i>
                    Debe tener más de 10 caracteres</span>
                </div>
                <div>
                  <span :class="passwordErrors.passwordsMatch ? 'text-success' : 'text-danger'">
                    <i class="f-16 p-r-5" :class="passwordErrors.hasUpperCase ? 'ph-duotone ph-check-circle' : 'ph-duotone ph-x-circle'"></i>
                    Las contraseñas deben ser iguales</span>
                </div>
              </div>
            </form>
          </div>          <div class="modal-footer py-1 justify-content-center text-center">
            <button 
              type="submit" 
              class="btn btn-blue" 
              @click="handleChangePassword"
              :disabled="isLoadingChange || !isPasswordValid"
            >
              <span v-if="isLoadingChange" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <span v-if="isLoadingChange">Cambiando...</span>
              <span v-else>Cambiar Contraseña</span>
            </button>
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeChangePasswordModal"
              :disabled="isLoadingChange"
            >
              Después
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
    <script setup lang="ts">
// Utils
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { Modal } from 'bootstrap';
import lock from '../../assets/lotties/lock.json';

// Centralized imports
import { Vue3Lottie, carousel_fotos, ModalLoader } from '../../components/_components';
import { usarAutenticacion, useAuthStore } from '../../composables/_composables';
import { Notif } from '../../utils/_utils';

// Estados de carga separados
const isLoadingModal = ref(false);
const isLoadingChange = ref(false);

const isDarkTheme = ref(false);
const authStore = useAuthStore();
const { changePassword, newPassword, confirmPassword } = usarAutenticacion();
const Usuario = computed(() => authStore.usuarioLogueado);

// Creamos una variable para almacenar los estados de cada validación individual
const passwordErrors = ref({
  hasUpperCase: false,
  hasNumbersAndLetters: false,
  hasMinLength: false,
  passwordsMatch: false
});

let userId = ref<string | null>(null);

// Computed para verificar si la contraseña es válida
const isPasswordValid = computed(() => {
  return Object.values(passwordErrors.value).every(isValid => isValid);
});

// Preparar formulario automáticamente
const prepararFormulario = async () => {
  try {
    isLoadingModal.value = true;
    
    // Reset de campos
    newPassword.value = '';
    confirmPassword.value = '';
    
    // Reset de validaciones
    passwordErrors.value = {
      hasUpperCase: false,
      hasNumbersAndLetters: false,
      hasMinLength: false,
      passwordsMatch: false
    };
    
    await nextTick();
  } catch (error) {
    console.error('Error preparando formulario:', error);
    Notif.Error('Error al preparar el formulario');
  } finally {
    isLoadingModal.value = false;
  }
};

onMounted(() => {
  isDarkTheme.value = checkIfDarkTheme();
  prepararFormulario();
});

const checkIfDarkTheme = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const closeChangePasswordModal = () => {
  try {
    // Reset de estados
    isLoadingModal.value = false;
    isLoadingChange.value = false;
    
    // Cerrar modal
    const modalElement = document.getElementById('changePasswordModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      if (modal) modal.hide();
    }
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};

// Función para validar las contraseñas individualmente
const validatePasswords = () => {
  passwordErrors.value.hasUpperCase = /[A-Z]/.test(newPassword.value);
  passwordErrors.value.hasNumbersAndLetters = /[a-zA-Z]/.test(newPassword.value) && /\d/.test(newPassword.value);
  passwordErrors.value.hasMinLength = newPassword.value.length > 10;
  passwordErrors.value.passwordsMatch = newPassword.value === confirmPassword.value && newPassword.value.length > 0;
};

// Usamos watch para hacer la validación reactiva mientras se escribe
watch(newPassword, () => {
  validatePasswords();
});

watch(confirmPassword, () => {
  validatePasswords();
});

const handleChangePassword = async () => {
  // Prevenir múltiples clicks
  if (isLoadingChange.value) return;
  
  if (!isPasswordValid.value) {
    Notif.Error('Por favor, asegúrese de que todas las validaciones de contraseña sean correctas');
    return;
  }
  
  try {
    isLoadingChange.value = true;
    
    await changePassword();
    Notif.Success('Contraseña cambiada correctamente');
    closeChangePasswordModal();
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    Notif.Error('Error al cambiar la contraseña');
  } finally {
    isLoadingChange.value = false;
  }
};
  </script>
  
  
  
  
  <style lang="scss" scoped>
  
  
  /* El contenedor debe ocupar espacio y ocultar cualquier contenido que se desborde */
  .custom-div {
    width: 100%; /* Ajusta al ancho total del contenedor */
    height: calc(100vh - 124px); /* Altura dinámica restando 124px (por el header, por ejemplo) */
    display: flex; /* Habilita flexbox para centrar */
    justify-content: center; /* Centra horizontalmente el contenido */
    align-items: center; /* Centra verticalmente el contenido */
    overflow: hidden; /* Oculta cualquier parte de la imagen que desborde */
    background-color: #000; /* Opcional: color de fondo */
  }
  
  /* La imagen se ajustará dinámicamente */
  .img-centered {
    width: 100%; /* Imagen ocupa el 100% del ancho inicialmente */
    height: auto; /* Mantiene la proporción de la imagen */
    min-height: 100%; /* Asegura que siempre ocupe el alto del contenedor */
    object-fit: cover; /* Llena el espacio disponible del contenedor, recortando si es necesario */
  }
  
  /* Opcional: asegúrate de que el body no tenga desplazamiento no deseado */
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
  }
  
  
  
  </style>