// Re-export from auth interfaces for compatibility

// Usuario interfaces
export interface Usuario{
    id: number;
    rol: string;
    usuarioNombre: string;
    correoVerificado: string;
    fechaRegistro: string;
    lastUpdate: string;
}

export const initializeUsuario = ():Usuario =>{
    return{
        id: 0,
        rol: '',
        usuarioNombre: '',
        correoVerificado: '',
        fechaRegistro: '',
        lastUpdate: '', 
    };
};

export interface UsuarioErrors{
    id:string;
    rol: string;
    usuarioNombre:string;
    correoVerificado:string;
    fechaRegistro: string;
    lastUpdate: string;
}

export const initializeUsuarioErrors = (): UsuarioErrors => {
    return{
        id: '',
        rol: '',
        usuarioNombre: '',
        correoVerificado: '',
        fechaRegistro: '',
        lastUpdate: '', 
    };
}

export interface UsuarioCrear {
    usuarioNombre: string;
    pass: string;
  }

export const initializeUsuarioCrear = ():UsuarioCrear =>{
    return{
        usuarioNombre: '',
        pass: '',
    }
};

export interface UsuarioCrearErrors {
    usuarioNombre: string;
    pass: string;
}

export const initializeUsuarioCrearErrors = (): UsuarioCrearErrors => {
    return{
        usuarioNombre: '',
        pass: '',
    }
};

