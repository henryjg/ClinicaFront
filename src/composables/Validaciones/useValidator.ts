import { ref, Ref } from 'vue';

export type ValidationRule<T> = (value: any) => true | string;

export function useValidator<T extends Record<string, any>>(
  initializeErrors: () => T,
  validationRules: Partial<Record<keyof T, ValidationRule<any>>>
) {
  const errors: Ref<T> = ref(initializeErrors()) as Ref<T>;

  //  Valida un campo específico  
  const validarCampo = (campo: keyof T, valor: any): boolean => {
    const regla = validationRules[campo];
    if (regla) {
      const resultado = regla(valor);
      errors.value[campo] = resultado === true ? '' as any : resultado as any;
      return resultado === true;
    }
    return true;
  };

  
  //  Valida todos los campos de un formulario   
  const validarFormulario = (data: any): boolean => {
    errors.value = initializeErrors(); // Reiniciar errores
    
    let esValido = true;
    
    // Validar solo los campos que tienen reglas definidas
    Object.keys(validationRules).forEach(campo => {
      const campoKey = campo as keyof T;
      const valor = data[campoKey];
      
      if (!validarCampo(campoKey, valor)) {
        esValido = false;
      }
    });
    
    return esValido;
  };

  
  // Resetear Errores  
  const reiniciarErrores = (): void => {
    errors.value = initializeErrors();
  };

  return {
    errors,
    validarCampo,
    validarFormulario,
    reiniciarErrores
  };
}