export interface Contactenos {
    asunto: string;
    nombre: string;
    apellidos: string;
    celular: string;
    correo: string;    
    mensaje: string;    
  }

  export interface Prospecto {
    dni:string,
    nombres: string;
    apellidos: string;
    celular: string;
    asunto: string;
    inmuebleId: Number;
  }
  export interface Precio {
    categoria: string;
    preventa: number;
    venta: number;
  }
  // export interface Pagina {
  //   nombrecorto: string,         // emp_nombrecorto
  //   razonsocial: string,         // emp_razonsocial
  //   ruc: string,                 // emp_ruc
  //   gerente: string,             // emp_gerente
  //   titulopagina: string,        // emp_titulopagina
  //   slogan: string,              // emp_slogan
  //   nosotros: string,            // emp_nosotros
  //   mision: string,              // emp_mision
  //   vision: string,              // emp_vision
  //   valores: string,             // emp_valores
  //   politicasprivacidad: string, // emp_politicasprivacidad
  //   celular: string,             // emp_celular
  //   celular2?: string,           // emp_celular2 (Campo adicional)
  //   direccion?: string,          // emp_direccion (Campo adicional)
  //   email?: string,              // emp_email (Campo adicional)
  //   contacto: string,            // emp_contacto
  //   metatag: string,             // emp_metatag
  //   facebook: string,            // emp_facebook
  //   instragram: string,          // emp_instragram
  //   fechalimite: string,         // emp_youtube
  //   pixel: string                // emp_pixel
  //   reglamentoUrl:string
  // }
  
  