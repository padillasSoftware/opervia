import z from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "../../../../prisma/generated/client";

const employeeBodySchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es requerido"),
  lastName: z.string().trim().min(1, "El apellido es requerido"),
  position: z.string().trim().min(1, "El puesto es requerido"),
  email: z.string().trim().email("Correo electrónico inválido"),
  role: z.string().trim().min(1, "El rol es requerido"),
  centerId: z.string().trim().min(1, "El centro es requerido"),
  salary: z.coerce.number().min(1, "El salario no puede ser menor a 1."),
  hireDate: z.string().nonempty("La fecha de contratación es requerida."),
});

export default defineEventHandler(async (event) => {

    console.log(event)
  // if (process.env.PLAYWRIGHT !== "true") {
  //   throw createError({ statusCode: 404 });
  // }
  try {


    const body = await readValidatedBody(event, employeeBodySchema.parse);
    console.log(body);
    const {
      firstName,
      lastName,
      position,
      email,
      role,
      centerId,
      salary,
      hireDate: hireDateBody,
    } = body;

    const passwordHash = await bcrypt.hash('TempPassword123!', 10);
    const hireDate = new Date(`${hireDateBody}T12:00:00.000Z`);
    console.log(hireDate)
    const employee = await prisma.$transaction(async (tx) => {
      const roleDB = await tx.role.findUniqueOrThrow({
        where: {
          name: role,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          centerId,
          roleId: roleDB.id,
          passwordHash,
        },
      });

      return tx.employee.create({
        data: {
          firstName,
          lastName,
          position,
          centerId,
          salary,
          hireDate,
          fullName: `${firstName} ${lastName}`,
          userId: user.id,
        },
      });
    });

    return responseHandler("EMPLOYEE_CREATED", "EMPLOYEE_CREATED", employee.id);
  } catch (error: unknown) {

    if (error instanceof z.ZodError) {
      return createError({
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
        return createError({
          statusCode: HttpStatus.CONFLICT,
          statusMessage: "DUPLICATED_EMAIL",
          data: {
            code: "DUPLICATED_EMAIL",
          },
        });
      }
    }

    return error;
  }
});
