// sunat.ts
import { ref } from "vue";
import { SunatService } from '../services/_services'; 
import { Alerta } from '../utils/_utils';
import { 
  initializePersonaJuridica, 
  initializePersonaNatural, 
  PersonaJuridica, 
  PersonaNatural 
} from "../interfaces/_interface";
import { useOperacion } from './Tools/useOperacion';

export function Sunat() {
  // Estados reactivos
  const empresaData = ref<PersonaJuridica>(initializePersonaJuridica()); 
  const personaData = ref<PersonaNatural>(initializePersonaNatural());
  
  // Estados de carga
  const isValidatingRuc = ref(false);
  const isValidatingDni = ref(false);  

  const { ejecutar } = useOperacion();
  /**
   * Valida un RUC en SUNAT y obtiene los datos de la empresa
   * @param ruc RUC de 11 dígitos a validar
   * @returns Datos de la empresa o null si no se encuentra
   */
  const validarRuc = async (ruc: string) => {
    if (!ruc || ruc.length !== 11) {
      Alerta.Error('Error', 'El RUC debe tener 11 dígitos');
      return null;
    }
    const resultado = await ejecutar(
      () => SunatService.RUC(ruc),
      {
        indicadorCarga: isValidatingRuc,
        onExito: (data) => {
          if (data) {
            empresaData.value = data;
          } else {
            Alerta.Error('Error', 'No se encontraron datos para el RUC proporcionado.');
          }
        }
      }
    );

    return resultado ? empresaData.value : null;
  };

  /**
   * Valida un DNI en RENIEC y obtiene los datos de la persona
   * @param dni DNI de 8 dígitos a validar  
   * @returns Datos de la persona o null si no se encuentra
   */
  const validarDni = async (dni: string) => {
    if (!dni || dni.length !== 8) {
      Alerta.Error('Error', 'El DNI debe tener 8 dígitos');
      return null;
    }
    const resultado = await ejecutar(
      () => SunatService.DNI(dni),
      {
        indicadorCarga: isValidatingDni,
        onExito: (data) => {
          if (data) {
            personaData.value = data;
          } else {
            Alerta.Error('Error', 'No se encontró el DNI');
          }
        }
      }
    );

    return resultado ? personaData.value : null;
  };  return {
    // Estados reactivos
    empresaData,
    personaData,
    
    // Estados de carga
    isValidatingRuc,
    isValidatingDni,
    
    // Operaciones
    validarRuc,
    validarDni,
    
    // Para retrocompatibilidad
    Validar_DNI: validarDni,
    Validar_RUC: validarRuc,
    EmpresaData: empresaData,
    PersonaData: personaData
  };
}
