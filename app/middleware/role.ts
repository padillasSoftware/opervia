export default defineNuxtRouteMiddleware((to) => {
  const { user } = useUserSession();

  const allowedRoles = to.meta.roles as string[] | undefined;

  if (!allowedRoles?.length) return;

  if (!user.value?.role || !allowedRoles.includes(user.value.role)) {
    return navigateTo("/dashboard");
  }
});