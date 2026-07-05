
import { responseHandler } from '../../../../shared/utils/responseHandler';

export default defineEventHandler(async (event) => {
  const { user: loggedUser } = await requireUserSession(event);
  const rolesAllowed = ["SUPER_ADMIN", "MANAGER"];
  if (!rolesAllowed.includes(loggedUser.role)) {
    throw errorHandler(
      HttpStatus.FORBIDDEN,
      HttpStatus.FORBIDDEN,
      "FORBIDDEN",
      "Forbidden",
    );
  }

  const id = getRouterParam(event, "id") as string;

  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (!employee) {
    throw createError({
      statusCode: 404,
      statusMessage: "EMPLOYEE_NOT_FOUND",
      message: "Employee Not found",
    });
  }

  if (loggedUser.role !== "SUPER_ADMIN" && employee.centerId !== loggedUser.centerId) {
    throw errorHandler(
      HttpStatus.FORBIDDEN,
      HttpStatus.FORBIDDEN,
      "FORBIDDEN",
      "Forbidden",
    );
  }

  if (employee.userId === loggedUser.id) {
    throw createError({
      statusCode: HttpStatus.BAD_REQUEST,
      statusMessage: "CANNOT_DEACTIVATE_SELF",
      message: "No puedes desactivar tu propio usuario.",
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.employee.update({
      where: {
        id,
      },
      data: {
        isActive: employee.isActive ? false : true,
      },
    });

    await tx.user.update({
      where: {
        id: employee.userId,
      },
      data: {
        isActive: employee.isActive ? false : true,
      },
    });
  });

  return responseHandler("Success", "success", employee.id);
});
