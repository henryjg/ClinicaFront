import { defineStore } from 'pinia';
import { Oferta } from '../interfaces/citas.interface';
import Notif from '../utils/notificaciones';

export const usarCarritoStore = defineStore('OfertaCarrito', {
  state: () => ({
      ListaOfertas: [] as Oferta[],
      idCounter: 0
  }),
  actions: {
    establecerOferta(oferta: Oferta) {
        const ofertaExistente = this.ListaOfertas.find((item) => item.id === oferta.id);
        if (!ofertaExistente) {
            this.ListaOfertas.push(oferta);
            localStorage.setItem('ListaOfertas', JSON.stringify(this.ListaOfertas));
            Notif.Success('Oferta añadida al carrito.');
        } else {
            Notif.Error('La oferta ya está en el carrito.');
        }
    },

    cargaPagina() {
      const storedListaOferta = localStorage.getItem('ListaOfertas');
      if (storedListaOferta) {
        try {
          this.ListaOfertas = JSON.parse(storedListaOferta);
        } catch (error) {
          console.error('Error parsing stored ListaOfertas:', error);
          this.ListaOfertas = [];
        }
      } else {
        this.ListaOfertas = [];
      }
    },

    eliminarOferta(id: number) {
        this.ListaOfertas = this.ListaOfertas.filter((item: Oferta) => item.id !== id);
        localStorage.setItem('ListaOfertas', JSON.stringify(this.ListaOfertas));
    },
    resetListaOferta() {
        this.ListaOfertas = [];
        localStorage.setItem('ListaOfertas', JSON.stringify(this.ListaOfertas));
    }
  }
});