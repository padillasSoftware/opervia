import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import z from "zod";
import {
  STRONG_PASSWORD_MESSAGE,
  isStrongPassword,
} from "#shared/utils/password";

const bodySchema = z.object({
  token: z.string().trim().min(1, "TOKEN_REQUIRED"),
  password: z.string().refine(isStrongPassword, {
    message: STRONG_PASSWORD_MESSAGE,
  }),
});

export default defineEventHandler(async (event) => {
  const { token, password } = await readValidatedBody(event, bodySchema.parse);

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: "El enlace no es válido o ya expiró.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    statusCode: 200,
    message: "Contraseña actualizada correctamente.",
  };
});
