import bcrypt from "bcryptjs";
import z from "zod";

const bodySchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .trim()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Email is not valid",
    }),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      role: true,
      employee: true,
      center: true,
    },
  });

  if (!user) {
    throw errorHandler(
      HttpStatus.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      "INVALID_CREDENTIALS",
      "Unauthorized",
    );
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);



  if (!isPasswordValid) {
    throw errorHandler(
      HttpStatus.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      "INVALID_CREDENTIALS",
      "Unauthorized",
    );
  }

  if (!user.isActive) {
    throw errorHandler(
      HttpStatus.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      "USER_DISABLED",
      "USER_DISABLED",
    );
  }

  const userSession = {
    id: user.id,
    email: user.email,
    roleId: user.role.id,
    role: user.role.name,
    centerId: user.center.id,
    centerName: user.center.name,
    employeeId: user.employee?.id,
    name: `${user.employee?.firstName} ${user.employee?.lastName}`,
    lastLoginAt: user.lastLoginAt ?? null,
  };

    await setUserSession(event, {
      user: userSession,
    });
  

  return {
    status: HttpStatus.OK,
    statusCode: HttpStatus.OK,
    data: {
      user: userSession,
    },
  };
});
