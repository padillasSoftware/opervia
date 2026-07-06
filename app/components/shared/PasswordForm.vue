<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  submitLabel?: string;
  loading?: boolean;
  passwordId?: string;
  confirmPasswordId?: string;
  buttonId?: string;
  passwordToggleButtonId?: string;
  confirmPasswordToggleButtonId?: string;
  displayBackLink?: boolean;
}>();

const emit = defineEmits<{
  submit: [
    payload: {
      password: string;
      confirmPassword: string;
    },
  ];
}>();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const wasSubmitted = ref(false);

const  { logout } = useAuthentication();
const form = reactive({
  password: "",
  confirmPassword: "",
});

const errors = reactive<{
  password?: string;
  confirmPassword?: string;
}>({
  password: undefined,
  confirmPassword: undefined,
});

const validatePassword = (password: string) => {
  if (!password) return "La contraseña es requerida.";
  if (password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password))
    return "Debe contener al menos una letra mayúscula.";
  if (!/[a-z]/.test(password))
    return "Debe contener al menos una letra minúscula.";
  if (!/[0-9]/.test(password)) return "Debe contener al menos un número.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Debe contener al menos un carácter especial.";

  return undefined;
};

const validateForm = () => {
  errors.password = validatePassword(form.password);

  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirma tu contraseña.";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  } else {
    errors.confirmPassword = undefined;
  }

  return !errors.password && !errors.confirmPassword;
};

const handleSubmit = () => {
  wasSubmitted.value = true;

  if (!validateForm()) return;

  emit("submit", {
    password: form.password,
    confirmPassword: form.confirmPassword,
  });
};

watch(form, () => {
  if (wasSubmitted.value) validateForm();
});

const passwordRequirements = computed(() => [
  {
    id: "min-length",
    label: "Al menos 8 caracteres",
    valid: form.password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Una letra mayúscula",
    valid: /[A-Z]/.test(form.password),
  },
  {
    id: "lowercase",
    label: "Una letra minúscula",
    valid: /[a-z]/.test(form.password),
  },
  {
    id: "number",
    label: "Un número",
    valid: /\d/.test(form.password),
  },
  {
    id: "special",
    label: "Un carácter especial",
    valid: /[^A-Za-z0-9]/.test(form.password),
  },
]);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

<template>
  <div class="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
    <UCard class="w-full">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold">
          {{ title ?? "Establece tu nueva contraseña" }}
        </h1>

        <p class="mt-2 text-sm text-muted">
          {{
            description ??
            "Crea una nueva contraseña segura antes de continuar."
          }}
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <UFormField label="Nueva contraseña" :error="errors.password">
          <UInput
            :id="passwordId"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Ingresa tu nueva contraseña"
            icon="i-lucide-key-round"
            class="w-full"
          >
            <template #trailing>
              <UButton
                :id="passwordToggleButtonId"
                type="button"
                color="neutral"
                variant="ghost"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="togglePassword"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField
          label="Confirmar contraseña"
          :error="errors.confirmPassword"
        >
          <UInput
            :id="confirmPasswordId"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirma tu nueva contraseña"
            icon="i-lucide-key-round"
            class="w-full"
          >
            <template #trailing>
              <UButton
                :id="confirmPasswordToggleButtonId"
                type="button"
                color="neutral"
                variant="ghost"
                size="sm"
                :icon="
                  showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                "
                @click="toggleConfirmPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <div class="rounded-lg bg-muted/40 p-4">
          <p class="mb-3 font-medium text-sm">Requisitos de la contraseña</p>

          <ul class="space-y-2">
            <li
              v-for="rule in passwordRequirements"
              :key="rule.id"
              :data-testid="`password-requirement-${rule.id}`"
              :data-valid="rule.valid"
              class="flex items-center gap-2 transition-all"
              :class="rule.valid ? 'text-success' : 'text-muted'"
            >
              <UIcon
                :name="
                  rule.valid ? 'i-lucide-check-circle-2' : 'i-lucide-circle'
                "
                class="size-5"
              />

              {{ rule.label }}
            </li>
          </ul>
        </div>

        <UButton
          :id="buttonId"
          type="submit"
          block
          :loading="loading"
          :disabled="loading"
        >
          {{ submitLabel ?? "Continuar" }}
        </UButton>
      </form>
      <USeparator class="my-6" />

      <div v-if="displayBackLink">
        <NuxtLink
          id="back-link"          
          class="text-sm text-primary hover:underline"
          @click.prevent="logout"
        >
          ← Volver al inicio de sesión
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
