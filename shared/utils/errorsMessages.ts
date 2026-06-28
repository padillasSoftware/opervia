export const errors = {
  INVALID_CREDENTIALS: "Correo electrónico o contraseña incorrectos.",
  UNAUTHORIZED: "Debes iniciar sesión para continuar.",
  USER_DISABLED: "Tu cuenta se encuentra desactivada.",
  CENTER_DISABLED: "Tu organización se encuentra desactivada.",
  NOT_FOUND: "No se encontró la información solicitada.",
  FORBIDDEN: "No tienes permisos para realizar esta acción.",
  VALIDATION_ERROR: "Hay campos inválidos.",
  DUPLICATED_EMAIL: "El correo electrónico ya está registrado.",
  DATABASE_ERROR: "Ocurrió un error al guardar la información.",
  SERVER_ERROR: "Ocurrió un error inesperado. Inténtalo nuevamente más tarde.",
};

export const getErrorMessage = (code?: string) => {
  return errors[code as keyof typeof errors] ?? errors.SERVER_ERROR;
};
