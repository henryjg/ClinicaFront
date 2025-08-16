
export interface Ubigeo {
  id: number;
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}
export const initializeUbigeo = (): Ubigeo => {
  return {
    id: 0,
    ubigeo: '',
    departamento: '',
    provincia: '',
    distrito: ''
  };
};
