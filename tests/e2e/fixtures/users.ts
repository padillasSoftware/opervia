export const users = {
    loggedInSuperAdmin: {
    id: "superadmin-test-id",
    email: "superadmin@test.com",
    name: "Maelmar Admin",
    centerName: "Maelmar Demo Center",
    lastLoginAt: new Date().toISOString(),
    role: "SUPER_ADMIN",
    loggedIn: true,
  },

  loggedInAdmin: {
    id: "admin-test-id",
    email: "admin@test.com",
    name: "Administrador Test",
    centerName: "Centro de pruebas",
    lastLoginAt: new Date().toISOString(),
    role: "MANAGER",
    loggedIn: true,
  },

  loggedInEmployee: {
    id: "empleado-test-id",
    email: "empleado@test.com",
    name: "Empleado Test",
    centerName: "Centro de prueba",
    lastLoginAt: new Date().toISOString(),
    role: "EMPLOYEE",
    loggedIn: true,
  },

  admin: {
    id: "admin-test-id",
    email: "admin@test.com",
    name: "Administrador Test",
    centerName: "Centro de prueba",
    lastLoginAt: null,
    role: "MANAGER",
  },

  employee: {
    id: "empleado-test-id",
    email: "empleado@test.com",
    name: "Empleado Test",
    centerName: "Centro de prueba",
    lastLoginAt: null,
    role: "EMPLOYEE",
  },
};
