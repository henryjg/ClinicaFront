// Utilidad para obtener la URL absoluta de un recurso
import { DOC_URL } from '../config';

export function getFullUrl(url: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return DOC_URL.replace(/\/$/, '') + '/' + url.replace(/^\/+/, '');
}
