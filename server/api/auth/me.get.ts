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

  console.log(session)

  return {
    statusCode: HttpStatus.OK,
    data: session.user,
    session
  };
});