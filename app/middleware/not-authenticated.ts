export default defineNuxtRouteMiddleware( async (to) => {

  const { isAuthenticated, fetch } = useAuthentication();

  // const notAuthenticatedRoutes = ['/login','/register']
  await fetch()

  if (isAuthenticated.value  && to.path.startsWith('/signin')) {
    return navigateTo('/dashboard', {replace: true});
  }
});