import z from "zod";
import bcrypt from "bcryptjs";
import { Prisma } from "../../../../prisma/generated/client";
import { emailService } from "../../../services/";

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
  try {
    const { user: loggedUser } = await getUserSession(event);

    if (!loggedUser) {
      throw errorHandler(
        HttpStatus.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
        "UNAUTHORIZED",
        "Unauthorized",
      );
    }

    const body = await readValidatedBody(event, employeeBodySchema.parse);

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

    const temporaryPassword = generateSecurePassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    const hireDate = new Date(`${hireDateBody}T12:00:00.000Z`);
    const config = useRuntimeConfig();

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
          userId: user.id,
        },
      });
    });

    await emailService.sendWelcomeEmail({
      to: email,
      name: `${firstName} ${lastName}`,
      temporaryPassword,
      loginUrl: `${config.appUrl}/signin`,
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
    console.log(error)
  }
});
