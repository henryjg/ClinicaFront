<template>
  <div class="modulo-operaciones text-inter">
      

      <div class="container">
        <!-- ------------------ -->
        <div class="row">
          <dil class="col-12 pt-3">
              <div class="card rounded-0">
                <div class="card-body">
                   <h3 class="titulo text-gray-700">Bienvenido(a), {{ }}</h3>
                   <p class="alert alert-info">Accede de manera sencilla a los siguientes servicios:</p>
                </div>
              </div>              
          </dil>
        </div>
        <!-- ------------------ -->

        <!-- ------------------ -->
        <div class="row">
          <dil class="col-12 text-center ">
              <h2 class="titulo text-blue-800">Servicios</h2>
          </dil>
        </div>
        <!-- ------------------ -->
        
        <div class="row">
          <div class="col-4 " v-for="servicio in servicios" :key="servicio.id" >
            <router-link  :to="servicio.ruta">
              <div class="card rounded-0" >
                <div class="card-body " :class="servicio.color">
                  <div class="row">
                    <div class="col-4">
                      <img :src="servicio.icono" alt="Icono del servicio" class="w-100" />
                    </div>
                    <div class="col-8">
                      <h4 class="titulo-servicio">{{ servicio.titulo }}</h4>
                      <div class="btn btn-primary">INGRESAR</div>
                        
                     
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- ------------------ -->
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Servicio {
  id: number;
  titulo: string;
  ruta: string;
  color: string;
  icono: string;
  nuevo?: boolean;
  enConstruccion?: boolean; // Nueva propiedad para indicar si está en construcción
}

const servicios = ref<Servicio[]>([
  {
    id: 1,
    titulo: 'SOLICITUD DE LICENCIAS',
    ruta: '/extranet/formulariolicencias',
    color: 'bg-azul',
    icono: '/assets/images/operaciones/engineer.png',
    nuevo: true
  },
  {
    id: 2,
    titulo: 'MESA DE PARTES',
    ruta: '/extranet/solicitudes',
    color: 'bg-gris',
    icono: '/assets/images/operaciones/contract.png',
    enConstruccion: true // Marcamos este servicio como "En construcción"
  },
])
</script>



<style scoped>

</style>