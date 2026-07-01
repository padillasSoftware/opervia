export default defineNuxtRouteMiddleware( async (to) => {

  const { isAuthenticated, fetch } = useAuthentication();

  const {user} = useUserSession();
  // const notAuthenticatedRoutes = ['/login','/register']
  await fetch()

  console.log(user);
  if (isAuthenticated.value  && to.path.startsWith('/signin') && user.value?.lastLoginAt !== null) {
    return navigateTo('/dashboard', {replace: true});
  }

  if(isAuthenticated.value  && to.path.startsWith('/signin') && user.value?.lastLoginAt === null) {
    return navigateTo('/first-login', {replace: true});
  }
});