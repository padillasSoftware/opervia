
import { responseHandler } from '../../../../shared/utils/responseHandler';


export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as string;


  const employee = await prisma.employee.findUnique({
    where: {
      id: id,
    },
  });

  if (!employee)
    throw createError({
      statusCode: 404,
      statusMessage: "Bad request",
      message: "Employee Not found",
    });

  await prisma.$transaction(async (tx) => {
    await tx.employee.update({
      where: {
        id: id,
      },
      data: {
        isActive: employee.isActive ? false : true
      },
    });

    await tx.user.update({
      where: {
        id: employee.userId,
      },
      data: {
        isActive: employee.isActive ? false : true
      },
    });
  });

  return responseHandler("Success", "success", employee.id)

});
