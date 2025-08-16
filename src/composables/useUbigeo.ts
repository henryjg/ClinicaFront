import { ref, computed } from "vue";
import dataUbigeoPeru from "../datos/UbigeoPeru.json";
import { UbigeoService } from "../services/_services";
import Choices from 'choices.js';

export function useUbigeo() {
  // Estados reactivos
  const departamentoSeleccionado = ref<string | null>(null);
  const provinciaSeleccionada = ref<string | null>(null);
  const distritoSeleccionado = ref<string | null>(null);
  const ubigeoSelect = ref<HTMLSelectElement | null>(null);
  const ubigeos = ref<any[]>([]);
  const loading = ref(false);
  
  // Instancia de Choices.js
  let choicesInstance: Choices | null = null;  // Computadas para listas en cascada
  const departamentos = computed(() => {
    return [...new Set(dataUbigeoPeru.map((item) => item.ubi_departamento))];
  });

  const provincias = computed(() => {
    if (!departamentoSeleccionado.value) return [];
    return [
      ...new Set(
        dataUbigeoPeru
          .filter((item) => item.ubi_departamento === departamentoSeleccionado.value)
          .map((item) => item.ubi_provincia)
      ),
    ];
  });

  const distritos = computed(() => {
    if (!departamentoSeleccionado.value || !provinciaSeleccionada.value) return [];
    return dataUbigeoPeru
      .filter(
        (item) =>
          item.ubi_departamento === departamentoSeleccionado.value &&
          item.ubi_provincia === provinciaSeleccionada.value
      )
      .map((item) => item.ubi_distrito);
  });

  // Funciones de utilidad
  const resetSelecciones = () => {
    departamentoSeleccionado.value = null;
    provinciaSeleccionada.value = null;
    distritoSeleccionado.value = null;
  };

  const resetProvinciasYDistritos = () => {
    provinciaSeleccionada.value = null;
    distritoSeleccionado.value = null;
  };

  const resetDistritos = () => {
    distritoSeleccionado.value = null;
  };

  // Obtener ubicación completa seleccionada
  const ubicacionCompleta = computed(() => {
    if (!departamentoSeleccionado.value || !provinciaSeleccionada.value || !distritoSeleccionado.value) {
      return null;
    }
    
    return dataUbigeoPeru.find(
      (item) =>
        item.ubi_departamento === departamentoSeleccionado.value &&
        item.ubi_provincia === provinciaSeleccionada.value &&
        item.ubi_distrito === distritoSeleccionado.value
    );
  });

  // Función para listar ubigeos remotos
  const listarUbigeos = async () => {
    try {
      loading.value = true;
      const response = await UbigeoService.listar();
      ubigeos.value = response.data || [];
      return response;
    } catch (error) {
      console.error('Error al obtener ubigeos:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Utilidades
  const utilidades = {
    resetSelecciones,
    resetProvinciasYDistritos,
    resetDistritos
  };

  return {
    // Estados reactivos
    departamentoSeleccionado,
    provinciaSeleccionada,
    distritoSeleccionado,
    ubigeoSelect,
    ubigeos,
    loading,
    
    // Computadas
    departamentos,
    provincias,
    distritos,
    ubicacionCompleta,
    
    // Funciones
    listarUbigeos,
    
    // Utilidades
    ...utilidades,
    
    // Instancia de Choices.js
    choicesInstance
  };
}
