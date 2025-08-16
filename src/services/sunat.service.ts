import axios from 'axios';
import { API_SUNAT } from '../config';
// import { API_REST } from '../config';
import { handleApiError } from '../utils/ApiErrorHandler';

const SunatService = {
    async DNI(dnitrabajador: string) {
        try {
            const response = await axios.post(API_SUNAT, {
                op: 'get_datos_dni',
                dni: dnitrabajador
            });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    async RUC(ruc: string) {
        try {
            const response = await axios.post(API_SUNAT, {
                op: 'get_datos_ruc',
                ruc: ruc
            });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};

export default SunatService;
