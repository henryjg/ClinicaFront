export interface Slider {
    id: number;
    urlFoto: string;
    estado: string;
    nombreSlider: string;
    ubicacion: string;
    orden?: number; // Añadimos el campo para el orden
}

export const initializeSlider = (): Slider => {
    return {
        id: 0,
        urlFoto: '',
        estado: 'Inactivo',
        nombreSlider: '',
        ubicacion: '',
        orden: 0,
    };
};

export interface SliderErrors {
    id: string;
    urlFoto: string;
    estado: string;
    nombreSlider: string;
    ubicacion: string;
}

export const initializeSliderErrors = (): SliderErrors => {
    return {
        id: '',
        urlFoto: '',
        estado: '',
        nombreSlider: '',
        ubicacion: '',
    };
} 

export interface ItemSlider {
    linkRouter: string; // Ruta para el router-link
    urlimagen: string;  // URL de la imagen
}

// Interface para el reordenamiento de sliders
export interface SliderOrdenRequest {
    sliderId: number;
    nuevoOrden: number;
}

// Interface para la lista de reordenamiento
export interface ReordenarSlidersRequest {
    listaOrden: SliderOrdenRequest[];
}