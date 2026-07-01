import bcrypt from "bcryptjs";
import { Prisma } from "../../../prisma/generated/client";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw errorHandler(
      HttpStatus.UNAUTHORIZED,
      HttpStatus.UNAUTHORIZED,
      "UNAUTHORIZED",
      "Unauthorized",
    );
  }
  const { password } = await readBody(event);

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
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

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        passwordHash,
      },
    });
  } catch (error) {
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
  }

  return {
    status: HttpStatus.OK,
    statusCode: HttpStatus.OK,
    data: {},
  };
});
