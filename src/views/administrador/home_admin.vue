<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <!-- Cards a la izquierda -->
      <div class="col-lg-3 col-md-4 mb-3">
        <div v-for="card in cards" :key="card.title" class="card shadow-sm mb-3">
          <div class="card-body d-flex align-items-center">
            <div class="me-3">
              <i :class="card.icon" style="font-size:2rem;color:#556ee6;"></i>
            </div>
            <div>
              <h6 class="mb-1">{{ card.title }}</h6>
              <h3 class="mb-0">{{ card.value }}</h3>
            </div>
          </div>
        </div>
      </div>
      <!-- Gráficas donut a la derecha -->
      <div class="col-lg-9 col-md-8 mb-3">
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-header bg-white border-bottom-0">
                <h6 class="mb-0">Cupones Cliente</h6>
              </div>
              <div class="card-body">
                <apexchart ref="apexChartCliente" type="donut" height="300" :options="donutOptionsCliente" :series="donutSeriesCliente" />
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <div class="card h-100">
              <div class="card-header bg-white border-bottom-0">
                <h6 class="mb-0">Cupones Trabajador</h6>
              </div>
              <div class="card-body">
                <apexchart ref="apexChartTrabajador" type="donut" height="300" :options="donutOptionsTrabajador" :series="donutSeriesTrabajador" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables Row -->
    <div class="row mb-4">
      <div class="col-lg-6 mb-3">
        <div class="card h-100">
          <div class="card-header bg-white border-bottom-0">
            <h6 class="mb-0">Clientes que más cupones usan</h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cupones Usados</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cliente in topClientes" :key="cliente.nombre">
                  <td>{{ cliente.nombre }}</td>
                  <td>{{ cliente.cupones }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-3">
        <div class="card h-100">
          <div class="card-header bg-white border-bottom-0">
            <h6 class="mb-0">Trabajadores con más cupones gestionados</h6>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Trabajador</th>
                  <th>Cupones Gestionados</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trabajador in topTrabajadores" :key="trabajador.nombre">
                  <td>{{ trabajador.nombre }}</td>
                  <td>{{ trabajador.cupones }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfica de barras debajo de las tablas -->
    <div class="row">
      <div class="col-12 mb-3">
        <div class="card h-100">
          <div class="card-header bg-white border-bottom-0">
            <h6 class="mb-0">Estadísticas de Cupones</h6>
          </div>
          <div class="card-body">
            <apexchart type="bar" height="300" :options="chartOptions" :series="chartSeries" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// import { useCliente } from '../../composables/useCliente';
import { useTrabajador } from '../../composables/useTrabajador';
// import { useCupones } from '../../composables/useCupones';
import { useEstadisticas } from '../../composables/useEstadisticas';
import { useGraficas } from '../../composables/useGraficas';

const apexchart = VueApexCharts;

// Datos de ejemplo para tablas (puedes reemplazar por datos reales si tienes endpoint)
const topClientes = ref([
  { nombre: 'Juan Pérez', cupones: 15 },
  { nombre: 'Ana Torres', cupones: 12 },
  { nombre: 'Luis Gómez', cupones: 10 },
  { nombre: 'María Ruiz', cupones: 8 }
]);
const topTrabajadores = ref([
  { nombre: 'Carlos Soto', cupones: 30 },
  { nombre: 'Lucía Díaz', cupones: 25 },
  { nombre: 'Pedro Ramírez', cupones: 20 },
  { nombre: 'Sofía Herrera', cupones: 18 }
]);

// Cards de resumen (se llenan con data real)
const cards = ref([
  { title: 'Total Cupones', value: 0, icon: 'ti ti-ticket' },
  { title: 'Cupones Pendientes', value: 0, icon: 'ti ti-clock' },
  { title: 'Cupones Usados', value: 0, icon: 'ti ti-check' },
  { title: 'Total Clientes', value: 0, icon: 'ti ti-users' },
  { title: 'Total Trabajadores', value: 0, icon: 'ti ti-user' }
]);

// Composable de cupones
// const {
//   listaCupones,
//   cargarListaCupones,
//   cargarListaCuponesPendientes,
//   cargarListaCuponesUtilizados
// } = useCupones();

// Filtrar pendientes y usados desde listaCupones
const cuponesPendientes = ref([]);
const cuponesUsados = ref([]);

const cuponesPendientesCount = computed(() =>
  listaCupones.value.filter(c => c.estado === 'Pendiente' || c.estado === 'pendiente').length
);
const cuponesUsadosCount = computed(() =>
  listaCupones.value.filter(c => c.estado === 'Usado' || c.estado === 'usado').length
);

// Gráficas donut para cliente y trabajador
const { series: donutSeriesCliente, labels: donutLabelsCliente } = useGraficas('Cliente');
const { series: donutSeriesTrabajador, labels: donutLabelsTrabajador } = useGraficas('Trabajador');

const donutOptionsCliente = ref({
  labels: donutLabelsCliente,
  legend: { position: 'bottom' },
  colors: ['#f46a6a', '#34c38f'],
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      const seriesIndex = opts.seriesIndex;
      return opts.w.config.series[seriesIndex];
    }
  }
});

const donutOptionsTrabajador = ref({
  labels: donutLabelsTrabajador,
  legend: { position: 'bottom' },
  colors: ['#f46a6a', '#34c38f'],
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      const seriesIndex = opts.seriesIndex;
      return opts.w.config.series[seriesIndex];
    }
  }
});

// Gráfica de barras (puedes ajustar los datos reales luego)
const chartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, horizontal: false } },
  dataLabels: { enabled: false },
  xaxis: { categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'] },
  colors: ['#556ee6'],
});
const chartSeries = ref([
  { name: 'Cupones Usados', data: [10, 20, 15, 30, 25, 40] },
  { name: 'Cupones Pendientes', data: [5, 10, 8, 12, 9, 15] }
]);

// Para obtener totales de clientes y trabajadores
// const { listaClientes, Listar_Clientes } = useCliente();
const { ListaTrabajadores, Listar_Trabajadores } = useTrabajador();
const { obtenerGenerales, estadisticas } = useEstadisticas();
const { obtenerGeneralesPorPeriodo } = useEstadisticas();

// Referencias para ApexCharts
const apexChartCliente = ref(null);
const apexChartTrabajador = ref(null);

// Datos generales de cliente y trabajador
const clienteGenerales = ref({});
const trabajadorGenerales = ref({});

// Estadísticas por mes
const estadisticasPorMes = ref([]);

// Cargar datos reales
onMounted(async () => {
  await cargarListaCuponesPendientes();
  cuponesPendientes.value = listaCupones.value.filter(c => c.estado === 'Activo');

  await cargarListaCuponesUtilizados();
  cuponesUsados.value = listaCupones.value.filter(c => c.estado === 'Utilizado');

  await Listar_Clientes();
  await Listar_Trabajadores();

  const estadCliente = await obtenerGenerales('Cliente');
  clienteGenerales.value = estadCliente?.data?.generales || {};

  const estadTrabajador = await obtenerGenerales('Trabajador');
  trabajadorGenerales.value = estadTrabajador?.data?.generales || {};

  // Actualizar los valores de los cards
  cards.value[0].value = listaCupones.value.length || 0;
  cards.value[1].value = cuponesPendientes.value.length || 0;
  cards.value[2].value = cuponesUsados.value.length || 0;
  cards.value[3].value = listaClientes.value.length || 0;
  cards.value[4].value = ListaTrabajadores.value.length || 0;

  // Actualizar las series de las gráficas
  donutSeriesCliente.value = [
    clienteGenerales.value.cuponesUtilizados || 0,
    clienteGenerales.value.cuponesActivos || 0
  ];


  donutSeriesTrabajador.value = [
    trabajadorGenerales.value.cuponesUtilizados || 0,
    trabajadorGenerales.value.cuponesActivos || 0
  ];

  const estadPorMes = await obtenerGeneralesPorPeriodo('porMes');
  estadisticasPorMes.value = estadPorMes?.data?.porMes || [];

  chartSeries.value = [
    {
      name: 'Cupones Usados',
      data: estadisticasPorMes.value.map(mes => mes.cuponesUtilizados || 0)
    },
    {
      name: 'Cupones Pendientes',
      data: estadisticasPorMes.value.map(mes => mes.cuponesPendientes || 0)
    }
  ];

  await nextTick();
  apexChartCliente.value?.updateSeries(donutSeriesCliente.value);
  apexChartTrabajador.value?.updateSeries(donutSeriesTrabajador.value);
});
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.card-header {
  border-bottom: 1px solid #f0f0f0;
}
.table th, .table td {
  vertical-align: middle;
}
</style>

