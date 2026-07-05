export default defineNuxtRouteMiddleware(async (to) => {
  const { fetch, loggedIn, user } = useUserSession();

  await fetch();

  const allowedRoles = to.meta.roles as string[] | undefined;

  if (!allowedRoles?.length) return;

  if (!loggedIn.value) {
    return navigateTo("/signin");
  }

  if (!user.value?.role || !allowedRoles.includes(user.value.role)) {
    return createError({
      statusCode: HttpStatus.FORBIDDEN,
      status: HttpStatus.FORBIDDEN,
      message: getErrorMessage("FORBIDDEN"),
      statusMessage: getErrorMessage("FORBIDDEN"),
      stack: process.env.STAGE !== "prod" ? new Error().stack : "",
    });
  }
});