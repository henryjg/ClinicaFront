import { ref, computed } from 'vue';

/**
 * Composable para manejar estados individuales de items en listas
 * Permite controlar loading, errores y estados por item específico
 */
export function useItemState<T = any>() {
  // Estados reactivos
  const loadingStates = ref<{ [key: string | number]: boolean }>({});
  const errorStates = ref<{ [key: string | number]: string | null }>({});
  const items = ref<T[]>([]);

  /**
   * Establece el estado de carga para un item específico
   */
  const setLoading = (itemId: string | number, loading: boolean) => {
    loadingStates.value[itemId] = loading;
    // Limpiar error al iniciar carga
    if (loading) {
      errorStates.value[itemId] = null;
    }
  };

  /**
   * Establece un error para un item específico
   */
  const setError = (itemId: string | number, error: string | null) => {
    errorStates.value[itemId] = error;
  };

  /**
   * Verifica si un item está en estado de carga
   */
  const isLoading = (itemId: string | number): boolean => {
    return !!loadingStates.value[itemId];
  };

  /**
   * Obtiene el error de un item específico
   */
  const getError = (itemId: string | number): string | null => {
    return errorStates.value[itemId] || null;
  };

  /**
   * Actualiza un item específico en la lista reactiva
   */
  const updateItem = (itemId: string | number, updates: Partial<T>, idField: keyof T = 'id' as keyof T) => {
    const index = items.value.findIndex(item => (item as any)[idField] === itemId);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates };
    }
  };

  /**
   * Operación segura que maneja loading y errores automáticamente
   */
  const safeOperation = async <R>(
    itemId: string | number,
    operation: () => Promise<R>,
    options: {
      onSuccess?: (result: R) => void;
      onError?: (error: Error) => void;
      successMessage?: string;
    } = {}
  ): Promise<R | null> => {
    // Evitar operaciones múltiples
    if (isLoading(itemId)) {
      return null;
    }

    setLoading(itemId, true);
    
    try {
      const result = await operation();
      
      // Callback de éxito
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(itemId, errorMessage);
      
      // Callback de error
      if (options.onError) {
        options.onError(error as Error);
      }
      
      console.error(`Error en operación para item ${itemId}:`, error);
      return null;
    } finally {
      setLoading(itemId, false);
    }
  };

  /**
   * Limpia todos los estados
   */
  const clearStates = () => {
    loadingStates.value = {};
    errorStates.value = {};
  };

  /**
   * Limpia estados de un item específico
   */
  const clearItemStates = (itemId: string | number) => {
    delete loadingStates.value[itemId];
    delete errorStates.value[itemId];
  };

  // Computed para obtener items con errores
  const itemsWithErrors = computed(() => {
    return Object.entries(errorStates.value)
      .filter(([_, error]) => error !== null)
      .map(([itemId, error]) => ({ itemId, error }));
  });

  // Computed para obtener items en carga
  const loadingItems = computed(() => {
    return Object.entries(loadingStates.value)
      .filter(([_, loading]) => loading)
      .map(([itemId]) => itemId);
  });

  return {
    // Estados
    loadingStates: loadingStates.value,
    errorStates: errorStates.value,
    items,
    
    // Métodos de control
    setLoading,
    setError,
    isLoading,
    getError,
    updateItem,
    safeOperation,
    clearStates,
    clearItemStates,
    
    // Computed
    itemsWithErrors,
    loadingItems
  };
}
