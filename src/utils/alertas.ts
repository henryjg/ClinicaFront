import Swal from 'sweetalert2';
import type { SweetAlertIcon } from 'sweetalert2';

// Función para mostrar una alerta de confirmación
const Confirmacion = async (
  titulo: string,
  texto: string,
  icono: SweetAlertIcon = 'warning',
  confirmButtonText: string = 'Sí, eliminar',
  cancelButtonText: string = 'No, cancelar'
): Promise<boolean> => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    cancelButtonColor: '#dc3545',
    confirmButtonColor: '#19b159'
  });

  return result.isConfirmed;
};

const Confirmacion_CerrarSesion = async (
  titulo: string,
  texto: string,
  icono: SweetAlertIcon = 'warning',
  confirmButtonText: string = 'Confirmar',
  cancelButtonText: string = 'No, cancelar'
): Promise<boolean> => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    cancelButtonColor: '#dc3545',
    confirmButtonColor: '#19b159'
  });

  return result.isConfirmed;
};

const ConfirmacionRegistro = async (
  titulo: string,
  texto: string,
  icono: SweetAlertIcon = 'warning',
  confirmButtonText: string = 'Confirmar',
  cancelButtonText: string = 'No, cancelar'
): Promise<boolean> => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    cancelButtonColor: '#dc3545',
    confirmButtonColor: '#19b159'
  });

  return result.isConfirmed;
};


// Función para mostrar una alerta de éxito
const Sucessfull = (titulo: string, texto: string) => {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonColor: '#19b159'
  });
};

const Sucessfull_timer = (titulo: string, texto: string) => {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonColor: '#19b159',
    timer: 1000
  });
};
const Error = (titulo: string, texto: string) => {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      confirmButtonColor: '#dc3545'
    });
  };
  
  // Función para mostrar una alerta de peligro
  const Advertencia = (titulo: string, texto: string) => {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      confirmButtonColor: '#dc3545'
    });
  };


  const Alerta = {
    Confirmacion,
    Sucessfull,
    Sucessfull_timer,
    Error,
    Advertencia,
    ConfirmacionRegistro,
    Confirmacion_CerrarSesion
  };

  export default Alerta;