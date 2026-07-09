export const STRONG_PASSWORD_MESSAGE =
  "La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula, número y carácter especial.";

export const getPasswordValidationError = (password: string) => {
  if (!password) return "La contraseña es requerida.";
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "Debe contener al menos una letra mayúscula.";
  if (!/[a-z]/.test(password)) return "Debe contener al menos una letra minúscula.";
  if (!/[0-9]/.test(password)) return "Debe contener al menos un número.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Debe contener al menos un carácter especial.";

  return undefined;
};

export const isStrongPassword = (password: string) =>
  !getPasswordValidationError(password);
