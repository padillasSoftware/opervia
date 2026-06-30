// server/api/email/send-test.post.ts

import { z } from "zod";
import { emailService } from "../../services/email/email.service";

const bodySchema = z.object({
  to: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const config = useRuntimeConfig();

  await emailService.sendWelcomeEmail({
    to: body.to,
    name: "Missael",
    temporaryPassword: "Temporal123!",
    loginUrl: `${config.appUrl}/signin`,
  });

  return {
    success: true,
    message: "Correo enviado correctamente",
  };
});