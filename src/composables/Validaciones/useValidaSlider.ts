import { initializeSliderErrors, SliderErrors } from '../../interfaces/slider.interface';
import { useValidator } from './useValidator';

export function useValidaSlider() {
  const reglas = {
    nombreSlider: (value: any) => !!value || 'El nombre del slider es obligatorio',
    urlFoto: (value: any) => !!value || 'Debe subir una imagen para el slider',
    ubicacion: (value: any) => !!value || 'Debe seleccionar una ubicación',
  };

  return useValidator<SliderErrors>(
    initializeSliderErrors,
    reglas
  );
}
