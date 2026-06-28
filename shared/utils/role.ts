export const roleNames = {
  SUPER_ADMIN: "Super Administrador",
  MANAGER: "Administrador",
  PROFESSIONAL: "Profesional",
  EMPLOYEE: "Empleado",
} as const;

export const getRoleName = (role?: string) => {
  return roleNames[role as keyof typeof roleNames] ?? role;
};