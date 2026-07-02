export default defineNuxtRouteMiddleware((to) => {
  const { user } = useUserSession();

  const allowedRoles = to.meta.roles as string[] | undefined;

  if (!allowedRoles?.length) return;

  if (!user.value?.role || !allowedRoles.includes(user.value.role)) {
    return createError({
        statusCode: HttpStatus.FORBIDDEN,
        status: HttpStatus.FORBIDDEN,
        message: getErrorMessage("FORBIDDEN"),
        statusMessage: getErrorMessage("FORBIDDEN"),
        stack: process.env.STAGE !== "prod" ? new Error().stack : ""
    })
    return navigateTo("/dashboard");
  }
});