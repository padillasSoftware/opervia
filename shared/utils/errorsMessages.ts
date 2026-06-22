export const errors = {
 INVALID_CREDENTIALS:
    'Correo electrónico o contraseña incorrectos.',

  UNAUTHORIZED:
    'Debes iniciar sesión para continuar.',

  USER_DISABLED:
    'Tu cuenta se encuentra desactivada.',

  CENTER_DISABLED:
    'Tu organización se encuentra desactivada.',

  NOT_FOUND:
    'No se encontró la información solicitada.',

  FORBIDDEN:
    'No tienes permisos para realizar esta acción.',

  SERVER_ERROR:
    'Ocurrió un error inesperado. Inténtalo nuevamente más tarde.',
}

export const getErrorMessage = (code?: string) => {

  console.log(code, errors[code as keyof typeof errors])

  return (
    errors[code as keyof typeof errors] ??
    errors.SERVER_ERROR
  );
};