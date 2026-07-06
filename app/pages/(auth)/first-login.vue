<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
  middleware: ["authenticated"]
});
const isLoading = ref(false);
const toast = useToast();

const handleSubmit = async (payload: {
  password: string;
  confirmPassword: string;
}) => {
  isLoading.value = true;

  try {
    const { fetch } = useUserSession()
    await $fetch("/api/auth/updatePassword", {
      method: "PATCH",
      body: payload,
    });

    const result = await $fetch("/api/auth/updateLastLogIn", {
      method: "PATCH"
    });

    if (result.statusCode !== HttpStatus.OK) {
      throw new Error("Error al actualizar la fecha de último inicio de sesión");
    }

    toast.add({
      title: "Contraseña Actualizada",
      description: "Ahora puedes acceder al sistema.",
      color: "success",
    });

    await fetch()

    await navigateTo("/dashboard", { replace: true });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <SharedPasswordForm
    title="Establece tu nueva contraseña"
    description="Este es tu primer inicio de sesión. Por favor crea una nueva contraseña antes de continuar."
    submit-label="Continuar"
    :loading="isLoading"
    password-id="first-login-password-input"
    confirm-password-id="first-login-confirm-password-input"
    button-id="first-login-submit-button"
    password-toggle-button-id="first-login-toggle-password-button"
    confirm-password-toggle-button-id="first-login-toggle-confirm-password-button"
    :display-back-link="true"
    @submit="handleSubmit"
  />
</template>
