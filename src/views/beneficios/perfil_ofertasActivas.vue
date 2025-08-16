<template>
  <div>
    <h6>MIS OFERTAS</h6>
    <Divloading v-if="isLoading"/>
    <Transition>
      <div v-if="listaCupones.length > 0">
        <div class="row">
          <div
            v-for="(cupon, index) in listaCupones"
            :key="index"
            class="col-lg-3 col-md-3 col-xs-6  rounded-3 mb-3"
          >
              <CardCupon
                        :currentCupon="cupon"
                        @abrirModalCupon="openModalCupon"
                        @abrirModalAsignar="openModalAsignar"
                        @eliminarCupon="eliminarCuponPorUsuario"
                        @actualizarListaCupones="recargarCupones"
                      />
          </div>
        </div>
      </div>
    </Transition>
    
   </div> 


   
  <!-- Modal para mostrar y descargar QR -->
  <div
      class="modal fade"
      id="modalCupon"
      tabindex="-1"
      aria-labelledby="modalCuponLabel"
      aria-hidden="true"
      ref="modalCuponRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-gray-200 py-2">
            <h6 class="modal-title" id="modalCuponLabel">
              <i class="p-r-15"></i>CUPÓN
            </h6>
            <button type="button" class="btn-close btn-sm"  data-bs-dismiss="modal" aria-label="Close" ></button>
          </div>

          <div v-if="cuponSeleccionado"  class="modal-body p-0">
            <div
              id="content-to-capture"
              ref="contentToCapture"
              class="p-4"
            >
              <div class="b-blue  justify-content-center">
                <div class="px-2 bg-white text-center text-blue f-20 f-w-800 mt-2">
                  {{ cuponSeleccionado.negocioRazonSocial }}
                </div>
                <!-- -------------------------------------------------------------------------------------------------------- -->
                <!-- --------------------------------------------------------------------------------------------------------- -->
                <div class="d-flex flex-column align-items-center">
                    <img  class="img-fluid" src="../../assets/logoimp.png" width="100px" />
                   <div class="image-container position-relative mt-1">
                <img v-if="cuponSeleccionado.negocioLogoUrl" class="img-fluid" :src="cuponSeleccionado.negocioLogoUrl" />
                <img v-else class="img-fluid" src="../../assets/img_card_default.avif" />
            </div>
            <div class="px-2 bg-white text-center text-blue f-20 f-w-800 mt-3">
                  {{ cuponSeleccionado?.negocioNombre }}
                </div>
                  <div class="badge bg-red-300 py-1 mb-3 f-20 text-center">                
                    <template v-if="Usuario.idrol===1">
                      <template v-if="cuponSeleccionado?.ofertaTipoDescuento === 'Porcentual'">
                        {{ cuponSeleccionado?.ofertaValorDescuentoCliente || 'N/A' }} %
                      </template>
                      <template v-else>
                        {{ cuponSeleccionado?.ofertaValorDescuentoCliente || 'N/A' }}
                      </template>
                    </template>
                    <template v-if="Usuario.idrol===2">
                      <template v-if="cuponSeleccionado?.ofertaTipoDescuento === 'Porcentual'">
                        {{ cuponSeleccionado?.ofertaValorDescuentoTrabajador || 'N/A' }} %
                      </template>
                      <template v-else>
                        {{ cuponSeleccionado?.ofertaValorDescuentoTrabajador || 'N/A' }}
                      </template>
                    </template>
                  </div>
                </div>
                <hr class="border_lineaspunteadas">
                <div class="p-2 bg-white text-center text-blue f-16">
                    En beneficio de:
                </div>
                <div class="px-2 bg-white text-center text-blue f-20 f-w-800">
                  {{ cuponSeleccionado.nombreBeneficiario }}
                </div>
                <div class="px-2 bg-white text-center">
                  <span class="badge bg-primary">
                    {{ Usuario.idrol === 2 ? 'Trabajador' : 'Cliente' }}
                  </span>
                </div>
                <div class="px-2 bg-white text-center text-blue f-16">
                  En:
                </div>
                <div class="p-2 bg-white text-center text-blue f-20 f-w-800">
                  {{ cuponSeleccionado.ofertaNombre }}
                </div>
                <div class="px-2 bg-white text-center text-gray-500 f-16">
                  (Válido hasta el {{ FormatFecha.fecha_dd_mm_yyyy(cuponSeleccionado.fechaFin) }})
                </div>
                 <!-- <div class="px-2 bg-white f-16 text-center" :class="cuponSeleccionado.estado === 'Utilizado' ? 'text-danger' : 'text-success'">
                <i class="fa" :class="cuponSeleccionado.estado === 'Utilizado' ? 'fa-times-circle' : 'fa-check-circle'"></i> 
              </div> -->
                <div class="p-2 bg-white text-center text-red-400 f-48 f-w-800">
                  <img v-if="qrCode" :src="qrCode" alt="Código QR" />
                </div>
                <div class="p-2 bg-white text-center text-blue f-13 f-w-800">
                  Código Cupón: {{ cuponSeleccionado.qrCode }}
                </div>
                <div class="w-100 d-flex justify-content-center pt-4 px-5">
                  <div :class="cuponSeleccionado.estado === 'Utilizado' || FormatFecha.esVencido(cuponSeleccionado.fechaFin) ? 'alert alert-danger d-flex align-items-center' : 'alert alert-success d-flex align-items-center'">
                    <i :class="cuponSeleccionado.estado === 'Utilizado' || FormatFecha.esVencido(cuponSeleccionado.fechaFin) ? 'fa fa-times-circle h4 me-2' : 'fa fa-check-square h4 me-2'"></i>
                    <template v-if="cuponSeleccionado.estado === 'Utilizado'">
                      <span class="f-20">Cupón Utilizado</span>
                    </template>
                    <template v-else-if="FormatFecha.esVencido(cuponSeleccionado.fechaFin)">
                      <span class="f-20">Este cupón está vencido.</span>
                    </template>
                    <template v-else>
                      <span>Tu Cupón ya está listo para ser canjeado en cualquiera de nuestros establecimientos.</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer py-0">
            <template v-if="cuponSeleccionado.estado === 'Activo'">
              <button
                type="button"
                class="btn btn-success"
                @click="downloadImageModal"
              >
                Descargar
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  
    <!-- ------------------------------------------------------------------------- -->

     <!-- Modal para mostrar y descargar QR -->
  <div
      class="modal fade"
      id="modalAsignarFamiliar"
      tabindex="-1"
      aria-labelledby="modalAsignarFamiliarLabel"
      aria-hidden="true"
      ref="modalAsignarFamiliarRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header modal_head_bg py-2">
            <h6 class="modal-title" id="modalAsignarFamiliarLabel">
              <i class="p-r-15"></i>Asignar un Familiar
            </h6>
            <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div
              id="content-to-capture"
              ref="contentToCapture"
              class="p-4">
                <!-- ---- Probando -->
                <label class="form-label f-13">Seleccione un Familiar</label>
                <div class="s"
                    v-for="(familiar,index) in listaFamiliar" :key="familiar.id">
                  <input  v-model="familiarElegido"
                          class="btn-check"  type="radio" name="radioprioridad" :value="familiar" :id="'lbl_radioprioridad' + index">
                    <label class=" btn btn-outline-secondary m-r-5 w-100 f-w-500"  :for="'lbl_radioprioridad' + index"> {{familiar.nombre}} {{familiar.apePaterno}} {{familiar.apeMaterno}}</label>
                </div>
            </div>
          </div>

          <div class="modal-footer py-0">
            <button type="button" class="btn btn-success" @click="Registrar_AsignacionFamiliar">
              <i class="fa fa-check"></i> Asignar</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>


</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick } from "vue";
import { useCupones, useFamiliars } from "../../composables/_composables";
import { FormatFecha } from "../../utils/_utils";
import { CardCupon } from "../../components/_components";
import { initializeCupones, type Cupones } from "../../interfaces/_interface";
import { useAuthStore } from "../../stores/authStore";
import { Modal } from "bootstrap";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { URL_DOMINIO } from "../../config";

export default defineComponent({
  components: {
    CardCupon
  },
  name: "Perfil",
  setup() {
    const authStore = useAuthStore();
    const Usuario = computed(() => authStore.usuarioLogueado);
    const { listaCupones, cargarListaCuponesPendientes_idUsuario, isLoading, eliminarCupon, eliminarCuponPorUsuario } = useCupones();
    const { listaFamiliar, Listar_Familiar_Cliente, Listar_Familiar_Trabajador,familiarAsignado,AsignarCupon_Familiar, familiarElegido } = useFamiliars();

    
    const qrCode = ref("");

    const cuponSeleccionado = ref<Cupones>(initializeCupones());
    const modalCuponRef = ref<HTMLElement | null>(null);    const modalAsignarFamiliarRef = ref<HTMLElement | null>(null);
      // Cargar la lista de cupones pendientes al montar el componente
    onMounted(async () => {
      await cargarListaCuponesPendientes_idUsuario(Usuario.value.idusuario);
      if (Usuario.value.idrol == 1) await Listar_Familiar_Cliente(Usuario.value.id);
      else await Listar_Familiar_Trabajador(Usuario.value.id);
    });

    const openModalCupon = async (cupon: Cupones) => {
      cuponSeleccionado.value = cupon;
      // console.log('Datos del cupón seleccionado:', cuponSeleccionado.value);
      await nextTick();
      if (modalCuponRef.value) new Modal(modalCuponRef.value).show();
      await generateQRCode(cupon.id); 

    };

    const closeModalCupon = () => {
      if (modalCuponRef.value) new Modal(modalCuponRef.value).hide();
    };

    const openModalAsignar = async (cupon: Cupones) => {
      cuponSeleccionado.value = cupon;
      await nextTick();
      if (modalAsignarFamiliarRef.value) new Modal(modalAsignarFamiliarRef.value).show();
    };

    const closeModalAsignar = () => {
      if (modalAsignarFamiliarRef.value) new Modal(modalAsignarFamiliarRef.value).hide();
    };
    const closeModal = () => {
      const modalElement = document.getElementById("modalAsignarFamiliar");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (modal) modal.hide();
      }
    };    const recargarCupones = async () => {
      await cargarListaCuponesPendientes_idUsuario(Usuario.value.idusuario);
    };

    
    // Función para descargar la imagen con html2canvas
    const downloadImageModal = async () => {
      const contentToCapture = document.querySelector("#content-to-capture") as HTMLElement;
      if (contentToCapture) {
        html2canvas(contentToCapture).then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "cupon_descuento.jpg";
          link.click();
        }).catch((error) => {
          console.error("Error al capturar el div:", error);
        });
      } else {
        console.error("El div no se ha encontrado");
      }
    };


    // Función para generar el QR
    const generateQRCode = async (cuponId: number) => {
      const textocodigo = `${URL_DOMINIO}verificacion/${cuponId}`;
      try {
        const url = await QRCode.toDataURL(textocodigo, {
          width: 200,
          margin: 1,
          errorCorrectionLevel: "Q",
        });
        qrCode.value = url; // Se actualiza con cada cupón
      } catch (err) {
        console.error("Error generando QR:", err);
      }
    };

    const Registrar_AsignacionFamiliar = async () => {
      
      familiarAsignado.value.idFamiliar = familiarElegido.value.id.toString();
      familiarAsignado.value.nombreBeneficiario = familiarElegido.value.nombre + ' ' + familiarElegido.value.apeMaterno + ' ' + familiarElegido.value.apePaterno;
        try {
        await AsignarCupon_Familiar(cuponSeleccionado.value.id.toString());
        await cargarListaCuponesPendientes_idUsuario(Usuario.value.idusuario);
        closeModal();

      } catch (error) {
        console.error('Error al subir los cambios:', error);
      }
    };

    const convertImageToBase64 = (imgSrc: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL("image/png"); // O "image/jpeg" si es necesario
            resolve(base64);
          } else {
            reject("No se pudo obtener el contexto del canvas.");
          }
        };

        img.onerror = (err) => reject("Error al cargar la imagen: " + err);
      });
    };

    // ---------------------------------------------------------------------------------------------------------
    // const EliminarCupon = async (id: number) => {
    //   await eliminarCupon(id); 
    //     await recargarCupones();
    // };
    
    // const handleEliminarCupon = async (id: number) => {
    //   await eliminarCupon(id); 
    //   await cargarListaCupones_idUsuario(parseInt(Usuario.value.idusuario)); // Recargar la lista de cupones
    // };
    // ---------------------------------------------------------------------------------------------------------
    
    return {
      listaCupones,
      cuponSeleccionado,
      FormatFecha,
      recargarCupones,
      openModalCupon,
      closeModalCupon,
      modalCuponRef,
      openModalAsignar,
      closeModalAsignar,
      modalAsignarFamiliarRef,
      listaFamiliar,
      familiarElegido,
      Usuario, qrCode,
      Registrar_AsignacionFamiliar,
      downloadImageModal,
      closeModal,
      isLoading,
      eliminarCuponPorUsuario
      // eliminarCupon
      // EliminarCupon
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
