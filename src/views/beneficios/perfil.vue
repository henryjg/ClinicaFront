<template>
  <div class="container mt-4">
    <!-- Contenido principal -->
    <div class="row">
      <!-- Menú de Navegación -->
      <div class="col-md-3 ">
        <!-- DESKTOP ---------------- -->
        <div class="card d-none d-lg-block">
          <div class="card-body">
            <div class="row g-0 ">
               <div class="col-md-3 mb-4">
                <img
                  :src="usuario.rol.includes('Trabajador') && usuario.fotoperfil ? usuario.fotoperfil : '/src/assets/images/avatar.png'"
                  alt="Imagen superior"
                  class="rounded-circle"
                  style="width: 150px; height: 150px; object-fit: cover; margin: auto;"
                  @click="usuario.rol.includes('Trabajador') ? openModal() : null"
                />
              </div>
              <router-link to="misdatos" class="col-lg-12 col-3">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap">
                    <i class="ph-duotone ph-user-circle p-r-10"></i> 
                    Perfil
                </div>
              </router-link>
              <!-- ---------------- -->
              <router-link to="misfamiliares" class="col-lg-12 col-3">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap ">
                    <i class="ph-duotone ph-map-pin  p-r-10"></i> 
                    Familiar
                </div>
              </router-link>
              <!-- ---------------- -->
              <router-link to="miscupones" class="col-lg-12 col-3">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap">
                    <i class="ph-duotone ph-shopping-cart  p-r-10"></i> 
                    Cupones
                </div>
              </router-link>
              <!-- ---------------- -->
              <!-- ---------------- -->
              <router-link to="miscuponesusados" class="col-lg-12 col-3">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap">
                    <i class="ph-duotone ph-shopping-cart  p-r-10"></i> 
                    Historial
                </div>
              </router-link>
              <!-- ---------------- -->
              <!-- <div class="col-lg-12 col-3">
                <div @click="openChangePasswordModal" class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap">
                  <i class="ph-duotone ph-key  p-r-10"></i> 
                  Cambiar Contraseña
                </div>
              </div> -->
              <!-- ---------------- -->
              
              <div class="col-lg-12 col-3">
                <div @click="confirmLogout" class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap">
                  <i class="ph-duotone ph-gear  p-r-10"></i> 
                  Cerrar Sesión
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- RESPONSIVE ---------------- -->

        <div class="card d-sm-none d-sm-block m-auto">
          <div class="card-body p-1">
            <div class="row g-0">
              <div class="col-md-12 mb-4 text-center">
                <div v-if="usuario.fotoperfil" class="circular-div-small" @click="openModal">
                  <img :src="usuario.fotoperfil" alt="Imagen de perfil">
                </div>
                <img v-else class="rounded-circle img-fluid img-thumbnail" src="/src/assets/images/avatar.png" @click="openModal">
              </div>
              <router-link to="misdatos" class="col-lg-12 col-3">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap justify-content-center">
                  <i class="ph-duotone ph-user-circle m-auto" style="font-size: 27px !important;"></i>
                  <div class="w-100">Perfil</div>
                </div>
              </router-link>
              <!-- ---------------- -->
              <router-link to="misfamiliares" class="col-lg-12 col-3">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap justify-content-center">
                    <i class="ph-duotone ph-duotone ph-person d-block " style="font-size: 27px !important;"></i> 
                    <div class="w-100">Familiar</div>                    
                </div>
              </router-link>
              <!-- ---------------- -->
              <router-link to="miscupones" class="col-lg-12 col-3 ">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap justify-content-center">
                    <i class="ph-duotone ph-duotone ph-ticket d-block " style="font-size: 27px !important;"></i> 
                    <div class="w-100">Cupones</div>                    
                </div>
              </router-link>

               <!-- ---------------- -->
               <router-link to="miscuponesusados" class="col-lg-12 col-3 ">
                <div class="btn-link-hover-info btn mb-2 w-100 d-flex flex-wrap justify-content-center">
                    <i class="ph-duotone ph-duotone ph-database d-block m-auto" style="font-size: 27px !important;"></i> 
                    <div class="w-100">Historial</div>     
                </div>
              </router-link>
              <!-- ---------------- -->
            
            </div>
          
            <!-- ---------------- -->
          </div>
        </div>
       
      </div>

      <!-- Contenido -->
      <div class="col-md-9">
        <div class="card h-100">
          <div class="card-body">
            
            <RouterView></RouterView>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for updating profile photo -->
    <div class="modal fade" id="modal_update_photo" tabindex="-1" aria-labelledby="modal_update_photoLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal_update_photoLabel">Actualizar Foto de Perfil</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <FileUploader 
              titulo="Fotografía perfil"
              elementoLoader="loaderFotoPerfil"
              tipoArchivo="fotografia"
              :archivoTemporal="archivoTrabajador.ArchivoTemporal.value"
              :resetTrigger="resetTrigger"
              @archivoSubido="onFileUploaded"
              @uploadingStatus="archivoTrabajador.isUploading.value = $event"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="savePhoto">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <modal_CambiarPass />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { Modal } from "bootstrap";
import { Alerta } from '../../utils/_utils';
import { usarAutenticacion, useTrabajador, useSubirArchivo } from "../../composables/_composables";
import { useAuthStore } from "../../stores/authStore";
import FileUploader from "../../components/FileUploader_miniatura.vue";

export default defineComponent({
  name: "Perfil",
  components: { FileUploader },
  setup() {
    const { Actualizar_Trabajador } = useTrabajador();
    const { logout } = usarAutenticacion();
    const authStore = useAuthStore();
    const usuario = computed(() => authStore.usuarioLogueado);

    const archivoTrabajador = useSubirArchivo("loadingfile", "fotografia");
    const resetTrigger = ref(0);

    const openModal = () => {
      const modalElement = document.getElementById("modal_update_photo");
      if (modalElement) {
        const modal = new Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        modal.show();
      } else {
        console.error("No se encontró el elemento del modal con el ID 'modal_update_photo'.");
      }
    };

    const onFileUploaded = (archivo: { url: string }) => {
      usuario.value.fotoperfil = archivo.url;
    };

    const savePhoto = async () => {
      try {
        await Actualizar_Trabajador(usuario.value.id, { fotoPerfil: usuario.value.fotoperfil });
        const modalElement = document.getElementById("modal_update_photo");
        if (modalElement) {
          const modal = Modal.getInstance(modalElement);
          modal?.hide();
        }
      } catch (error) {
        console.error("Error al guardar la foto de perfil:", error);
      }
    };

    const confirmLogout = () => {
      Alerta.Confirmacion_CerrarSesion(
        '¿Estás seguro de que deseas cerrar sesión?',
        'Esta acción cerrará tu sesión actual.'
      ).then((confirmed: boolean) => {
        if (confirmed) {
          logout();
        }
      });
    };

    return {
      confirmLogout,
      openModal,
      usuario,
      archivoTrabajador,
      resetTrigger,
      onFileUploaded,
      savePhoto
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

.circular-div-small {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circular-div-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
