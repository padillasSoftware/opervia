export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated } = useAuthentication();

  if (!isAuthenticated.value) {
    return navigateTo("/signin");
  }

  //   if (to.path.startsWith("/dashboard") && !isAdmin) {
  //     return abortNavigation();
  //   }
});