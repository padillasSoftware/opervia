export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);

  if (!user) {
    throw errorHandler(
      HttpStatus.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      "UNAUTHORIZED",
      "Unauthorized",
    );
  }

  const query = getQuery(event);

  let limit = Number(query.limit ?? 10);
  let page = Number(query.page ?? 1);
  const search = String(query.search ?? "").trim();

  limit = Number.isNaN(limit) || limit < 1 ? 10 : limit;
  page = Number.isNaN(page) || page < 1 ? 1 : page;
  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;

  const where = {
    centerId: user.centerId,
    ...(search
      ? {
          OR: [
            {
              fullName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              position: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              user: {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              user: {
                role: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [employeesList, total] = await Promise.all([
    prisma.employee.findMany({
      where,
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
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.employee.count({
      where,
    }),
  ]);

  const employees = employeesList.map((employee) => ({
    id: employee.id,
    name: employee.fullName,
    role: employee.user.role.name,
    position: employee.position,
    email: employee.user.email,
    status: employee.isActive ? "Activo" : "Inactivo",
  }));

  return {
    statusCode: HttpStatus.OK,
    data: {
      employees,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    },
  };
});