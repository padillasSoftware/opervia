<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "auth-layout",
  middleware: "not-authenticated",
});

const toast = useToast();
const { login } = useAuthentication();

const cookieLoginEmail = useCookie<string | null>("login_email", {
  sameSite: "strict",
  maxAge: 60 * 60 * 24 * 30,
});

const isPosting = ref(false);
const showPassword = ref(false);

const state = reactive({
  email: cookieLoginEmail.value || "",
  password: "",
  remember: Boolean(cookieLoginEmail.value),
});

const schema = z.object({
  email: z.string().nonempty("Correo electronico requerido").email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
  remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { email, password, remember } = event.data;

  isPosting.value = true;

  try {
    cookieLoginEmail.value = remember ? email : null;

    const response = await login(email, password);

    if (response.statusCode !== 200) {
      toast.add({
        title: "Error al iniciar sesión",
        description: response.error,
        color: "error",
      });
    }
  } finally {
    isPosting.value = false;
  }
}

watch( () => state.email, (value) => console.log("EMAIL:", value ))
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
      <div class="mb-6 text-center">
        <h2 class="text-xl font-semibold">Iniciar sesión</h2>
        <p class="mt-1 text-sm text-muted">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Correo electrónico" name="email" required>
          <UInput
            id="signin-email-input"
            v-model="state.email"
            type="email"
            placeholder="Ingresa tu correo electrónico"
            autocomplete="email"
            class="w-full"
            :disabled="isPosting"
          />
        </UFormField>

        <UFormField label="Contraseña" name="password" required>
          <UInput
            id="signin-password-input"
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••••"
            autocomplete="current-password"
            class="w-full"
            :disabled="isPosting"
          >
            <template #trailing>
              <UButton
                id="signin-toggle-password-button"
                type="button"
                color="neutral"
                variant="ghost"
                size="xs"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                aria-label="Show password"
                @click="() => { showPassword = !showPassword }"
              />
            </template>
          </UInput>
        </UFormField>

        <UCheckbox
          id="signin-remember-checkbox"
          v-model="state.remember"
          label="Recuérdame"
          :disabled="isPosting"
        />

        <UButton
          id="signin-submit-button"
          type="submit"
          color="primary"
          block
          :loading="isPosting"
          :disabled="isPosting"
        >
          Iniciar sesión
        </UButton>
      </UForm>
    </UPageCard>

    <div class="flex flex-col items-center gap-2">
      <UButton
        id="signin-forgot-password-link"
        color="primary"
        variant="ghost"
        label="¿Olvidaste tu contraseña?"
        to="/forgot-password"
      />

      <p class="text-xs text-muted">© 2026 Maelmar</p>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
  layout: "auth-layout",
  middleware: "not-authenticated",
});

const toast = useToast();
const { login } = useAuthentication();

const cookieLoginEmail = useCookie<string | null>("login_email", {
  sameSite: "strict",
  maxAge: 60 * 60 * 24 * 30,
});

const isPosting = ref(false);

const state = reactive({
  email: cookieLoginEmail.value || "",
  password: "",
  remember: Boolean(cookieLoginEmail.value),
});

const fields = ref<AuthFormField[]>([
  {
    id: "signin-email-input",
    name: "email",
    type: "email",
    label: "Correo electrónico",
    placeholder: "Ingresa tu correo electrónico",
    required: true,
  },
  {
    id: "signin-password-input",
    name: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "••••••••••",
    required: true,
  },
  {
    id: "signin-remember-checkbox",
    name: "remember",
    label: "Recuérdame",
    type: "checkbox",
  },
]);

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
    cookieLoginEmail.value = remember ? email : null;

    const response = await login(email, password);

    if (response.statusCode !== 200) {
      toast.add({
        title: "Error al iniciar sesión",
        description: response.error,
        color: "error",
      });
    }
  } finally {
    isPosting.value = false;
  }
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :state="state"
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
    @submit="onSubmit"
  />
</template> -->