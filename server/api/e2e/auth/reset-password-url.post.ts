export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === "production") {
    throw createError({ statusCode: 404 });
  }

  const body = await readBody<{ email?: string }>(event);

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "EMAIL_REQUIRED",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "USER_NOT_FOUND",
    });
  }

  const token = await createPasswordResetToken(user.id);

  const resetUrl = `${
    getRequestURL(event).origin
  }/reset-password?token=${token}`;

  return {
    url: resetUrl,
  };
});