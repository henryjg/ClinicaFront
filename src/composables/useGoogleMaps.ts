import { ref, watch } from 'vue';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MarkerOptions {
  position: MapCoordinates;
  draggable: boolean;
}

export function useGoogleMaps(initialCenter?: MapCoordinates) {
  // Centro por defecto (Lima, Perú)
  const defaultCenter: MapCoordinates = { 
    lat: -5.192700526416363, 
    lng: -80.62846284179687 
  };

  // Estado reactivo
  const center = ref<MapCoordinates>(initialCenter || defaultCenter);
  const markerPosition = ref<MapCoordinates>({ ...center.value });
  const markerOptions = ref<MarkerOptions>({
    position: markerPosition.value,
    draggable: true,
  });

  // Configuración del mapa
  const mapConfig = {
    zoom: 15,
    streetViewControl: false,
    disableDefaultUI: true,
    gestureHandling: "greedy" as const,
    style: "width: 100%; height: 300px"
  };

  /**
   * Actualiza la posición del marcador cuando se arrastra
   */
  const updatePosition = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng;
    if (latLng) {
      const newPosition = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      markerPosition.value = newPosition;
      // Actualizar también el centro del mapa
      center.value = { ...newPosition };
    }
  };

  /**
   * Establece una nueva posición para el marcador y centro del mapa
   */
  const setPosition = (lat: number, lng: number) => {
    const parsedLat = parseFloat(lat.toString());
    const parsedLng = parseFloat(lng.toString());

    if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0) {
      const newPosition = { lat: parsedLat, lng: parsedLng };
      center.value = newPosition;
      markerPosition.value = newPosition;
    } else {
      // Si las coordenadas no son válidas, usar el centro por defecto
      center.value = defaultCenter;
      markerPosition.value = { ...defaultCenter };
    }
  };

  /**
   * Resetea el mapa al centro por defecto
   */
  const resetToDefault = () => {
    center.value = defaultCenter;
    markerPosition.value = { ...defaultCenter };
  };

  // Watchers para mantener sincronizados los valores
  watch(center, (newCenter) => {
    markerPosition.value = { ...newCenter };
    markerOptions.value = { 
      ...markerOptions.value, 
      position: markerPosition.value 
    };
  });

  watch(markerPosition, (newMarkerPosition) => {
    markerOptions.value = { 
      ...markerOptions.value, 
      position: newMarkerPosition 
    };
  });

  return {
    // Estado
    center,
    markerPosition,
    markerOptions,
    mapConfig,
    defaultCenter,
    
    // Métodos
    updatePosition,
    setPosition,
    resetToDefault,
  };
}
