import { defineStore } from 'pinia';
import { Pagina } from "../interfaces/pagina.interface";
import { Precio } from "../types/objetosweb";

export const usePaginaStore = defineStore('pagStore', {
  state: () => ({
    pagina: null as Pagina | null,
      idCounter: 0
  }),
  actions: {
    async almacenaPagina() {
      // try {
      //   const RespuestaJSON = await get_datosEmpresa();
      //   this.pagina = RespuestaJSON.data;
      //   localStorage.setItem('pagina', JSON.stringify(this.pagina));
      // } catch (error) {
      //   console.error('Error obteniendo la página:', error);
      // }

    
    },
    cargaPagina() {
        const storedPagina = localStorage.getItem('pagina');
        if (storedPagina) {
          try {
            this.pagina = JSON.parse(storedPagina);
          } catch (error) {
            console.error('Error parsing stored pagina:', error);
            this.pagina = null;
          }
        } else {
          this.pagina = null;
        }
    },

  
  }
});
