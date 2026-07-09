import bcrypt from "bcryptjs";
import z from "zod";
import { Prisma } from "../../../prisma/generated/client";
import {
  STRONG_PASSWORD_MESSAGE,
  isStrongPassword,
} from "#shared/utils/password";

const passwordSchema = z.string().refine(isStrongPassword, {
  message: STRONG_PASSWORD_MESSAGE,
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const { password } = await readValidatedBody(
    event,
    z
      .object({
        password: passwordSchema,
      })
      .parse,
  );

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
