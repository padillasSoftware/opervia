export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, "id") as string;

  if (id === "new") {
    return {
      id: "",
      firstName: "",
      lastName: "",
      salary: 0,
      role: "",
      position: "",
      email: "",
      status: "",
      hireDate: formatDate(new Date()),
    };
  }

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!employee) {
    throw createError({
      statusCode: 404,
      statusMessage: "EMPLOYEE_NOT_FOUND",
      message: "El empleado solicitado no pudo ser encontrado.",
    });
  }

  if (session.user.role !== "SUPER_ADMIN" && employee.centerId !== session.user.centerId) {
    throw createError({
      statusCode: HttpStatus.FORBIDDEN,
      statusMessage: "FORBIDDEN",
      message: "Forbidden",
    });
  }

  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    salary: employee.salary ?? 0,
    role: employee.user.role.name,
    position: employee.position,
    email: employee.user.email,
    status: employee.isActive,
    hireDate: formatDate(employee.hireDate),
  };
});
