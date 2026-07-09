import { Prisma } from "../../../prisma/generated/client";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      role: true,
      employee: true,
      center: true,
    },
  });

  if (!user) {
    throw errorHandler(
      HttpStatus.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      "NOT_FOUND",
      "NOT_FOUND",
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
    const userSession = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      centerId: user.center.id,
      centerName: user.center.name,
      employeeId: user.employee?.id,
      name: `${user.employee?.firstName} ${user.employee?.lastName}`,
      lastLoginAt: updatedUser.lastLoginAt ?? null,
    };

    await setUserSession(
      event,
      {
        user: userSession,
      },
      {
        maxAge: 60 * 60 * 24,
      },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw createError({
          statusCode: HttpStatus.CONFLICT,
          statusMessage: "DUPLICATED_EMAIL",
          data: {
            code: "DUPLICATED_EMAIL",
          },
        });
      }
    }

    throw error;
  }

  return {
    status: HttpStatus.OK,
    statusCode: HttpStatus.OK,
    data: {},
  };
});
