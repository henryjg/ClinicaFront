import { ref, onMounted } from 'vue';
import { useEstadisticas } from './useEstadisticas';

export function useGraficas(tipoUsuario: string) {
  const series = ref<number[]>([]);
  const labels = ref<string[]>(['Usados', 'Activos']);

  const { obtenerGenerales } = useEstadisticas();

  onMounted(async () => {
    const estadisticas = await obtenerGenerales(tipoUsuario);
    const generales = estadisticas?.data?.generales || {};

    series.value = [
      generales.cuponesUtilizados || 0,
      generales.cuponesActivos || 0
    ];

    console.log(`Series para ${tipoUsuario}:`, series.value);
  });

  return {
    series,
    labels
  };
}
