import { ref } from 'vue';
import { UsuarioCrear, UsuarioCrearErrors, initializeUsuarioCrearErrors } from '../../interfaces/_interface';

export function useValidaUsuarios() {
  const errors = ref<UsuarioCrearErrors>(initializeUsuarioCrearErrors());

  /**
   * Valida el formulario completo de usuario
   */
  const validarFormulario = (usuario: UsuarioCrear): boolean => {
    errors.value = initializeUsuarioCrearErrors();
    let esValido = true;

    // Validar nombre de usuario
    if (!usuario.usuarioNombre || usuario.usuarioNombre.trim() === '') {
      errors.value.usuarioNombre = 'El nombre de usuario es obligatorio';
      esValido = false;
    } else if (usuario.usuarioNombre.length < 3) {
      errors.value.usuarioNombre = 'El nombre de usuario debe tener al menos 3 caracteres';
      esValido = false;
    } else if (usuario.usuarioNombre.length > 50) {
      errors.value.usuarioNombre = 'El nombre de usuario no puede exceder 50 caracteres';
      esValido = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(usuario.usuarioNombre)) {
      errors.value.usuarioNombre = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
      esValido = false;
    }

    // Validar contraseña
    if (!usuario.pass || usuario.pass.trim() === '') {
      errors.value.pass = 'La contraseña es obligatoria';
      esValido = false;
    } else if (usuario.pass.length < 6) {
      errors.value.pass = 'La contraseña debe tener al menos 6 caracteres';
      esValido = false;
    } else if (usuario.pass.length > 100) {
      errors.value.pass = 'La contraseña no puede exceder 100 caracteres';
      esValido = false;
    }

    return esValido;
  };

  /**
   * Limpia todos los errores de validación
   */
  const limpiarErrores = () => {
    errors.value = initializeUsuarioCrearErrors();
  };

  /**
   * Valida un campo específico
   */
  const validarCampo = (campo: keyof UsuarioCrear, valor: any): string => {
    switch (campo) {
      case 'usuarioNombre':
        if (!valor || valor.trim() === '') return 'El nombre de usuario es obligatorio';
        if (valor.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
        if (valor.length > 50) return 'El nombre de usuario no puede exceder 50 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(valor)) return 'Solo puede contener letras, números y guiones bajos';
        break;
      
      case 'pass':
        if (!valor || valor.trim() === '') return 'La contraseña es obligatoria';
        if (valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        if (valor.length > 100) return 'La contraseña no puede exceder 100 caracteres';
        break;
    }
    return '';
  };

  return {
    errors,
    validarFormulario,
    limpiarErrores,
    validarCampo
  };
}
