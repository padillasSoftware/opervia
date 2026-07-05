<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "auth-layout",
});

const toast = useToast();
const isLoading = ref(false);

const schema = z.object({
  email: z
    .string({
      error: "El correo electrónico es obligatorio.",
    })
    .trim()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Ingresa un correo electrónico válido."),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  email: "",
});

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true;

  try {
    await $fetch("/api/auth/forgot-password", {
      method: "PATCH",
      body: event.data,
    });

    toast.add({
      title: "Solicitud enviada",
      description:
        "Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.",
      color: "success",
      icon: "i-lucide-mail-check",
    });

    await navigateTo("/signin", { replace: true });
  } catch (error) {
    console.error(error);

    toast.add({
      title: "No fue posible procesar la solicitud",
      description:
        "Ocurrió un error inesperado. Inténtalo nuevamente en unos momentos.",
      color: "error",
      icon: "i-lucide-circle-x",
    });
  } finally {
    isLoading.value = false;
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

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="handleSubmit"
      >
        <UFormField label="Correo electrónico" name="email">
          <UInput
            id="forgot-password-email-input"
            v-model="state.email"
            type="text"
            icon="i-lucide-mail"
            placeholder="correo@empresa.com"
            class="w-full"
          />
        </UFormField>

        <UButton
          id="forgot-password-submit-button"
          type="submit"
          block
          :loading="isLoading"
        >
          Enviar enlace de recuperación
        </UButton>
      </UForm>

      <USeparator class="my-6" />

      <div class="text-center">
        <NuxtLink
          id="forgot-password-signin-link"
          to="/signin"
          class="text-sm text-primary hover:underline"
        >
          ← Volver al inicio de sesión
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
