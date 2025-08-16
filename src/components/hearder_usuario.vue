<template>
    <li class="dropdown pc-h-item header-user-profile">
      <a class="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
        aria-haspopup="false" data-bs-auto-close="outside" aria-expanded="false">

        <div class="wid-40 hei-40 rounded-circle bg-blue-900 text-center justify-content-center align-content-center">
            <i class="fa fa-user"></i>
        </div>

      </a>
      <div class="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
        <div class="dropdown-header d-flex align-items-center " style="width: 280px">
          <h6 class="m-0 p-r-5">Usuario </h6>
          <span class="badge bg-primary">{{Usuario?.oficina_nombre}}</span>
        </div>
        <div class="dropdown-body ">
         
            <ul class="list-group list-group-flush ">
              <li class="list-group-item px-3">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 mx-0">
                    <h6 class="mb-0">{{Usuario?.nombreusuario}}</h6>
                    <a class="link-primary" href="mailto:carson.darrin@company.io">{{Usuario?.correo}}</a>
                  </div>
                  
                </div>
              </li>
              <li class="list-group-item  py-2 px-2">
             
               
              </li>
            </ul>
         
        </div>
      </div>
    </li>
</template>

<script lang="ts">
import { computed } from 'vue';
import { DOC_URL } from '../config';
import { useAuthStore } from '../stores/authStore';
import { UsuarioLogueado } from '../interfaces/usuario.interface';

export default {
    setup () {
        const authStore = useAuthStore();
        const Usuario   = computed(() => authStore.usuarioLogueado);        
        return {Usuario, DOC_URL, authStore}
    }
}
</script>

<style lang="scss" scoped>

</style>