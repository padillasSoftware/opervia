<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
  middleware: ["reset-password"],
});

const route = useRoute();
const isLoading = ref(false);
const toast = useToast();

const token = route.query.token as string;

const handleSubmit = async (payload: {
  password: string;
  confirmPassword: string;
}) => {
  isLoading.value = true;

  try {
    await $fetch("/api/auth/reset-password", {
      method: "PATCH",
      body: {
        token,
        ...payload,
      },
    });

    toast.add({
      title: "Contraseña restablecida",
      description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
      color: "success",
    });

    await navigateTo("/signin");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <SharedPasswordForm
    title="Restablecer contraseña"
    description="Crea una nueva contraseña para tu cuenta."
    submit-label="Restablecer contraseña"
    :loading="isLoading"
    password-id="reset-password-password-input"
    confirm-password-id="reset-password-confirm-password-input"
    button-id="reset-password-submit-button"
    password-toggle-button-id="reset-password-toggle-password-button"
    confirm-password-toggle-button-id="reset-password-confirm-toggle-password-button"
    @submit="handleSubmit"
  />
</template>