export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as string;

  if (id === "new") {
    return {
      id: "",
      firstName: "Missael",
      lastName: "Padilla",
      salary: 0,
      role: "SUPER_ADMIN",
      position: "CENTER_MANAGER",
      email: "test@test.com",
      password: "Abc123456",
      status: "",
      hireDate: formatDate(new Date()),
    };
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
    },
  });

  if (!employee)
    throw createError({ status: 404, message: "El empleado solocitado no pude ser encontrado." });
 
  const roleDB = await prisma.role.findUniqueOrThrow({
        where: {
          id: employee.user.roleId,
        },
      });
  return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      salary: employee.salary ?? 0,
      role: roleDB.name,
      position: employee.position,
      email: employee.user.email,
      password: employee.user.passwordHash,
      status: employee.isActive,
      hireDate: formatDate(employee.hireDate),
    };
});
