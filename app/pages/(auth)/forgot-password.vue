<script setup lang="ts">
definePageMeta({
  layout: "auth-layout"
});


const isLoading = ref(false);

const form = reactive({
  email: "",
});

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    await $fetch("/api/auth/forgot-password", {
      method: "PATCH",
      body: form,
    });

    // Mostrar toast
  } finally {
    isLoading.value = false;
    await navigateTo("/signin", { replace: true })
  }
};
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-md items-center px-4">
    <UCard class="w-full">
      <div class="mb-8 text-center">
        <UIcon
          name="i-lucide-mail-search"
          class="mx-auto mb-4 size-12 text-primary"
        />

        <h1 class="text-3xl font-bold">¿Olvidaste tu contraseña?</h1>

        <p class="mt-3 text-muted">
          No te preocupes. Ingresa el correo electrónico asociado a tu cuenta y
          te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField label="Correo electrónico" name="email">
          <UInput
            v-model="form.email"
            type="email"
            icon="i-lucide-mail"
            placeholder="correo@empresa.com"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" block :loading="isLoading">
          Enviar enlace de recuperación
        </UButton>
      </form>

      <UDivider class="my-6" />

      <div class="text-center">
        <NuxtLink to="/signin" class="text-sm text-primary hover:underline">
          ← Volver al inicio de sesión
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
