import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {  TrabajadorService } from '../services/_services';
import { Notif, NProgress, Alerta} from '../utils/_utils';
import { Trabajador, initializeTrabajador, initializeTrabajadorErrors, CrearTrabajador, initializeCrearTrabajador } from '../interfaces/_interface';
import { useValidaTrabajador } from './Validaciones/useValidaTrabajador';
// import { useFamiliars } from './_composables';
import { useOperacion } from './Tools/useOperacion';
import { useFileUpload } from './use_ArchivosUpload';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function useTrabajador() {
  // Datos reactivos
  const route = useRoute();
  const router = useRouter();

  const ListaTrabajadores = ref<Trabajador[]>([]);
  const nuevoTrabajador = ref<CrearTrabajador>(initializeCrearTrabajador());
  const trabajador = ref<Trabajador>(initializeTrabajador());
  const isLoading_Trabajador = ref(false);  const { ejecutar } = useOperacion();
  const { subirImagen, createProfilePhotoInstance } = useFileUpload();
  // const { Listar_Familiares, Listar_Familiar_Trabajador } = useFamiliars();
  const { errors, validarFormulario } = useValidaTrabajador();

  // Instancia para manejo de foto de perfil
  const { file_img, onFileSelected_FotoPerfil, registrar_FotoPerfil: subirFotoPerfil } = createProfilePhotoInstance(
    (url: string) => {
      trabajador.value.fotoPerfil = url;
    }
  );

  const ResetFormularioTrabajador = () => {
    trabajador.value = initializeTrabajador();
    errors.value = initializeTrabajadorErrors();
  };

  // Cargar lista de trabajadores
  const Listar_Trabajadores = async () => {
    return ejecutar(
      () => TrabajadorService.listar(),
      {
        indicadorCarga: isLoading_Trabajador,
        mostrarErrores: true,
        onExito: (response) => {
          if (response.success) {
            ListaTrabajadores.value = response.data;
          } else {
            throw new Error(response.message || 'Error al cargar la lista de trabajadores.');
          }
        }
      }
    );
  };
  // const Obtener_Trabajador = async (idTrabajador:number) => {
  //   if (!idTrabajador || isNaN(Number(idTrabajador)) || idTrabajador === 0) {
  //     console.error('ID del trabajador no es válido:', idTrabajador);
  //     throw new Error('ID del trabajador no válido.');
  //   }

  //   return ejecutar(
  //     () => TrabajadorService.obtener(Number(idTrabajador)),
  //     {
  //       indicadorCarga: isLoading_Trabajador,
  //       mostrarErrores: true,
  //       onExito: async (response) => {
  //         if (response.success) {
  //           trabajador.value = response.data;
  //           await Listar_Familiar_Trabajador(Number(idTrabajador));
  //         } else {
  //           throw new Error(response.message || 'Error al cargar trabajador');
  //         }
  //       }
  //     }
  //   );
  // };

  // Registrar un nuevo trabajador
  const Crear_Trabajador = async (dataOverride?: CrearTrabajador) => {
    const data = dataOverride || nuevoTrabajador.value;

    if (!validarFormulario(data)) return false;

    return ejecutar(
      async () => {        
        if (file_img.value) {
          await subirFotoPerfil();
        }
        const response = await TrabajadorService.crear(data);
        return response;
      },
      {
        indicadorCarga: isLoading_Trabajador,
        mensajeExito: 'Trabajador registrado con éxito',
        mostrarErrores: true,
        onExito: async (response) => {
          if (response.success) {
            TrabajadorService.EnviarCorreoBienvenida(response.data.id);
            ResetFormularioTrabajador();
            router.push('/office/trabajador');
          } else {
            throw new Error(response.message || 'Error al registrar trabajador');
          }
        }
      }
    );
  };

  // Actualizar un trabajador existente
  const Actualizar_Trabajador = async (id: number, dataOverride?: Partial<Trabajador>) => {
    const data = dataOverride || nuevoTrabajador.value;
    // if (!validarFormulario(data)) return false;

    return ejecutar(
      () => TrabajadorService.actualizar(id, data),
      {
        indicadorCarga: isLoading_Trabajador,
        mensajeExito: 'Trabajador actualizado con éxito.',
        mostrarErrores: true,
        onFinalizacion: () => Listar_Trabajadores()
      }
    );
  };

  // Eliminar un trabajador
  const Eliminar_Trabajador = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar este trabajador?',
      'Esta acción no se puede deshacer.'
    );
    
    if (!isConfirmado) return;

    return ejecutar(
      () => TrabajadorService.eliminar(id),
      {
        mensajeExito: 'Trabajador eliminado con éxito',
        mostrarErrores: true,
        onExito: (response) => {
          if (response.success) {
            Listar_Trabajadores();
          } else {
            throw new Error(response.message || 'Error al eliminar trabajador');
          }
        }
      }
    );
  };

  // Eliminar un trabajador
  const Eliminar_Trabajador_Fila = async (id: number) => {
    const isConfirmado = await Alerta.Confirmacion(
      '¿Estás seguro de que deseas eliminar este trabajador?',
      'Esta acción no se puede deshacer.'
    );
    
    if (!isConfirmado) return;

    // Eliminar del DOM si existe
    const fila = document.getElementById(`tr_trabajador_${id}`);
    if (fila) {
      fila.remove();
    }
    
    // Eliminar del array reactivo local (por si acaso)
    const index = ListaTrabajadores.value.findIndex(u => u.id === id);
    if (index > -1) {
      ListaTrabajadores.value.splice(index, 1);
    }
    
  };

   // Exportar Excel 
      const ExportarExcelTrabajador = async () => {
        try {
          const response = await TrabajadorService.exportarExcelTrabajador();
          if (response.success) {
            const data = response.data.map((trabajador: Trabajador) => ({
              'ID': trabajador.id,
              'Nombre': trabajador.nombre,
              'Genero': trabajador.genero,
              'Dni': trabajador.dni,
              'Oficina': trabajador.oficinaId,
              'Celular': trabajador.celular,
              'Estado': trabajador.estado,
              'Logs': trabajador.nroingresos,
              'Ultima Conexión': trabajador.lastconexion,
              'Numero de Cupones': trabajador.nrocupones
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Trabajadores');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(dataBlob, 'Trabajadores.xlsx');
            Notif.Success('Excel exportado con éxito');
          } else {
            throw new Error('Error al exportar trabajadores: ' + response);
          }
        } catch (error: any) {
          Notif.Error('Error al exportar trabajadores: ' + error.message);
        }
      };



  // Cargar trabajadores de una oficina específica
  const Listar_Trabajadores_Oficina = async (oficinaId: number) => {
    return ejecutar(
      () => TrabajadorService.listarPorOficina(oficinaId),
      {
        indicadorCarga: isLoading_Trabajador,
        mostrarErrores: true,
        onExito: (response) => {
          ListaTrabajadores.value = response;
        }
      }
    );
  };

//  ------------------------------------------------------


  const registrar_FotoPerfil = async () => {
    return ejecutar(
      async () => {
        const formData = new FormData();
        formData.append('archivo_foto', file_img.value!);
        return await TrabajadorService.perfil.subirFoto(formData);
      },
      {
        indicadorCarga: isLoading_Trabajador,
        mostrarErrores: true,
        onExito: (response) => {
          if (response.success) {
            trabajador.value.fotoPerfil = response.data;
          } else {
            throw new Error(response.message || 'Error al subir foto');
          }
        }
      }
    );
  };

  // Actualizar foto del trabajador
  const actualizarFotoTrabajador = async (id: number, fotoPerfil: string) => {
    return ejecutar(
      () => TrabajadorService.perfil.actualizarFoto(id, fotoPerfil),
      {
        mensajeExito: 'Foto actualizada con éxito.',
        mostrarErrores: true,
        onFinalizacion: () => Listar_Trabajadores()
      }
    );
  };

  // Actualizar estado del trabajador
  const actualizarEstadoTrabajador = async (id: number, estado: string) => {
    return ejecutar(
      () => TrabajadorService.actualizarEstado(id, estado),
      {
        mensajeExito: 'Estado actualizado con éxito.',
        mostrarErrores: true,
        onFinalizacion: () => Listar_Trabajadores()
      }
    );
  };

  return {
    ListaTrabajadores,
    nuevoTrabajador,
    errors,
    trabajador,
    Listar_Trabajadores,
    // Obtener_Trabajador,
    Listar_Trabajadores_Oficina,
    Crear_Trabajador,
    Actualizar_Trabajador,    Eliminar_Trabajador,
    actualizarFotoTrabajador,
    actualizarEstadoTrabajador,
    registrar_FotoPerfil,
    onFileSelected_FotoPerfil,
    isLoading_Trabajador,
    ResetFormularioTrabajador,
    ExportarExcelTrabajador,
    Eliminar_Trabajador_Fila
  };
}
