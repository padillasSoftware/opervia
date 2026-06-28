import z from "zod";
import { responseHandler } from '../../../../shared/utils/responseHandler';

const employeeBodySchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es requerido"),
  lastName: z.string().trim().min(1, "El apellido es requerido"),

  position: z.string().trim().min(1, "El puesto es requerido"),

  email: z.string().trim().email("Correo electrónico inválido"),
  role: z.string().trim().min(1, "El rol es requerido"),
  centerId: z.string().trim().min(1, "El centro es requerido"),
  salary: z.coerce.number().min(1, "El salario no puede ser menor a 1."),
  hireDate: z.string().nonempty("La fecha de contratación es requerida."),
  password: z
    .string("La contraseña es requerida")
    .min(8, "La contraseña debe de tener al menos 8 caracteres"),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as string;
  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request",
      message: "There is not data inside the body",
    });
  }

  let dataString = "";

  for (const part of formData) {
    if (part.name === "data" && part.data) {
      dataString = part.data.toString("utf-8");
    }
  }

  const body = employeeBodySchema.safeParse(JSON.parse(dataString));

  if (!body.success)
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request",
      message: "There is not data inside the body",
      data: body.error,
    });

  const {
    firstName,
    email,
    lastName,
    position,
    role,
    centerId,
    salary,
    hireDate: hireDateBody,
  } = body.data;

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
      data: body.error,
    });

  const roleDB = await prisma.role.findUniqueOrThrow({
    where: {
      name: role,
    },
  });

  const hireDate = new Date(`${hireDateBody}T12:00:00.000Z`);

  await prisma.$transaction(async (tx) => {
    await tx.employee.update({
      where: {
        id: id,
      },
      data: {
        firstName,
        lastName,
        position,
        centerId,
        salary,
        hireDate,
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

  return responseHandler("Success", "success", employee.id)

});
