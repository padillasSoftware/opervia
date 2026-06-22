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
    },
  });

  if (!user) {
    throw errorHandler(HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS','Unauthorized');
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

  const userSession = {
    id: user.id,
    name: user.employee?.firstName + " " + user.employee?.lastName,
    email: user.email,
    roles: user.role.name,
  };

  await setUserSession(event, {
    user: userSession,
  });

  if (!isPasswordValid) {
    throw errorHandler(HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS','Unauthorized');
  }

  return {
    status: HttpStatus.OK,
    statusCode: HttpStatus.OK,
    data: {
      user: userSession,
    },
  };
});
