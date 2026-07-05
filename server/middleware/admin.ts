
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin')) return;

  const session = await requireUserSession(event);
  const rolesAllowed = ['SUPER_ADMIN', 'MANAGER'];

  if (!rolesAllowed.includes(session.user.role)) {
    throw createError({
      statusCode: HttpStatus.FORBIDDEN,
      statusMessage: 'Forbidden',
      message: 'Forbidden',
    });
  }
});