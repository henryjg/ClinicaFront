<template>
  <div class="row "  style="min-height: calc(100vh - 124px)"  >
    <div class="col-md-4 justify-content-center pt-5">
      <!-- {{ ClienteValidado }} - {{ IdClienteRegistrado }} -->
      <div class="p-5">
        <div class="text-center">
            <h3 v-if="secuencia === 1" class="f-w-500 mb-2 text-blue ">Validación de Identidad</h3>
            <h3 v-if="secuencia === 2" class="f-w-500 mb-2 text-blue-900 ">Actualización de Datos</h3>
            <h3 v-if="secuencia === 3" class="f-w-500 mb-2 text-blue-900 ">Activación de cuenta</h3>
            <h3 v-if="secuencia === 4" :class="secuencia===4 ? 'text-success' : 'text-info'" class="f-w-500 mb-1">Registro Completado</h3>

            <div id="bar" class="progress mb-3 bg-light" style="height: 7px;">
              <div :class="secuencia===3 ? 'bg-success' : 'bg-info'"
                  class="bar progress-bar progress-bar-striped progress-bar-animated" :style="{ width: secuencia / 4*100 + '%' }"></div>
            </div>
        </div>
        
        <!-- -------------------------------------- -->
        <!-- VALIDACIÓN DNI ----- ----- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 1">
            <div class="col-md-12">
              <p class="f-14 f-w-500 mt-1 mb-2 ">Ingresa tu DNI.</p>
              <!-- -------------------------------------------- -->       
            </div>  
            <div class="mb-2">
              <input 
                type="text" 
                v-model="nrodocumento_a_validar" 
                minlength="8" 
                maxlength="11" 
                :class="['form-control', { 'is-invalid': errors.nrodocumento }]"
                @blur="validarDNI"
                @input="errors.nrodocumento = ''; nrodocumento_a_validar = nrodocumento_a_validar.replace(/\D/g, '')"
                placeholder="Ingrese su DNI (8-11 dígitos)">
              <div v-if="errors.nrodocumento" class="invalid-feedback">
                {{ errors.nrodocumento }}
              </div>
            </div>
            
            <div class="col-lg-12 text-center">
                  <button @click="validarClienteConValidacion" class="btn btn-info btn-lg mt-3 "> 
                      <i class="fas fa-unlock p-r-5"></i> Validar Cliente</button>
            </div>
        </div>

        <!-- -------------------------------------- -->
        <!-- VALIDACIÓN DE DATIS ----- ----- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 2">
            <div class="col-md-12">
              
              <!-- -------------------------------------------- -->       
            </div>  
            <div class="mb-2">
              <p class="f-14 f-w-500 mt-1 mb-2 ">Nombre Completo:</p>
              <input 
                type="text" 
                v-model="ClienteValidado.nombreCompleto" 
                :class="['form-control', { 'is-invalid': errors.nombreCompleto }]"
                @blur="validarNombre"
                @input="errors.nombreCompleto = ''"
                placeholder="Ingrese su nombre completo">
              <div v-if="errors.nombreCompleto" class="invalid-feedback">
                {{ errors.nombreCompleto }}
              </div>
            </div>
            <div class="mb-2">
              <p class="f-14 f-w-500 mt-1 mb-2">Celular:</p>
              <input 
                type="text" 
                v-model="ClienteValidado.telefono" 
                maxlength="12" 
                minlength="9" 
                :class="['form-control', { 'is-invalid': errors.telefono }]"
                @blur="validarTelefono"
                @input="errors.telefono = ''; ClienteValidado.telefono = ClienteValidado.telefono.replace(/\D/g, '')"
                placeholder="Ingrese su número de celular">
              <div v-if="errors.telefono" class="invalid-feedback">
                {{ errors.telefono }}
              </div>
            </div>
            <div class="mb-4">
              <p class="f-14 f-w-500 mt-1 mb-2 ">Correo:</p>
              <input 
                type="email" 
                v-model="ClienteValidado.correo" 
                :class="['form-control', { 'is-invalid': errors.correo }]"
                @blur="validarCorreo"
                @input="errors.correo = ''"
                placeholder="ejemplo@correo.com">
              <div v-if="errors.correo" class="invalid-feedback">
                {{ errors.correo }}
              </div>
            </div>

            <div class="alert alert-danger" v-if="ClienteValidado.estadoOC!=='ACTIVO'">
              <p class="f-14 f-w-500 mt-1 mb-2">
                <i class="fas fa-exclamation-triangle"></i> CLIENTE INACTIVO.</p>
            </div>
            <div class="alert alert-success" v-if="ClienteValidado.estadoOC==='ACTIVO'">
              <p class="f-14 f-w-500 mt-1 mb-2">
                <i class="fas fa-check"></i> CLIENTE ACTIVO.</p>
            </div>


            <div class="col-lg-12 text-center">
                  <button :disabled="ClienteValidado.estadoOC!=='ACTIVO'" @click="registrarClienteConValidacion" class="btn btn-success btn-lg mt-3 "> 
                      <i class="fas fa-check p-r-5"></i> Confirmar</button>
            </div>
        </div>

        <!-- -------------------------------------- -->
        <!-- VERIFICAR DATOS CORREO --- ----------- -->
        <!-- -------------------------------------- -->

        <div class="row mb-1" v-if="secuencia === 3">
          <!-- <div class="row mb-1"> -->
          <div class="col-lg-12 f-16 text-inter">
              <p>Verifica nuestro mensaje enviado a tu correo electrónico 
                  (<span class="fw-bold"> {{ClienteValidado.correo}} </span>), 
                  e ingresa el código de 4 caracteres.</p>

              <div class="d-flex w-100 m-auto py-3">
                  <input 
                    ref="input1"
                    type="text" 
                    v-model="codigo_generado.num1" 
                    maxlength="1" 
                    class="form-control form-control-lg mx-1 text-center f-22"
                    @input="handleInput($event, 'num1', 'input2')"
                    @keydown="handleKeydown($event, 'num1')"
                    @paste="handlePaste($event)">
                  <div class="align-content-center mx-1" >-</div>
                  <input 
                    ref="input2"
                    type="text" 
                    v-model="codigo_generado.num2" 
                    maxlength="1" 
                    class="form-control form-control-lg mx-1 text-center f-22"
                    @input="handleInput($event, 'num2', 'input3')"
                    @keydown="handleKeydown($event, 'num2')">
                  <div class="align-content-center mx-1">-</div>
                  <input 
                    ref="input3"
                    type="text" 
                    v-model="codigo_generado.num3" 
                    maxlength="1" 
                    class="form-control form-control-lg mx-1 text-center f-22"
                    @input="handleInput($event, 'num3', 'input4')"
                    @keydown="handleKeydown($event, 'num3')">
                  <div class="align-content-center mx-1">-</div>
                  <input 
                    ref="input4"
                    type="text" 
                    v-model="codigo_generado.num4" 
                    maxlength="1" 
                    class="form-control form-control-lg mx-1 text-center f-22"
                    @input="handleInput($event, 'num4', null)"
                    @keydown="handleKeydown($event, 'num4')">
              </div>
              <!-- -------------------------------------------- -->
          </div>
          <div class="col-lg-12 text-center">
                <button class="btn btn-blue btn-lg mt-3" @click="ActivarUsuarioCodigo" >
                    <i class="fas fa-unlock p-r-5"></i>Activar Usuario
                </button>
          </div>
        </div>

        <!-- -------------------------------------- -->
        <!-- REGISTRO COMPLETADO -- --- ----------- -->
        <!-- -------------------------------------- -->
        <div class="row mb-1" v-if="secuencia === 4">
          <div class="col-lg-12 f-16 text-inter">
              <p>Gracias por activar tu cuenta, Ahora ya puedes activar tus beneficios.</p>
              <!-- -------------------------------------------- -->
          </div>
          <div class="col-lg-12 text-center">
              <RouterLink to="/beneficios/loggin" class=" text-hover-light">
                <button class="btn btn-secondary btn-lg mt-3" @click="Finalizar">
                  <i class="fas fa-unlock p-r-5"></i>Iniciar Sesión</button>
              </RouterLink>
          </div>
        </div>

        <div class="pt-5">
              <Transition>
                  <Divloading v-if="isloading"/>
              </Transition>
              <Transition>
                  <div v-if="iserror" class="alert alert-danger">
                      <i class="fa fa-exclamation-triangle"></i> {{ msj_loggin }}
                  </div>
              </Transition>
        </div>

      </div>
      
    </div>
    
    <!-- ------------------------ -->
    <div class="col-md-8 d-none d-sm-block">
      <div class="overflow-hidden d-flex align-items-center justify-content-center custom-div">
        <img src="/src/assets/images/banner/p2.avif" class="img-centered">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue';
import { RouterLink } from 'vue-router';

// Centralized imports
import { carousel_fotos, Divloading } from '../../components/_components';
import { usarAutenticacion, useCliente } from '../../composables/_composables';
import { Alerta } from '../../utils/_utils';

const isDarkTheme = ref(false);



interface codigo{
  num1:String;
  num2:String;
  num3:String;
  num4:String;
}

export default {
  components: {
    carousel_fotos,
    Divloading
  },
  setup () {
    const { guardarCliente_validado,validar_Cliente,  secuencia, Actualizar_Verificar_Correo,Registrar_Cliente,
           nrodocumento_a_validar, msj_loggin, iserror, isloading, ClienteValidado, IdClienteRegistrado } = usarAutenticacion();
    const { nuevoCliente } = useCliente();
      const dni = ref("");
      const pass = ref("");
      const passrepet = ref("");
      
      // Referencias para los inputs
      const input1 = ref<HTMLInputElement>();
      const input2 = ref<HTMLInputElement>();
      const input3 = ref<HTMLInputElement>();
      const input4 = ref<HTMLInputElement>();
      
      // Variables de validación
      const errors = ref({
        nrodocumento: '',
        nombreCompleto: '',
        telefono: '',
        correo: ''
      });
      
      const codigo_generado = ({
        num1:'',
        num2:'',
        num3:'',
        num4:'',
      });
      
      onMounted(() => {
        isDarkTheme.value = checkIfDarkTheme();
        secuencia.value=1;
        console.log(isDarkTheme.value);
        
        // Enfocar el primer input cuando se muestre la sección del código
        setTimeout(() => {
          if (input1.value) {
            input1.value.focus();
          }
        }, 100);
      });

      const checkIfDarkTheme = () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      };  
      
      const ActivarUsuarioCodigo=async ()=>{
        const codigoMail = `${codigo_generado.num1}${codigo_generado.num2}${codigo_generado.num3}${codigo_generado.num4}`;
        // const serverCode: string = ClienteValidado.value.codigo.substring(4, 8);
        if(codigoMail.length === 4){
          
          console.table(nuevoCliente.value);
          const response = await Actualizar_Verificar_Correo(IdClienteRegistrado.value, codigoMail);
          console.table(response)
          if(response){
              secuencia.value=4;
          }else{
              Alerta.Error("Error","Error al Guardar al Cliente.")
          };
               
        }else{
          Alerta.Error("Error","El código debe contener 4 caracteres alfanuméricos.");
          iserror.value = false;
          msj_loggin.value = "El Código "+ codigoMail+" Incorrecto";
        }        
      }
    
      const Finalizar=()=>{
        secuencia.value=1;
      }

      // Funciones de validación
      const validarDNI = () => {
        const dni = nrodocumento_a_validar.value;
        if (!dni || !/^\d{8,11}$/.test(dni)) {
          errors.value.nrodocumento = 'El DNI debe contener solo números (8-11 dígitos)';
          return false;
        }
        errors.value.nrodocumento = '';
        return true;
      };

      const validarNombre = () => {
        if (!ClienteValidado.value.nombreCompleto || ClienteValidado.value.nombreCompleto.trim().length < 2) {
          errors.value.nombreCompleto = 'El nombre completo es requerido (mínimo 2 caracteres)';
          return false;
        }
        errors.value.nombreCompleto = '';
        return true;
      };

      const validarTelefono = () => {
        const telefono = ClienteValidado.value.telefono;
        if (!telefono || !/^\d{9,12}$/.test(telefono)) {
          errors.value.telefono = 'El celular debe contener solo números (9-12 dígitos)';
          return false;
        }
        errors.value.telefono = '';
        return true;
      };

      const validarCorreo = () => {
        const correo = ClienteValidado.value.correo;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !emailRegex.test(correo)) {
          errors.value.correo = 'Ingrese un correo electrónico válido';
          return false;
        }
        errors.value.correo = '';
        return true;
      };

      const validarFormulario = () => {
        const nombreValido = validarNombre();
        const telefonoValido = validarTelefono();
        const correoValido = validarCorreo();
        return nombreValido && telefonoValido && correoValido;
      };

      // Función mejorada para registro de cliente con validación
      const registrarClienteConValidacion = async () => {
        if (!validarFormulario()) {
          return;
        }
        await Registrar_Cliente();
      };

      // Función para validar cliente con validación de DNI
      const validarClienteConValidacion = async () => {
        if (!validarDNI()) {
          return;
        }
        await validar_Cliente();
      };

      // Funciones para manejo de navegación automática entre inputs
      const handleInput = (event: Event, currentField: keyof typeof codigo_generado, nextInputRef: string | null) => {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        
        // Permitir números y letras (alfanumérico)
        if (value && !/^[a-zA-Z0-9]$/.test(value)) {
          target.value = '';
          return;
        }
        
        // Convertir a mayúscula para consistencia
        const upperValue = value.toUpperCase();
        target.value = upperValue;
        
        // Actualizar el modelo
        codigo_generado[currentField] = upperValue;
        
        // Si se ingresó un valor y hay un siguiente input, mover el foco
        if (upperValue && nextInputRef) {
          const inputRefs: Record<string, any> = { input1, input2, input3, input4 };
          const nextInput = inputRefs[nextInputRef]?.value;
          if (nextInput) {
            nextInput.focus();
          }
        }
      };

      const handleKeydown = (event: KeyboardEvent, currentField: keyof typeof codigo_generado) => {
        const target = event.target as HTMLInputElement;
        
        // Permitir teclas de navegación y control
        if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          // Si es Backspace y el campo está vacío, ir al anterior
          if (event.key === 'Backspace' && !target.value) {
            const inputRefs = { input1, input2, input3, input4 };
            const fieldNumber = currentField.slice(-1);
            const currentIndex = parseInt(fieldNumber) - 1;
            
            if (currentIndex > 0) {
              const prevInputKey = `input${currentIndex}` as keyof typeof inputRefs;
              const prevInput = inputRefs[prevInputKey]?.value;
              if (prevInput) {
                prevInput.focus();
              }
            }
          }
          return;
        }
        
        // Permitir números y letras (alfanumérico)
        if (!/^[a-zA-Z0-9]$/.test(event.key)) {
          event.preventDefault();
        }
      };

      const handlePaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const pastedData = event.clipboardData?.getData('text') || '';
        
        // Solo procesar si son exactamente 4 caracteres alfanuméricos
        if (/^[a-zA-Z0-9]{4}$/.test(pastedData)) {
          codigo_generado.num1 = pastedData[0].toUpperCase();
          codigo_generado.num2 = pastedData[1].toUpperCase();
          codigo_generado.num3 = pastedData[2].toUpperCase();
          codigo_generado.num4 = pastedData[3].toUpperCase();
          
          // Enfocar el último input
          if (input4.value) {
            input4.value.focus();
          }
        }
      };

      

      return { secuencia, codigo_generado,dni,pass,passrepet,
               validar_Cliente, Registrar_Cliente,
               ActivarUsuarioCodigo,Finalizar,
               nrodocumento_a_validar, msj_loggin, iserror, isloading,ClienteValidado,
               nuevoCliente, IdClienteRegistrado,
               // Variables y funciones de validación
               errors, validarDNI, validarNombre, validarTelefono, validarCorreo, validarFormulario, 
               registrarClienteConValidacion, validarClienteConValidacion,
               // Referencias de inputs
               input1, input2, input3, input4,
               // Funciones de manejo
               handleInput, handleKeydown, handlePaste
      };
},
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