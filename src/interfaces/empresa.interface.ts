
export interface Empresa {
  id: string;
  nombreCorto: string;
  razonsocial: string;
  ruc: string;
  titulopagina: string;
  slogan: string;
  nosotros: string;
  mision: string;
  vision: string;
  valores: string;
  fechalimite: string;
  celular: string;
  celular2: string;
  direccion: string;
  email: string;
  contacto: string;
  metatag: string;
  facebook: string;
  instragram: string;
  youtube: string;
  pixel: string;
  reglamentoUrl: string;
  imagendestacadaUrl: string;
}
export const initializeEmpresa = (): Empresa => {
  return {
    id: '',
    nombreCorto: '',
    razonsocial: '',
    ruc: '',
    titulopagina: '',
    slogan: '',
    nosotros: '',
    mision: '',
    vision: '',
    valores: '',
    fechalimite: '',
    celular: '',
    celular2: '',
    direccion: '',
    email: '',
    contacto: '',
    metatag: '',
    facebook: '',
    instragram: '',
    youtube: '',
    pixel: '',
    reglamentoUrl: '',
    imagendestacadaUrl: ''
  };
};
