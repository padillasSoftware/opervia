import { emailService } from "../../services/email/email.service";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
        employee: true,
    }
  });

  if (!user) {
    return {
      statusCode: 200,
      message: "Si el correo existe, enviaremos instrucciones.",
    };
  }

  const token = await createPasswordResetToken(user.id);

  const resetUrl = `${getRequestURL(event).origin}/reset-password?token=${token}`;

  // aquí mandas email con resetUrl

  await emailService.sendResetPasswordEmail({
    to: email,
    name: `${user.employee?.firstName} ${user.employee?.lastName}`,
    resetUrl,
  });

  return {
    statusCode: 200,
    message: "Si el correo existe, enviaremos instrucciones.",
  };
});
