export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated } = useAuthentication();

  if (!isAuthenticated.value) {
    return navigateTo("/signin");
  }

  if(to.path === '/') {
    return navigateTo("/dashboard")
  }
  //   if (to.path.startsWith("/dashboard") && !isAdmin) {
  //     return abortNavigation();
  //   }
});