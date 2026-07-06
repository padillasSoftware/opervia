export default defineNuxtRouteMiddleware(async (to) => {
  const { fetch, loggedIn, user } = useUserSession();

  await fetch();

  if (!loggedIn.value) {
    return navigateTo("/signin");
  }

  if (to.path === "/dashboard" && user.value?.lastLoginAt === null) {
    return navigateTo("/first-login");
  }

  if (to.path === "/" && user.value?.lastLoginAt === null) {
    return navigateTo("/first-login");
  }

  if (to.path === "/first-login" && user.value?.lastLoginAt !== null) {
    return navigateTo("/dashboard");
  }
});
