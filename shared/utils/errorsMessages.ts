export const errors = {
  INVALID_CREDENTIALS:
    'Correo electrónico o contraseña incorrectos.',

  USER_DISABLED:
    'Tu cuenta se encuentra desactivada.',

  CENTER_DISABLED:
    'Tu organización se encuentra desactivada.',

  SERVER_ERROR:
    'Ocurrió un error inesperado.'
}

export const getErrorMessage = (code?: string) => {

  console.log(code, errors[code as keyof typeof errors])

  return (
    errors[code as keyof typeof errors] ??
    errors.SERVER_ERROR
  );
};