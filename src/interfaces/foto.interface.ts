export interface Foto {
  id: number;
  url: string;
}

export const initializeFoto = (): Foto => ({
    id: 0,
    url: ''
});

export interface FotoErrors {
  id: string;
  url: string;
  file: string;
  negocioId: string;
}

export const initializeFotoErrors = (): FotoErrors => ({
  id: '',
  url: '',
  file: '',
  negocioId: ''
});