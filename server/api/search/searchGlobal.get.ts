export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const query = getQuery(event);
  const q = String(query.q || "").trim();

  const roleMap = {
    administrador: "MANAGER",
    admin: "MANAGER",
    gerente: "MANAGER",
    manager: "MANAGER",
    empleado: "EMPLOYEE",
  };
  const roleKey = q.toLowerCase() as keyof typeof roleMap;
  const role = roleMap[roleKey];

  const employees = await prisma.employee.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: q,
            mode: "insensitive",
          },
        }, 
        {
          user: {
            email: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
        ...(role
          ? [
              {
                user: {
                  role: {
                    name: {
                      equals: role,
                    },
                  },
                },
              },
            ]
          : []),
      ],
    },
    include: {
      user: {
        select: {
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    q,
    employees: employees.map((employee) => ({
      id: employee.id,
      type: "employee",
      label: `${employee.firstName} ${employee.lastName}`,
      suffix: employee.user.email,
      to: `/dashboard/employees/employee/${employee.id}`,
      icon: "i-lucide-user",
      meta: {
        role: employee.user.role.name,
        position: employee.position,
        status: employee.isActive ? "Activo" : "Inactivo",
      },
    })),
    patients: [],
    appointments: [],
    actions: getQuickActions(q),
  };
});

function getQuickActions(q: string) {
  const actions = [
    {
      id: "new-employee",
      type: "action",
      label: "Agregar empleado",
      suffix: "Crear nuevo empleado",
      to: "/dashboard/employees/new",
      icon: "i-lucide-user-plus",
    },
    {
      id: "new-patient",
      type: "action",
      label: "Agregar paciente",
      suffix: "Crear nuevo paciente",
      to: "/dashboard/patients/new",
      icon: "i-lucide-user-round-plus",
    },
  ];

  if (!q) return actions;

  return actions.filter((action) =>
    action.label.toLowerCase().includes(q.toLowerCase()),
  );
}
