import { ref } from 'vue';
import { useOperacion } from './Tools/useOperacion';
import { Alerta, ProgressBar } from '../utils/_utils';
import { ServidorArchivosService, TrabajadorService } from '../services/_services';
import { API_REST, DOC_URL } from '../config';
import { Adjunto, initialize_Adjunto } from '../interfaces/_interface';

export interface FileValidationOptions {
  allowedTypes?: string[];
  maxSize?: number; // en bytes
  customValidation?: (file: File) => string | null; // retorna mensaje de error o null si es válido
  showErrors?: boolean;
}

export interface UploadOptions extends FileValidationOptions {
  endpoint?: string;
  formFieldName?: string;
  headers?: Record<string, string>;
  serviceType?: 'servidor' | 'cliente' | 'trabajador' | 'custom'; // Tipo de servicio a usar
  customLoader?: string; // ID del elemento loader personalizado
  legacy?: boolean; // Para mantener compatibilidad con formatos antiguos
}

export interface FileUploadInstance {
  file: any;
  imageUrl: any;
  isUploading: any;
  ArchivoTemporal: any;
  onFileSelected: (event: Event) => void;
  handleDropFile: (event: DragEvent) => void;
  subirArchivo: () => Promise<any>;
  reset: () => void;
}

export function useFileUpload() {
  const isUploading = ref(false);
  const { ejecutar } = useOperacion();

  /**
   * Valida un archivo según las opciones proporcionadas
   * @param file Archivo a validar
   * @param options Opciones de validación
   * @returns string con error o null si es válido
   */
  const validarArchivo = (file: File, options: FileValidationOptions = {}): string | null => {
    const {
      allowedTypes = [],
      maxSize,
      customValidation
    } = options;

    // Validar tipo de archivo
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(', ')}`;
    }

    // Validar tamaño
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `El archivo es muy grande. Tamaño máximo permitido: ${maxSizeMB}MB`;
    }

    // Validación personalizada
    if (customValidation) {
      return customValidation(file);
    }

    return null;
  };

  /**
   * Sube una imagen al servidor usando ServidorArchivos o endpoint personalizado
   * @param file Archivo de imagen a subir
   * @param options Opciones de validación y subida
   * @returns URL de la imagen subida
   */  const subirImagen = async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<string | undefined> => {    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/avif', 'image/bmp'],
      maxSize = 2 * 1024 * 1024, // 2MB por defecto
      showErrors = true,
      serviceType = 'servidor', // Por defecto usar ServidorArchivosService
      formFieldName = 'archivo_foto',
      customLoader,
      ...validationOptions
    } = options;

    // Validar archivo
    const validationError = validarArchivo(file, {
      allowedTypes,
      maxSize,
      ...validationOptions
    });

    if (validationError) {
      if (showErrors) {
        Alerta.Error('Error de validación', validationError);
      }
      throw new Error(validationError);
    }

    const formData = new FormData();
    formData.append(formFieldName, file);

    // Mostrar loader personalizado si se especifica
    if (customLoader) {
      ProgressBar.loadingDiv_star('#' + customLoader);
    }

    try {
      let response;
        // Usar el servicio apropiado según el tipo
      switch (serviceType) {
        case 'servidor':
          response = await ejecutar(
            () => ServidorArchivosService.subirImagen(formData),
            {
              indicadorCarga: isUploading,
              mostrarErrores: showErrors,
              mostrarCarga: !customLoader
            }
          );
          break;
          
        // case 'cliente':
        //   response = await ejecutar(
        //     () => ClienteService.perfil.subirFoto(formData),
        //     {
        //       indicadorCarga: isUploading,
        //       mostrarErrores: showErrors,
        //       mostrarCarga: !customLoader
        //     }
        //   );
        //   break;
          
        case 'trabajador':
          response = await ejecutar(
            () => TrabajadorService.perfil.subirFoto(formData),
            {
              indicadorCarga: isUploading,
              mostrarErrores: showErrors,
              mostrarCarga: !customLoader
            }
          );
          break;
          
        default:
          throw new Error(`Tipo de servicio no soportado: ${serviceType}`);      }
      
      if (response?.success) {
        // Handle new response structure with publicUrl
        if (response.data?.publicUrl) {
          return `${DOC_URL}${response.data.publicUrl}`;
        }
        // Fallback for legacy responses
        const url = response.url || response.data || `${API_REST}files/${response.data}`;
        return url;
      } else {
        throw new Error(response?.message || 'Error al subir imagen');
      }
    } finally {
      if (customLoader) {
        ProgressBar.loadingDiv_end();
      }
    }
  };

  /**
   * Sube un documento PDF al servidor usando ServidorArchivos o endpoint personalizado
   * @param file Archivo PDF a subir
   * @param options Opciones de validación y subida
   * @returns URL del documento subido
   */  const subirPDF = async (file: File, options: UploadOptions = {}): Promise<string | undefined> => {
    const {
      allowedTypes = ['application/pdf'],
      maxSize = 10 * 1024 * 1024, // 10MB por defecto
      showErrors = true,
      serviceType = 'servidor', // Por defecto usar ServidorArchivosService
      formFieldName = 'file',
      customLoader,
      ...validationOptions
    } = options;

    // Validar archivo
    const validationError = validarArchivo(file, {
      allowedTypes,
      maxSize,
      ...validationOptions
    });

    if (validationError) {
      if (showErrors) {
        Alerta.Error('Error de validación', validationError);
      }
      throw new Error(validationError);
    }

    const formData = new FormData();
    formData.append(formFieldName, file);

    // Mostrar loader personalizado si se especifica
    if (customLoader) {
      ProgressBar.loadingDiv_star('#' + customLoader);
    }    try {
      let response;
      
      // Para PDFs usamos ServidorArchivosService
      response = await ejecutar(
        () => ServidorArchivosService.subirArchivo(formData),
        {
          indicadorCarga: isUploading,
          mostrarErrores: showErrors,
          mostrarCarga: !customLoader
        }      );
      
      if (response?.success) {
        // Handle new response structure with publicUrl
        if (response.data?.publicUrl) {
          return `${DOC_URL}${response.data.publicUrl}`;
        }
        // Fallback for legacy responses
        const url = response.url || response.data || `${API_REST}files/${response.data}`;
        return url;
      } else {
        throw new Error(response?.message || 'Error al subir PDF');
      }
    } finally {
      if (customLoader) {
        ProgressBar.loadingDiv_end();
      }
    }
  };

  /**
   * Sube cualquier tipo de archivo con opciones completamente personalizables
   * @param file Archivo a subir
   * @param options Opciones de validación y subida
   * @returns URL del archivo subido
   */  const subirArchivo = async (file: File, options: UploadOptions): Promise<string | undefined> => {
    const {
      showErrors = true,
      serviceType = 'servidor',
      formFieldName = 'file',
      ...validationOptions
    } = options;

    // Validar archivo
    const validationError = validarArchivo(file, validationOptions);

    if (validationError) {
      if (showErrors) {
        Alerta.Error('Error de validación', validationError);
      }
      throw new Error(validationError);
    }

    const formData = new FormData();
    formData.append(formFieldName, file);    // Usar el servicio apropiado
    let response;
    switch (serviceType) {
      case 'servidor':
        response = await ejecutar(
          () => ServidorArchivosService.subirArchivo(formData),
          {
            indicadorCarga: isUploading,
            mostrarErrores: showErrors
          }
        );
        break;
        
      // case 'cliente':
      //   response = await ejecutar(
      //     () => ClienteService.perfil.subirFoto(formData),
      //     {
      //       indicadorCarga: isUploading,
      //       mostrarErrores: showErrors
      //     }
      //   );
      //   break;
        
      case 'trabajador':
        response = await ejecutar(
          () => TrabajadorService.perfil.subirFoto(formData),
          {
            indicadorCarga: isUploading,
            mostrarErrores: showErrors
          }
        );
        break;
        
      default:
        throw new Error(`Tipo de servicio no soportado: ${serviceType}`);    }

    if (response?.success) {
      // Handle new response structure with publicUrl
      if (response.data?.publicUrl) {
        return `${DOC_URL}${response.data.publicUrl}`;
      }
      // Fallback for legacy responses
      return response.url || response.data || `${API_REST}files/${response.data}`;
    } else {
      throw new Error(response?.message || 'Error al subir archivo');
    }
  };

  /**
   * Sube múltiples archivos de forma secuencial
   * @param files Array de archivos a subir
   * @param options Opciones de subida para cada archivo
   * @returns Array de URLs de archivos subidos exitosamente
   */
  const subirMultiplesArchivos = async (
    files: File[], 
    options: UploadOptions = {}
  ): Promise<{ urls: string[]; errores: string[] }> => {
    const urls: string[] = [];
    const errores: string[] = [];
    
    for (const file of files) {
      try {
        let url: string | undefined;
        
        // Detectar tipo automáticamente si no se especifica endpoint
        if (!options.endpoint) {
          if (file.type.startsWith('image/')) {
            url = await subirImagen(file, { ...options, showErrors: false });
          } else if (file.type === 'application/pdf') {
            url = await subirPDF(file, { ...options, showErrors: false });
          } else {
            errores.push(`Tipo de archivo no soportado para ${file.name}`);
            continue;
          }
        } else {
          url = await subirArchivo(file, { ...options, showErrors: false });
        }
          
        if (url) {
          urls.push(url);
        }
      } catch (error) {
        console.error(`Error al subir archivo ${file.name}:`, error);
        errores.push(`Error en ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
    
    // Mostrar errores acumulados si hay alguno
    if (errores.length > 0 && options.showErrors !== false) {
      Alerta.Error('Errores en subida de archivos', errores.join('\n'));
    }
      return { urls, errores };
  };

  /**
   * Función de compatibilidad que simula useSubirArchivo para migración gradual
   * @param elementoLoader ID del elemento loader personalizado
   * @param tipoArchivo Tipo de archivo a subir
   * @returns Instancia compatible con useSubirArchivo
   */
  const createLegacyInstance = (
    elementoLoader: string, 
    tipoArchivo: "archivopdf" | "fotografia"
  ): FileUploadInstance => {
    const ArchivoTemporal = ref<Adjunto>(initialize_Adjunto());
    const fileDocumento = ref<File | null>(null);
    const imageUrl = ref<string | null>(null);

    const onFileSelected = (event: Event) => {
      const selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
      if (selectedFile) {
        fileDocumento.value = selectedFile;
        imageUrl.value = URL.createObjectURL(selectedFile);
      }
    };

    const handleDropFile = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer?.files.length) {
        const file = event.dataTransfer.files[0];
        fileDocumento.value = file;
        imageUrl.value = URL.createObjectURL(file);
      }
    };

    const subirArchivo = async () => {
      if (!fileDocumento.value) {
        Alerta.Advertencia("Falta Archivo", "Debe cargar un archivo.");
        return;
      }

      try {
        let url: string | undefined;        if (tipoArchivo === "fotografia") {
          url = await subirImagen(fileDocumento.value, {
            customLoader: elementoLoader,
            maxSize: 2 * 1024 * 1024, // 2MB como en el original
            formFieldName: 'archivo_foto',
            serviceType: 'servidor'
          });
        } else {
          url = await subirPDF(fileDocumento.value, {
            customLoader: elementoLoader,
            maxSize: 2 * 1024 * 1024, // 2MB como en el original
            formFieldName: 'archivopdf',
            serviceType: 'servidor'
          });
        }if (url) {
          ArchivoTemporal.value = {
            id: 1,
            url,
            nombrefile: fileDocumento.value.name,
            documento_id: '',
            fecharegistro: ''
          };
        }

        return { value: ArchivoTemporal.value };
      } catch (error) {
        throw error;
      }
    };

    const reset = () => {
      ArchivoTemporal.value = initialize_Adjunto();
      fileDocumento.value = null;
      imageUrl.value = null;
    };

    return {
      file: fileDocumento,
      imageUrl,
      isUploading,
      ArchivoTemporal,
      onFileSelected,
      handleDropFile,
      subirArchivo,
      reset
    };
  };

  /**
   * Instancia especializada para manejo de fotos de perfil (compatible con useTrabajador)
   * @param onSuccessCallback Callback ejecutado al subir exitosamente
   * @returns Funciones para manejo de fotos de perfil
   */
  const createProfilePhotoInstance = (onSuccessCallback?: (url: string) => void) => {
    const file_img = ref<File | null>(null);

    const onFileSelected_FotoPerfil = async (event: Event) => {
      const selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
      if (selectedFile) {
        // Validar tipo de archivo
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/bmp'];
        if (!tiposPermitidos.includes(selectedFile.type)) {
          Alerta.Error('Error de formato', 'Sólo se permiten los formatos: JPG, PNG, BMP');
          return;
        }
        
        file_img.value = selectedFile;
        
        // Auto-subir si se requiere
        await registrar_FotoPerfil();
      }
    };

    const registrar_FotoPerfil = async () => {
      if (!file_img.value) {
        Alerta.Error('Error', 'Debe cargar una fotografía');
        return;
      }

      try {        const url = await subirImagen(file_img.value, {
          formFieldName: 'archivo_foto',
          showErrors: true,
          serviceType: 'cliente'
        });

        if (url && onSuccessCallback) {
          onSuccessCallback(url);
        }

        return url;
      } catch (error) {
        throw error;
      }
    };

    return {
      file_img,
      onFileSelected_FotoPerfil,
      registrar_FotoPerfil
    };
  };

  /**
   * Instancia para manejo de fotos de negocio (compatible con useFotos)
   * @param onSuccessCallback Callback ejecutado al subir exitosamente
   * @returns Funciones para manejo de fotos de negocio
   */
  const createBusinessPhotoInstance = (onSuccessCallback?: (url: string) => void) => {
    const file = ref<File | null>(null);
    const imageUrl = ref<string | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const fileType = target.files[0].type;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
        
        if (!allowedTypes.includes(fileType)) {
          Alerta.Error('Error de formato', 'Formato de archivo no permitido.\nFormatos permitidos:\n*.jpg - *.jpeg - *.png - *.bmp.');
          return;
        }
        file.value = target.files[0];
        imageUrl.value = URL.createObjectURL(file.value);
      }
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        const droppedFile = event.dataTransfer.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
        
        if (!allowedTypes.includes(droppedFile.type)) {
          Alerta.Error('Error de formato', 'Formato de archivo no permitido.');
          return;
        }
        file.value = droppedFile;
        imageUrl.value = URL.createObjectURL(file.value);
      }
    };

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const registrarFoto = async (): Promise<boolean> => {
      if (!file.value) {
        Alerta.Error('Error', 'Debe cargar una fotografía');
        return false;
      }      try {        const url = await subirImagen(file.value, {
          formFieldName: 'archivo_foto',
          showErrors: true,
          serviceType: 'servidor'
        });

        if (url) {
          if (onSuccessCallback) {
            onSuccessCallback(url);
          }
          resetFileInput();
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    };

    const resetFileInput = () => {
      file.value = null;
      imageUrl.value = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    return {
      file,
      imageUrl,
      fileInput,
      onFileChange,
      handleDrop,
      triggerFileInput,
      registrarFoto,
      resetFileInput
    };
  };

  return {
    validarArchivo,
    subirImagen,
    subirPDF,
    subirArchivo,
    subirMultiplesArchivos,
    isUploading,
    // Nuevas funciones para compatibilidad y migración
    createLegacyInstance,
    createProfilePhotoInstance,
    createBusinessPhotoInstance,
    // Función auxiliar
    initialize_Adjunto
  };
}
