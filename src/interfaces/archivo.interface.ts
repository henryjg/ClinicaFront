export interface Adjunto {
  id: number;
  nombrefile: string;
  url: string;
  documento_id: string;
  fecharegistro: string;
}

export const initialize_Adjunto = (): Adjunto => {  
  return {
    id: 0,
    nombrefile: "",
    url: "",
    documento_id: "",
    fecharegistro: "",
  }
}
