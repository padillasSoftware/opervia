import crypto from 'node:crypto'

export const createPasswordResetToken = async (userId: string) => {
  const token = crypto.randomBytes(32).toString('hex')

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15)
    }
  })

  return token
}