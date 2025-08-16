<template>
  <div>
    <h6>MIS OFERTAS</h6>

    <div v-if="listaCuponesUsados.length > 0">
      <div class="row">
        <div
          v-for="(cupon, index) in listaCuponesUsados"
          :key="cupon.id"
          class="col-lg-4 col-md-4 col-xs-12 rounded-3 mb-3"
        >
          <CardCuponUsado :currentCupon="cupon" @openModal="abrirModal" />
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning text-center">
      <i class="ph-duotone ph-warning"></i> No hay ofertas seleccionadas.
    </div>

    <!-- Modal para Evaluación -->
    <div class="modal fade" id="modalCupon" tabindex="-1" aria-labelledby="modalCuponLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-gray-200 py-2">
            <h6 class="modal-title" id="modalCuponLabel">
              <i class="p-r-15"></i>EVALUACIÓN
            </h6>
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div id="content-to-capture" ref="contentToCapture" class="p-4">
              <h5>RANKING</h5>
              <div class="d-flex justify-content-center mb-3">
                <button
                  v-for="num in 5"
                  :key="num"
                  :class="['btn', 'btn-outline-primary', 'mx-1', { 'active': num <= selectedRanking }]"
                  @click="selectedRanking = num"
                >
                  {{ num }}
                </button>
              </div>
              <div class="mb-3">
                <label for="observacionNegocio" class="form-label">Observación</label>
                <textarea id="observacionNegocio" class="form-control" v-model="observacionCliente"></textarea>
              </div>
            </div>
            <div class="modal-footer py-0">
              <button type="button" class="btn btn-primary" @click="enviarObservacionCliente">Enviar Observación</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { useCupones } from "../../composables/_composables";
import { FormatFecha } from "../../utils/_utils";
import { CardCuponUsado } from "../../components/_components";
import { useAuthStore } from "../../stores/authStore";
import { Cupones } from "../../interfaces/paciente.interface";
import { Modal } from "bootstrap";

export default defineComponent({
  components: {
    CardCuponUsado
  },
  name: "Perfil",
  setup() {
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const { listaCupones, cargarListaCuponesutilizados_idUsuario, listaCuponesUsados, ActualizarObservacionCliente } = useCupones();

    const modalInstance = ref<Modal | null>(null);
    const cuponSeleccionado = ref<Cupones | null>(null);
    const observacionCliente = ref("");
    const selectedRanking = ref(0);

    const abrirModal = (cupon: Cupones) => {
      cuponSeleccionado.value = cupon;
      const modalElement = document.getElementById("modalCupon");
      if (modalElement) {
        modalInstance.value = new Modal(modalElement);
        modalInstance.value.show();
      }
    };

    const cerrarModal = () => {
      if (modalInstance.value) {
        modalInstance.value.hide();
        cuponSeleccionado.value = null;
        observacionCliente.value = "";
        selectedRanking.value = 0;
      }
    };

    const enviarObservacionCliente = async () => {
      if (cuponSeleccionado.value) {
        try {
          await ActualizarObservacionCliente(
            cuponSeleccionado.value.id,
            observacionCliente.value,
            selectedRanking.value,
            Number(cuponSeleccionado.value.idUsuario)
          );
          console.log("Observación enviada con éxito");
        } catch (error) {
          console.error("Error al enviar la observación:", error);
        }
        cerrarModal();
      }
    };

    // Cargar la lista de cupones al montar el componente
    onMounted(async () => {
      try {
        await cargarListaCuponesutilizados_idUsuario(Usuario.value.idusuario);
        listaCuponesUsados.value = listaCupones.value; // Mostrar todos los cupones sin filtrar
      } catch (error) {
        console.error('Error cargando cupones:', error);
      }
    });

    return {
      listaCuponesUsados,
      FormatFecha,
      Usuario,
      cuponSeleccionado,
      observacionCliente,
      selectedRanking,
      abrirModal,
      cerrarModal,
      enviarObservacionCliente
    };
  },
});
</script>

<style scoped>

.card {
  margin-bottom: 1rem;
}

.image-container {
  margin: auto;
  background-color: azure;
  width: 140px;
  height: 140px;
  border-radius: 250px;
  overflow: hidden;
  justify-items: center ;
}

.image-container img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  
}
.border_lineaspunteadas{
  border-style: dotted;
  border-top: 2px sienna dashed;  
  width: 50%;
  margin: auto;
  margin-top: 10px;
}
.bgdegradado{
  background: rgb(0,36,91);
  background: linear-gradient(90deg, rgba(0,36,91,1) 0%, rgba(12,71,124,1) 76%, rgba(47,112,185,1) 100%);
}
</style>
