export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, user } = useAuthentication();

  if (!isAuthenticated.value) {
    return navigateTo("/signin");
  }

  if((to.path === '/dashboard'  || to.path === '/') && user.value?.lastLoginAt === null) {
    return navigateTo("/first-login")
  }

  if((to.path === '/first-login'  || to.path === '/') && user.value?.lastLoginAt !== null) {
    return navigateTo("/dashboard")
  }
  //   if (to.path.startsWith("/dashboard") && !isAdmin) {
  //     return abortNavigation();
  //   }
});