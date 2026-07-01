export default defineNuxtRouteMiddleware(async (to) => {
  const route = useRoute();
  const token = route.query.token as string;

  if (!token && to.path === "/reset-password") {
    return navigateTo("/signin");
  }
});
