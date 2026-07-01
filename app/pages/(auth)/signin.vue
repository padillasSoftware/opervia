<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
  layout: "auth-layout",
  middleware: "not-authenticated",
});

const toast = useToast();

const cookieLoginEmail = useCookie<string | null>("login_email", {
  sameSite: "strict",
  maxAge: 60 * 60 * 24 * 30,
});

const { login } = useAuthentication();
const isPosting = ref(false);

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Correo electrónico",
    placeholder: "Ingresa tu correo electrónico",
    required: true,
    defaultValue: cookieLoginEmail.value || "",
  },
  {
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "••••••••••",
    required: true,
  },
  {
    name: "remember",
    label: "Recuérdame",
    type: "checkbox",
    defaultValue: Boolean(cookieLoginEmail.value),
  },
];

const schema = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z.string("La contraseña es requerida"),
  remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { email, password, remember } = payload.data;

  isPosting.value = true;

  try {
    if (remember) {
      cookieLoginEmail.value = email;
    } else {
      cookieLoginEmail.value = null;
    }

    const response = await login(email, password);

    if (response.statusCode !== 200) {
      toast.add({
        title: "Error al iniciar sesión",
        description: response.error,
        color: "error",
      });

      return;
    }

  } finally {
    isPosting.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
    <div class="flex flex-col items-center gap-3">
      <div
        class="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20"
      >
        <UIcon name="i-lucide-orbit" class="size-8" />
      </div>

      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-highlighted">
          Maelmar
        </h1>
        <p class="mt-1 text-sm text-muted">
          Gestión inteligente para negocios de servicios
        </p>
      </div>
    </div>

    <UPageCard class="w-full max-w-lg">
      <UAuthForm
        :schema="schema"
        title="Iniciar sesión"
        description="Ingresa tus credenciales para acceder a tu cuenta."
        icon="i-lucide-user"
        :fields="fields"
        :loading="isPosting"
        :disabled="isPosting"
        :submit="{
          label: 'Iniciar sesión',
          color: 'primary',
          block: true,
        }"
        :ui="{
          leadingIcon: 'text-5xl',
        }"
        @submit="onSubmit"
      />
    </UPageCard>

    <div class="flex flex-col items-center gap-2">
      <UButton
        color="primary"
        variant="ghost"
        label="¿Olvidaste tu contraseña?"
        to="/forgot-password"
      />

      <p class="text-xs text-muted">© 2026 Maelmar</p>
    </div>
  </div>
</template>
