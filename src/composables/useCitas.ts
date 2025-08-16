import { ref } from 'vue';
import { CitasService } from '../services/_services';
import { Alerta, Notif } from '../utils/_utils';
import { Citas, initializeCitas } from '../interfaces/_interface';
import { useRouter } from 'vue-router';
import { useOperacion } from './Tools/useOperacion';import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function useCitas() {
  // Estado reactivo
  const listaCitas = ref<Citas[]>([]);
  const cita = ref<Citas>(initializeCitas());
  const localCita = ref<Citas>(initializeCitas()); // Para uso en modales/formularios
  const nuevaCita = ref<Citas>(initializeCitas());
  const selectedCita = ref<Citas>(initializeCitas()); // Para selección de cita en UI
  const isloading_citas = ref(false);
  const router = useRouter();

  // Contenido para editor HTML (QuillEditor)
  const editorContent = ref('');
  const editorDescripcion = ref('');

  // Importar validaciones y operaciones
  // const { 
  //   errors, 
  //   validarFormulario, 
  //   mostrarDsctoCliente,
  //   mostrarDsctoTrabajador
  // } = useValidaOferta();

  const { ejecutar } = useOperacion();
  /**
   * Carga la lista completa de citas
   */
  const Listar_Citas = async () => {
    return ejecutar(
      () => CitasService.listarTodas(),
      {
        indicadorCarga: isloading_citas,
        onExito: (response: any) => {
          listaCitas.value = response.data;
        }
      }
    );
  };

  /**
   * Carga citas activas únicamente
   */
  const Listar_Citas_Activas = async () => {
    return ejecutar(
      () => CitasService.listarActivas(),
      {
        indicadorCarga: isloading_citas,
        onExito: (response) => {
          listaCitas.value = response.data;
        }
      }
    );
  };

  /**
   * Carga citas por negocio específico
   */
  const Listar_Citas_porIdNegocio = async (negocioId: number) => {
    return ejecutar(
      () => CitasService.listarPorNegocio(negocioId),
      {
        indicadorCarga: isloading_citas,
        onExito: (response) => {
          listaCitas.value = response.data;
        }
      }
    );
  };

  /**
   * Carga citas por categoría específica
   */
  const Listar_Citas_porCategoria = async (categoriaId: number) => {
    return ejecutar(
      () => CitasService.listarPorCategoria(categoriaId),
      {
        indicadorCarga: isloading_citas,
        onExito: (response) => {
          listaCitas.value = response.data;
        }
      }
    );
  };

  /**
   * Carga los datos de una cita específica
   */
  const Obtener_Cita = async (id: number) => {
    return ejecutar(
      () => CitasService.obtener(id),
      {
        indicadorCarga: isloading_citas,
        onExito: (response) => {
          cita.value = response.data;
          localCita.value = { ...response.data };
          editorContent.value = response.data.descripcion || '';
          editorDescripcion.value = response.data.descripcion || '';
        }
      }
    );
  };

  /**
   * Valida las fechas de la oferta
   */
  const validarFechas = (fechaInicio: string, fechaFin: string): boolean => {
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      return false;
    }
    return true;
  };


  /**
   * Registra una nueva oferta
   */
  const Crear_Cita = async () => {
    if(localCita.value) {
      // console.log('Formulario inválido:');
      // console.table(errors.value);
      return false;
    }

    // if (!validarFechas(nuevaOferta.value.fechaInicio, nuevaOferta.value.fechaFin)) {

    //   return false;
    // }

    // Forzar string en descuentos
    // if (typeof localOferta.value.valordscto_cliente !== 'string') {
    //   localOferta.value.valordscto_cliente = String(localOferta.value.valordscto_cliente ?? '');
    // }
    // if (typeof localOferta.value.valordscto_trabajador !== 'string') {
    //   localOferta.value.valordscto_trabajador = String(localOferta.value.valordscto_trabajador ?? '');
    // }
    // console.table(localCita.value);
    return ejecutar(
      () => CitasService.crear(localCita.value as any),
      {
        indicadorCarga: isloading_citas,
        mensajeExito: 'Cita registrada con éxito',
        onExito: async () => {
          localCita.value = initializeCitas();
          editorContent.value = '';
          editorDescripcion.value = '';
          await Listar_Citas();
        }
      }
    );
  };

  /**
   * Actualiza una oferta existente
   */

  const Actualizar_Cita = async () => {
    if (localCita.value) {
      return false;
    }

    // if (!validarFechas(localOferta.value.fechaInicio, localOferta.value.fechaFin)) {
    //   return false;
    // }

    // Forzar string en descuentos
    // if (typeof localOferta.value.valordscto_cliente !== 'string') {
    //   localOferta.value.valordscto_cliente = String(localOferta.value.valordscto_cliente ?? '');
    // }
    // if (typeof localOferta.value.valordscto_trabajador !== 'string') {
    //   localOferta.value.valordscto_trabajador = String(localOferta.value.valordscto_trabajador ?? '');
    // }
    return ejecutar(
      () => CitasService.actualizar(localCita.value),
      {
        indicadorCarga: isloading_citas,
        mensajeExito: 'Cita actualizada con éxito',
        onExito: async () => {
          await Listar_Citas();
        }
      }
    );
  };

  /**
   * Elimina una cita
   */
  const Eliminar_Cita = async (id: number, negocioId?: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Está seguro de eliminar esta cita?',
      'Esta acción no se puede deshacer'
    );
    
    if (!isConfirmado) return false;

    return ejecutar(
      () => CitasService.eliminar(id),
      {
        mensajeExito: 'Cita eliminada con éxito',
        onExito: async () => {
          if (negocioId) {
            await Listar_Citas_porIdNegocio(negocioId);
          } else {
            await Listar_Citas();
          }
        }
      }
    );
  };

  const eliminarFilaCita = async (id: number, eliminarDelServidor: boolean = true) => {
    // Si se requiere eliminar del servidor primero
    if (eliminarDelServidor) {
      const resultado = await CitasService.eliminar(id);
      if (!resultado.success) return false;
    }

    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar esta cita?',
      'Esta acción no se puede deshacer.'
    );

    if (!isConfirmado) return;

    // Eliminar del DOM si existe
    const fila = document.getElementById(`tr_cita_${id}`);
    if (fila) {
      fila.remove();
    }

    // Eliminar del array reactivo local (por si acaso)
    const index = listaCitas.value.findIndex(n => n.id === id);
    if (index > -1) {
      listaCitas.value.splice(index, 1);
    }

    return true;
  };

  /**
   * Actualiza el estado de una cita
   */
  const Actualizar_Estado_Cita = async (id: number, estado: string) => {
    return ejecutar(
      () => CitasService.actualizarEstado(id, estado),
      {
        mensajeExito: 'Estado de la cita actualizado con éxito'
      }
    );
  };

      // Exportar Excel 
      const ExportarExcelCitas = async () => {
        try {
          const response = await CitasService.exportarExcelCitas();
          if (response.success) {
            const data = response.data.map((cita: Citas) => ({
              'ID': cita.id,
              // 'Nombre Servicio': cita.nombreServicio,
              // 'Tipo': cita.tipoServicio,
              // 'Descuento Cliente': cita.valordscto_cliente,
              // 'Descuento Trabajador': cita.valordscto_trabajador,
              // 'Numero de cupos': cita.numeroCupos,
              // 'Cupones Pendientes': cita.nroCuponesActivos,
              // 'Cupones Utilizadoss': cita.nroCuponesUtilizados,
              // 'Fecha Inicio': cita.fechaInicio,
              'Estado': cita.estado,
            }));
    
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Negocios');
  
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(dataBlob, 'Negocios.xlsx');
            Notif.Success('Excel exportado con éxito');
          } else {
            throw new Error('Error al exportar negocios: ' + response);
          }
        } catch (error: any) {
          Notif.Error('Error al exportar negocios: ' + error.message);
        }
      };

  /**
   * Limpia los errores de validación
   */

  // const limpiarErrores = () => {
  //   const errorKeys = Object.keys(errors.value) as Array<keyof typeof errors.value>;
  //   errorKeys.forEach(key => {
  //     errors.value[key] = '';
  //   });
  // };

  /**
   * Resetea el formulario de nueva oferta
   */

  const resetearFormulario = () => {
    localCita.value = initializeCitas();
    editorContent.value = '';
    editorDescripcion.value = '';
    // limpiarErrores();
  };

  /**
   * Copia datos de cita para edición
   */
  const prepararEdicion = (citaParaEditar: Citas) => {
    localCita.value = { ...citaParaEditar };
    // editorContent.value = citaParaEditar.descripcion || '';
    // editorDescripcion.value = citaParaEditar.descripcion || '';
  };

  return {

    // Estado
    listaCitas,
    cita,
    localCita,
    isloading_citas,
    // errors,
    editorContent,
    editorDescripcion,
    selectedCita,
    
    // Validaciones auxiliares
    // mostrarDsctoCliente,
    // mostrarDsctoTrabajador,
    // Acciones principales
    Listar_Citas,
    Listar_Citas_Activas,
    Listar_Citas_porIdNegocio,
    Listar_Citas_porCategoria,
    Obtener_Cita,
    Crear_Cita,
    Actualizar_Cita,
    Eliminar_Cita,
    Actualizar_Estado_Cita,
    ExportarExcelCitas,
    eliminarFilaCita,

    // Utilidades
    validarFechas,
    // validarFormulario, // Agregar esta línea
    // limpiarErrores,
    resetearFormulario,
    prepararEdicion
  };
}
