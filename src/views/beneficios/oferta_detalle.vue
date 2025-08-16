<template>
  <Divloading v-if="isloading_ofertas" class="pt-5"/>
<Transition>
  <div v-if="!isloading_ofertas">
    <!-- -------------------------------------------------------------------------- -->
    <div class="container pt-4">
      <div class="row">
        <div class="col-md-8 pb-3  text-justify">     
   
          <div class="image-container m-auto d-flex justify-content-center">
            <img
              v-if="oferta.imagenUrl && oferta.imagenUrl !== ''"
              :src="oferta.imagenUrl"
              class="rounded-3"
              style="max-width:100%;height:auto; margin:auto"
              alt="Imagen de la oferta"
            />
            <div v-else class="alert alert-warning">No hay imagen de oferta disponible</div>
          </div>
        </div>
        <div class="col-md-4">
          <!-- --------------------- -->
          <div class="card bg-red-300 mb-3 mt-5">
            <div class="card-body ">
              <div class="row ">
                <div class="col-12 text-center  ">
                  <img
                    v-if="negocio.logoUrl && negocio.logoUrl !== ''"
                    class="border-2 b-light rounded-4 m-auto bg-white shadow"
                    style="margin-top: -65px !important; width: 30%;"
                    :src="negocio.logoUrl"
                    alt="Logo del negocio"
                  />
                  <div v-else class="alert alert-warning">No hay logo disponible</div>
                </div>
                <div class="col-7">
                  <p v-if="descuento && oferta.tipoDescuento === 'Porcentual'" class="f-48 fw-bold text-center lh-1 pt-3 pb-0 mb-0 text-white">
                    {{ descuento }}%
                  </p>
                  <p v-else-if="oferta.tipoDescuento !== 'Porcentual'" class="f-48 fw-bold text-center lh-1 pt-3 pb-0 mb-0 text-white">
                    {{ descuento }}
                  </p>
                  <h5 class="text-gray-800 pt-0 mt-0  text-center ">Descuento</h5>
                </div>
                <div class="col-5 align-content-center d-flex">
                  <h3 class="pt-4 text-center" v-if="negocio">¡Oferta Especial!</h3>
                </div>
                
                <div class="col-12 pt-2 m-auto text-center">
                  <div class="btn btn-danger border-0 bg-red-700 btn-lg m-auto" @click="manejarPromocion">
                    <i class="ph-duotone ph-shopping-cart"></i> Quiero esta promoción
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- ---------------------- -->
          <div class="card bg-white shadow-sm border-0">
            <div class="card-body ">
              <div class="row">
                <div class="col-12 pt-1">
                  <div class="text-gray-800 d-flex">
                    <strong class="align-content-center">
                      <i class="ph-duotone ph-check-circle f-18 p-r-5"></i>
                    </strong> 
                    <div> Exclusivo para clientes IMP</div>
                  </div>
                  <!-- ----- -->
                  <div class="text-gray-800 d-flex">
                    <strong class="align-content-center">
                      <i class="ph-duotone ph-check-circle f-18 p-r-5"></i>
                    </strong> 
                    <strong class="p-r-5">Promoción válida hasta el </strong>
                    <div> {{ FormatFecha.fecha_dd_mm_yyyy(oferta.fechaFin) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8 text-justify">          
          
          <h2 class="pt-4 px-3" v-if="negocio">{{ oferta.nombreOferta }}</h2>
          <div class="row">
            <!-- <div class="col-6"><strong>Fecha de Publicación:</strong> {{ oferta.fechaInicio }}</div> -->
          </div>
          <p v-if="negocio"></p>
          <h5 class="px-3"><i class="ph-duotone ph-chat-teardrop p-r-10"></i>Descripción:</h5>
          <hr class="w-25 mt-0">
          <div  v-html="oferta.descripcion" class="mt-2 px-3"></div>
         
          <h5 class="pt-4 px-3"><i class="ph-duotone ph-chat-teardrop p-r-10"></i>Términos y Condiciones</h5>
          <hr class="w-25 mt-0">
          <div  v-html="oferta.terminosCondiciones" class="mt-2 px-3"></div>
          
          
          <div v-if="negocio.sitioWeb">
            <h4>Información de contacto:</h4>
            <ul>
              <li v-if="negocio.sitioWeb">
                <strong>Página Web:</strong>
                <a :href="negocio.sitioWeb" target="_blank">{{ negocio.sitioWeb }}</a>
              </li>
              <li v-if="negocio.facebook">
                <strong>Facebook:</strong>
                <a :href="negocio.facebook" target="_blank">{{ negocio.facebook }}</a>
              </li>
              <li v-if="negocio.instagram">
                <strong>Instagram:</strong>
                <a :href="negocio.instagram" target="_blank">{{ negocio.instagram }}</a>
              </li>
            </ul>
          </div>
          <!-- -------------------------------------- -->
           
          <hr class="mt-4">
          <div class="pb-5" v-if="listaSedes.length>0">
            <h3 class="pt-2">Encuéntralo en:</h3>
            <div class="row" >
              <div v-for="sede in listaSedes" class="col-md-6 col-12 ">
                <div class="alert alert-secondary shadow-sm pb-2">
                  <div class="row ">
                    <div class="col-12 d-flex mb-2">
                        <i class="fa fa-location-arrow p-r-15 align-self-start mt-1"></i> 
                        <p class="mb-0">Ubícanos en {{ sede.direccion }} <br>
                        {{ sede.ubigeo }}</p>
                    </div>
                    <div class="col-12 d-flex gap-2 justify-content-end">
                        <button 
                          class="btn border-0 bg-orange-600 text-white btn-sm" 
                          @click="abrirGoogleMaps(sede)"
                          title="Abrir en Google Maps"
                        > 
                          <i class="fa fa-map-marker-alt"></i> Maps
                        </button>
                        <button 
                          class="btn btn-primary btn-sm" 
                          @click="abrirWaze(sede)"
                          title="Abrir en Waze"
                        > 
                          <i class="fa fa-route"></i> Waze
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div  class="rounded-4 shadow b-light border-5 overflow-hidden my-2">
                  
                  <GoogleMap
                      :api-key="GoogleApi"
                      style="width: 100%; height: 300px"
                      :center="center"
                      :zoom="15"
                      :streetViewControl="false"
                      :disable-default-ui="true"
                      gestureHandling="greedy"
                  >
                  <Marker v-for="sede in listaSedes" :key="sede.id" :options="{ position: { lat: sede.latitud, lng: sede.longitud }, draggable: false }"/>
                  </GoogleMap>
            </div>
          </div>     
        </div>
        
        <div class="col-md-4">         
          <!-- ---------------------- -->
            <div v-if="negocio.descripcion!==''"  class="p-3 pb-1 w-75 m-auto rounded-top-4 bg-yellow-700 border-0 text-center">
              <h4 class="pt-0 text-white" >¡Conóce la empresa!</h4>
            </div>
            <div v-if="negocio.descripcion!==''" class="rounded-4 bg-white shadow border-0 mb-4">
              <div class="p-2 rounded-4 bg-white">
                <div class="row">
                  <div class="col-12 pt-2 px-4">
                      <div  v-html="negocio.descripcion" class="mt-2 text-justify"></div>
                  </div>
                  <div class="col-12 pt-2">
                    <CarouselFotosNegocio :fotos="fotos" />
                  </div>
                </div>
              </div>
            </div>



        </div>
      </div>
    </div>
  </div>
</Transition>


<!-- Div oculto para la descarga automática del cupón -->
<div v-if="descargandoCupon" class="position-fixed" style="left:-9999px;top:0;z-index:-1; width:500px; max-height: 1980px;">
  <div id="content-to-capture-descarga" class="p-4">
    <div class="b-blue justify-content-center">
      <!-- <div class="px-2 bg-white text-center text-blue f-20 f-w-800 mt-2">
        {{ cuponDescarga?.negocioRazonSocial }}
      </div> -->
   <div class="d-flex flex-column align-items-center">
              <img  class="img-fluid" src="../../assets/logoimp.png" width="100px" />
                <div class="image-container position-relative mt-1">
                <img v-if="cuponDescarga?.negocioLogoUrl" class="img-fluid" :src="cuponDescarga?.negocioLogoUrl" />
                <img v-else class="img-fluid" src="../../assets/img_card_default.avif" />
            </div>
            <div class="px-2 bg-white text-center text-blue f-20 f-w-800 mt-3">
                  {{ cuponDescarga?.negocioNombre }}
                </div>
                   <div class="badge bg-red-300 py-1 mb-3 f-20 text-center">                
                    <template v-if="usuarioLogueado.idrol===1">
                      <template v-if="cuponDescarga?.ofertaTipoDescuento === 'Porcentual'">
                        {{ cuponDescarga?.ofertaValorDescuentoCliente || 'N/A' }} %
                      </template>
                      <template v-else>
                        {{ cuponDescarga?.ofertaValorDescuentoCliente || 'N/A' }}
                      </template>
                    </template>
                    <template v-if="usuarioLogueado.idrol===2">
                      <template v-if="cuponDescarga?.ofertaTipoDescuento === 'Porcentual'">
                        {{ cuponDescarga?.ofertaValorDescuentoTrabajador || 'N/A' }} %
                      </template>
                      <template v-else>
                        {{ cuponDescarga?.ofertaValorDescuentoTrabajador || 'N/A' }}
                      </template>
                    </template>
                  </div>
      </div>
          <hr class="border_lineaspunteadas">
      <div class="p-2 bg-white text-center text-blue f-16">En beneficio de:</div>
      <div class="px-2 bg-white text-center text-blue f-20 f-w-800">{{ cuponDescarga?.nombreBeneficiario }}</div>
     <div class="px-2 bg-white text-center">
                  <span class="badge bg-primary">
                    {{ usuarioLogueado.idrol === 2 ? 'Trabajador' : 'Cliente' }}
                  </span>
                </div>
      <div class="px-2 bg-white text-center text-blue f-16">En:</div>
      <div class="p-2 bg-white text-center text-blue f-20 f-w-800">{{ cuponDescarga?.ofertaNombre }}</div>
      <div class="px-2 bg-white text-center text-gray-500 f-16">(Válido hasta el {{ FormatFecha.fecha_dd_mm_yyyy(cuponDescarga?.fechaFin) }})</div>
      <div class="px-2 bg-white text-center text-success f-16">
        <i class="fa fa-check-circle"></i>  Cupón Activo
      </div>
      <div class="p-2 bg-white text-center text-red-400 f-48 f-w-800">
        <img v-if="qrCode" :src="qrCode" alt="Código QR" />
      </div>
         <div class="p-2 bg-white text-center text-blue f-13 f-w-800">
                  Código Cupón: {{ cuponDescarga.qrCode }}
                </div>
      <div class="w-100 d-flex justify-content-center pt-4 px-5">
        <div class="alert alert-success">
          <div class="row">
            <div class="col-1 align-content-center">
              <i class="fa fa-check-square h4"></i>
            </div>
            <div class="col-11">
              Tu Cupón ya está listo para ser canjeado en el cualquiera de nuestros establecimientos.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import 'nprogress/nprogress.css';
import { GoogleMap, Marker } from 'vue3-google-map';
import { useNegocios, useOfertas, useSedes, useFotos, useCupones } from '../../composables/_composables';
import { usarCarritoStore } from '../../stores/OfertaCarrito';
import { useAuthStore } from '../../stores/authStore';
import { Notif, FormatFecha, Alerta } from '../../utils/_utils';
import { Divloading, ImageLoader, CarouselFotosNegocio, ImgLazy } from '../../components/_components';
import { GoogleApi } from '../../config';
import type { Oferta } from '../../interfaces/_interface';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { URL_DOMINIO } from "../../config";

export default {
  components: {
    GoogleMap,
    Marker,
    Divloading,
    ImageLoader,
    CarouselFotosNegocio,
    ImgLazy
  },  setup() {
    const route = useRoute(); 
    const router = useRouter();
    
    // Usar composables con manejo de errores consistente
    const { negocio, Obtener_Negocio } = useNegocios();
    const { oferta, Obtener_Oferta, isloading_ofertas } = useOfertas();
    const { listaSedes, Listar_Sedes } = useSedes();
    const { guardarCupon, NuevoCupon, listaCupones, cargarListaCupones_idUsuario } = useCupones();
    const { fotos, cargarFotosNegocio } = useFotos();
    
    const carritoStore = usarCarritoStore();
    const authStore = useAuthStore();
    const usuarioLogueado = computed(() => authStore.usuarioLogueado);

    const defaultCenter = { lat: -5.192700526416363, lng: -80.62846284179687 };
    const center = ref(defaultCenter);
    const markerPosition = ref({ ...center.value });

    const descuento = computed(() => {
      if (usuarioLogueado.value?.idrol === 2) {
        return oferta.value.valordscto_trabajador;
      }
      return oferta.value.valordscto_cliente;
    });

    // Estado para cupón generado y control de renderizado oculto
    const cuponDescarga = ref<any>(null);
    const descargandoCupon = ref(false);
    const qrCode = ref("");

    const manejarPromocion = async () => {
      // Validar login
      if (!usuarioLogueado.value || (usuarioLogueado.value.idrol !== 1 && usuarioLogueado.value.idrol !== 2)) {
        Alerta.Advertencia("Advertencia", "Para reclamar esta promoción, debes estar logueado como Cliente o Trabajador.");
        return;
      }

      // Confirmación antes de continuar
      const confirmado = await Alerta.Confirmacion(
        "¿Seguro que deseas reclamar esta promoción?",
        "Solo puedes reclamar una vez esta oferta. ¿Deseas continuar?",
        "question",
        "Sí, reclamar",
        "Cancelar"
      );
      if (!confirmado) return;

      // Validar cupón existente
      const idUsuario = Number(usuarioLogueado.value.idusuario);
      await cargarListaCupones_idUsuario(idUsuario);

      // Verificar si ya tiene este cupón
      const cuponExistente = listaCupones.value.find(
        cupon => cupon.ofertaId === oferta.value.id && 
        cupon.idUsuario === usuarioLogueado.value.idusuario.toString()
      );
      
      if (cuponExistente) {
        const fechaHoy = new Date();
        const fechaInicio = new Date(cuponExistente.fecha_inicio);
        const fechaFin = new Date(cuponExistente.fecha_fin);

        if (fechaHoy < fechaInicio || fechaHoy > fechaFin) {
          Alerta.Advertencia("Advertencia", "El cupón no está vigente. No puedes volver a usarlo.");
          return;
        }
        Alerta.Advertencia("Advertencia", "Ya seleccionaste esta oferta y está vigente. No puedes volver a usarla.");
        return;
      }

      try {
        // Crear nuevo cupón
        NuevoCupon.value = {
          tipoUsuario: usuarioLogueado.value.idrol === 2 ? 'Trabajador' : 'Cliente',
          idUsuario: usuarioLogueado.value.idusuario.toString(),
          esfamiliar: 'N',
          idFamiliar: '0',
          nombreBeneficiario: usuarioLogueado.value.nombreusuario,
          ofertaId: oferta.value.id,
        };

        await guardarCupon();
        await cargarListaCupones_idUsuario(idUsuario);
        const cuponGenerado = listaCupones.value.find(
          cupon => cupon.ofertaId === oferta.value.id && 
          cupon.idUsuario === usuarioLogueado.value.idusuario.toString()
        );
        if (cuponGenerado) {
          cuponDescarga.value = cuponGenerado;
          descargandoCupon.value = true;
          await nextTick();
          await generateQRCode(cuponGenerado.id);
          await downloadImageCupon();
          descargandoCupon.value = false;
        }
        // router.push({ name: 'MisCupones' });
      } catch (error) {
        Notif.Error("No se pudo reclamar la promoción. Inténtalo nuevamente.");
      }
    };

    // Generar QR para el cupón generado
  const generateQRCode = async (cuponId: number) => {
    const textocodigo = `${URL_DOMINIO}verificacion/${cuponId}`;
    try {
      const url = await QRCode.toDataURL(textocodigo, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: "Q",
      });
      qrCode.value = url;
    } catch (err) {
      console.error("Error generando QR:", err);
    }
  };

  // Descargar imagen del cupón oculto
  const downloadImageCupon = async () => {
    const contentToCapture = document.querySelector("#content-to-capture-descarga") as HTMLElement;
    if (contentToCapture) {
      await new Promise(resolve => setTimeout(resolve, 100));
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

    const redirigirLogin = () => {
      router.push({ name: 'Loggin' });
    };

    const verificarCupon = async (idoferta: number) => {
      const cupon = listaCupones.value.find(
        c => c.ofertaId === idoferta && 
        c.idUsuario === usuarioLogueado.value.id.toString()
      );
      
      if (!cupon) {
        return true;
      } else {
        const fechaHoy = new Date();
        const fechaFin = new Date(cupon.fecha_fin);
        return !(fechaHoy > fechaFin || cupon.estado === 'Utilizado' || cupon.estado === 'Activo');
      }
    };

    // Función para detectar si es dispositivo móvil
    const esMobil = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Función para abrir Google Maps
    const abrirGoogleMaps = (sede: any) => {
      const lat = sede.latitud;
      const lng = sede.longitud;
      const direccion = encodeURIComponent(`${sede.direccion}, ${sede.ubigeo}`);
      
      let url = '';
      
      if (esMobil()) {
        // Para dispositivos móviles - abre la app de Google Maps
        url = `comgooglemaps://?q=${lat},${lng}&center=${lat},${lng}&zoom=15`;
        
        // Fallback para Android/iOS si no tiene la app instalada
        const fallbackUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15`;
        
        // Intentar abrir la app nativa
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        // Si no se abre la app en 2 segundos, usar el navegador
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.open(fallbackUrl, '_blank');
        }, 2000);
      } else {
        // Para escritorio - abrir en nueva pestaña
        url = `https://maps.google.com/maps?q=${lat},${lng}&z=15`;
        window.open(url, '_blank');
      }
    };

    // Función para abrir Waze
    const abrirWaze = (sede: any) => {
      const lat = sede.latitud;
      const lng = sede.longitud;
      
      if (esMobil()) {
        // Para dispositivos móviles - abre la app de Waze
        const wazeUrl = `waze://?ll=${lat},${lng}&navigate=yes`;
        const fallbackUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        
        // Intentar abrir la app nativa
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = wazeUrl;
        document.body.appendChild(iframe);
        
        // Si no se abre la app en 2 segundos, usar el navegador
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.open(fallbackUrl, '_blank');
        }, 2000);
      } else {
        // Para escritorio - abrir Waze web
        const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        window.open(url, '_blank');
      }
    };
    
    onMounted(async () => {
      const idOferta = Number(route.params.id);
      
      // Cargar datos necesarios
      await Obtener_Oferta(idOferta);
      
      // Establecer centro del mapa si hay sedes
      if (listaSedes.value.length > 0) {
        center.value = {
          lat: listaSedes.value[0].latitud,
          lng: listaSedes.value[0].longitud
        };
      }
      
      await Promise.all([
        Obtener_Negocio(oferta.value.negocioId),
        Listar_Sedes(oferta.value.negocioId),
        cargarFotosNegocio(oferta.value.negocioId)
      ]);
    });    return {
      center,
      negocio,
      isloading_ofertas,
      oferta,
      descuento,
      manejarPromocion,
      redirigirLogin,
      FormatFecha, 
      listaSedes,
      GoogleApi,
      fotos,
      listaCupones,
      usuarioLogueado,
      cuponDescarga,
      descargandoCupon,
      qrCode,
      abrirGoogleMaps,
      abrirWaze
    };
  },
};
  
</script>

<style scoped>
.border_lineaspunteadas {
  border-style: dotted;
  border-top: 2px sienna dashed;
  width: 50%;
  margin: auto;
  margin-top: 10px;
}
</style>