export interface Historia {
    id: number;
    hipertension: string;
    diabetes: string;
    alergia: string;
    vacuna: string;
    sida: string;
    tipo_sangre: string;
    intervenciones_quirurgicas: string;
    fecha_ingreso: string;
    observaciones: string;
    paciente_id: number;
}

export const initializeHistoria = (): Historia => {
    return {
        id: 0,
        hipertension: '',
        diabetes: '',
        alergia: '',
        vacuna: '',
        sida: '',
        tipo_sangre: '',
        intervenciones_quirurgicas: '',
        fecha_ingreso: '',
        observaciones: '',
        paciente_id: 0,
    };
};

export interface HistoriaErrors {
    id: string;
    hipertension: string;
    diabetes: string;
    alergia: string;
    vacuna: string;
    sida: string;
    tipo_sangre: string;
    intervenciones_quirurgicas: string;
    fecha_ingreso: string;
    observaciones: string;
    paciente_id: string;
}

export const initializeHistoriaErrors = (): HistoriaErrors => {
    return {
        id: '',
        hipertension: '',
        diabetes: '',
        alergia: '',
        vacuna: '',
        sida: '',
        tipo_sangre: '',
        intervenciones_quirurgicas: '',
        fecha_ingreso: '',
        observaciones: '',
        paciente_id: '',
    };
};
 