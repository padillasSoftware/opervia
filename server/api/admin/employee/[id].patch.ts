import z from "zod";
import { Prisma } from "../../../../prisma/generated/client";
import { responseHandler } from "../../../../shared/utils/responseHandler";

const employeeBodySchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es requerido"),
  lastName: z.string().trim().min(1, "El apellido es requerido"),
  position: z.string().trim().min(1, "El puesto es requerido"),
  email: z.string().trim().email("Correo electrónico inválido"),
  role: z.string().trim().min(1, "El rol es requerido"),
  salary: z.coerce.number().min(1, "El salario no puede ser menor a 1."),
  hireDate: z.string().nonempty("La fecha de contratación es requerida."),
});

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as string;

    const body = await readValidatedBody(event, employeeBodySchema.parse);

    const {
      firstName,
      email,
      lastName,
      position,
      role,
      salary,
      hireDate: hireDateBody,
    } = body;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw createError({
        statusCode: 404,
        statusMessage: "EMPLOYEE_NOT_FOUND",
        message: "Employee not found",
      });
    }

    const roleDB = await prisma.role.findUniqueOrThrow({
      where: {
        name: role,
      },
    });

    const hireDate = new Date(`${hireDateBody}T12:00:00.000Z`);

    await prisma.$transaction(async (tx) => {
      await tx.employee.update({
        where: { id },
        data: {
          firstName,
          lastName,
          position,
          salary,
          hireDate,
          fullName: `${firstName} ${lastName}`,
        },
      });

      await tx.user.update({
        where: {
          id: employee.userId,
        },
        data: {
          email,
          role: {
            connect: {
              id: roleDB.id,
            },
          },
        },
      });
    });

    return responseHandler("EMPLOYEE_UPDATED", "success", id);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: HttpStatus.BAD_REQUEST,
        statusMessage: "VALIDATION_ERROR",
        data: {
          code: "VALIDATION_ERROR",
          fields: z.treeifyError(error),
        },
      });
    }

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
});