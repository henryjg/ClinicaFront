// Formateo y presentación
export { FormatFecha } from './FormatFecha';
export { default as NumberFormat } from './FormatNumber';
export { CleanLink } from './CleanLink';

// Notificaciones y alertas
export { default as Notif } from './notificaciones';
export { default as Alerta } from './alertas';

export { default as ProgressBar } from './progress_bar';

// Manejo de errores
export { handleApiError, ApiError, ErrorType } from './ApiErrorHandler';

// Listas y constantes
export { menuItems } from './lista_menulateral';
export { list_meses, cargo } from './listas.fijas';


// Importaciones comunes
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Modal, Offcanvas } from 'bootstrap';
import BlotFormatter from 'quill-blot-formatter';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

export {
  NProgress,
  Modal,
  Offcanvas,
  BlotFormatter,
  saveAs,
  QRCode
};