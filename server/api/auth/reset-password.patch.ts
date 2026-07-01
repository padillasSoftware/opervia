import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { token, password } = await readBody(event)

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  })

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El enlace no es válido o ya expiró.'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    })
  ])

  return {
    statusCode: 200,
    message: 'Contraseña actualizada correctamente.'
  }
})