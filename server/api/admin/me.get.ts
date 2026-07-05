export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  return {
    statusCode: HttpStatus.OK,
    data: session.user,
    session
  };
});