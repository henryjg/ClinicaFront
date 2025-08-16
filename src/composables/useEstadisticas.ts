import { ref, computed } from 'vue';
import { EstadisticasService } from '../services/_services';
import { Alerta } from '../utils/_utils';
import { Estadisticas, initializeEstadisticas } from '../interfaces/_interface';
import { useOperacion } from './Tools/useOperacion';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function useEstadisticas() {
  // Estados reactivos
  const estadisticas = ref<Estadisticas>(initializeEstadisticas());
  const estadisticasPeriodo = ref<any>(null);
  const analisisComportamiento = ref<any>(null);
  const dashboardResumen = ref<any>(null);
  const dashboardResumenSimple = ref<any>(null);
  const dashboardGraficos = ref<any>(null);
  const comparacion = ref<any>(null);
  const metricasRapidas = ref<any>(null);
  const cuponesExportados = ref<any>(null);
  const cuponesExportadosCSV = ref<any>(null);
  const isLoading = ref(false);

  const { ejecutar } = useOperacion();

  // Métodos para cada endpoint
  const obtenerGenerales = async (tipoUsuario: string) => {
    return ejecutar(
      () => EstadisticasService.generales(tipoUsuario),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          estadisticas.value = response;
        }
      }
    );
  };

  const obtenerPorPeriodo = async (tipoPeriodo: string) => {
    return ejecutar(
      () => EstadisticasService.porPeriodo(tipoPeriodo),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          estadisticasPeriodo.value = response;
        }
      }
    );
  };

  const obtenerAnalisisComportamiento = async () => {
    return ejecutar(
      () => EstadisticasService.analisisComportamiento(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          analisisComportamiento.value = response;
        }
      }
    );
  };

  const obtenerDashboardResumen = async () => {
    return ejecutar(
      () => EstadisticasService.dashboardResumen(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          dashboardResumen.value = response;
        }
      }
    );
  };

  const obtenerDashboardResumenSimple = async () => {
    return ejecutar(
      () => EstadisticasService.dashboardResumenSimple(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          dashboardResumenSimple.value = response;
        }
      }
    );
  };

  const obtenerDashboardGraficos = async (tipoGrafico: string) => {
    return ejecutar(
      () => EstadisticasService.dashboardGraficos(tipoGrafico),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          dashboardGraficos.value = response;
        }
      }
    );
  };

  const obtenerComparacion = async () => {
    return ejecutar(
      () => EstadisticasService.comparar(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          comparacion.value = response;
        }
      }
    );
  };

  const obtenerMetricasRapidas = async () => {
    return ejecutar(
      () => EstadisticasService.metricasRapidas(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          metricasRapidas.value = response;
        }
      }
    );
  };

  const ExportarCupones = async () => {
    try {
      const response = await EstadisticasService.exportarCupones();
      if (response.success) {
        const worksheet = XLSX.utils.json_to_sheet(response.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cupones');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'CuponesExportados.xlsx');
        Alerta.Sucessfull('Excel exportado con éxito', 'El archivo se generó correctamente.');
      } else {
        throw new Error('Error al exportar cupones: ' + response.message);
      }
    } catch (error: any) {
      Alerta.Error('Error al exportar cupones: ' + error.message, 'Por favor, intente nuevamente.');
    }
  };

  const exportarCuponesCSV = async () => {
    return ejecutar(
      () => EstadisticasService.exportarCuponesCSV(),
      {
        indicadorCarga: isLoading,
        onExito: (response: any) => {
          cuponesExportadosCSV.value = response;
        }
      }
    );
  };

  return {
    // Estados
    estadisticas,
    estadisticasPeriodo,
    analisisComportamiento,
    dashboardResumen,
    dashboardResumenSimple,
    dashboardGraficos,
    comparacion,
    metricasRapidas,
    cuponesExportados,
    cuponesExportadosCSV,
    isLoading,

    // Métodos
    obtenerGenerales,
    obtenerPorPeriodo,
    obtenerAnalisisComportamiento,
    obtenerDashboardResumen,
    obtenerDashboardResumenSimple,
    obtenerDashboardGraficos,
    obtenerComparacion,
    obtenerMetricasRapidas,
    ExportarCupones,
    exportarCuponesCSV
  };
}