export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetch } = useAuthentication();
  const { user } = useUserSession();

  await fetch();

  const isSigninRoute = to.path.startsWith("/signin");

  if (!isAuthenticated.value) {
    return;
  }

  const lastLoginAt = user.value?.lastLoginAt ?? null;

  if (isSigninRoute && lastLoginAt === null) {
    return navigateTo("/first-login", { replace: true });
  }

  if (isSigninRoute && lastLoginAt !== null) {
    return navigateTo("/dashboard", { replace: true });
  }
});