// Composable useSubirArchivo.ts
import { ref } from "vue";
import { Adjunto, initialize_Adjunto } from "../interfaces/_interface";
import { Notif, NProgress, Alerta, ProgressBar} from '../utils/_utils';
import { API_REST, DOC_URL } from "../config";
import { FotoService, ServidorArchivosService } from "../services/_services";
import { useOperacion } from './Tools/useOperacion';

export function useSubirArchivo(elementoLoader: string, tipoArchivo: "archivopdf" | "fotografia") {
  const ArchivoTemporal = ref<Adjunto>(initialize_Adjunto());
  const isUploading     = ref(false);
  const fileDocumento   = ref<File | null>(null);

  const { ejecutar } = useOperacion();

  // SELECCIONAR
  const onFileSelected = (event: Event) => {
    const selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
    if (selectedFile) {
      fileDocumento.value = selectedFile;
    }
  };

  // ARRASTRAR Y SOLTAR
  const handleDropFile = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      fileDocumento.value = event.dataTransfer.files[0];
    }
  };

  // CONFIGURAR FORMDATA
  const prepararFormData = (): FormData => {
    const formData = new FormData();
    if (!fileDocumento.value) throw new Error("Debe seleccionar un archivo.");

    if (fileDocumento.value.size > 2 * 1024 * 1024) { // 2MB límite
      reset_formUpload();
      throw new Error("El archivo excede el tamaño máximo de 2MB.");
    }

    switch (tipoArchivo) {
      case "archivopdf":
        formData.append("op", "subir_archivo");
        formData.append("archivopdf", fileDocumento.value);
        break;
      case "fotografia":
        formData.append("op", "Subir_fotografia");
        formData.append("archivo_foto", fileDocumento.value);
        break;
      default:
        throw new Error("Tipo de archivo no válido.");
    }
    return formData;
  };


  // SUBIR ARCHIVOS AL SERVIDOR (IMÁGEN O PDF) -------------------------------------
  const subirArchivo = async () => {
    if (!fileDocumento.value) {
      Alerta.Advertencia("Falta Archivo","Debe cargar un archivo.");
      return;
    }

    // Mostrar loader personalizado
    ProgressBar.loadingDiv_star('#' + elementoLoader);

    try {      const formData = prepararFormData();
        
      // Usar el servicio correcto según el tipo de archivo
      const servicioUpload = tipoArchivo === "fotografia" 
        ? () => ServidorArchivosService.subirImagen(formData)
        : () => ServidorArchivosService.subirArchivo(formData);
          const resultado = await ejecutar(
        servicioUpload,
        {
          indicadorCarga: isUploading,
          mostrarErrores: true,
          mostrarCarga: false, // Usamos nuestro loader personalizado
          onExito: (respuestaJSON: any) => {
            if (respuestaJSON.success) {
              ArchivoTemporal.value.id = 1;
              // Manejar nueva estructura de respuesta del backend
              if (respuestaJSON.data && respuestaJSON.data.publicUrl) {
                // Nueva estructura: usar DOC_URL + publicUrl
                ArchivoTemporal.value.url = `${DOC_URL}${respuestaJSON.data.publicUrl}`;
              } else if (respuestaJSON.data && typeof respuestaJSON.data === 'string') {
                // Estructura legacy: respuestaJSON.data es una string
                ArchivoTemporal.value.url = `${API_REST}files/${respuestaJSON.data}`;
              } else {
                // Fallback
                ArchivoTemporal.value.url = `${DOC_URL}${respuestaJSON.data}`;
              }
              ArchivoTemporal.value.nombrefile = fileDocumento.value!.name;
            } else {
              throw new Error(respuestaJSON.message || "Error al subir el archivo");
            }
          },
          onFinalizacion: () => {
            ProgressBar.loadingDiv_end();
          }
        }
      );

      return ArchivoTemporal;
    } catch (error) {
      ProgressBar.loadingDiv_end();
      if (error instanceof Error && error.message.includes("tamaño máximo")) {
        reset_formUpload();
        Alerta.Advertencia("Archivo muy grande", error.message);
      }
      throw error;
    }
  };

  const reset_formUpload = () => {
    ArchivoTemporal.value = initialize_Adjunto();
    fileDocumento.value = null;
  };

  return {
    ArchivoTemporal,
    fileDocumento,
    isUploading,
    onFileSelected,
    handleDropFile,
    subirArchivo,
    reset_formUpload
  };
}
