<script setup lang="ts">
definePageMeta({
  layout: "auth-layout",
  middleware: ["reset-password"]
});

const route = useRoute()
const isLoading = ref(false)
const toast = useToast()

const token = route.query.token as string

const handleSubmit = async (payload: {
  password: string
  confirmPassword: string
}) => {
  isLoading.value = true

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'PATCH',
      body: {
        token,
        ...payload
      }
    })

    toast.add({
      title: 'Contraseña restablecida',
      description: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
      color: 'success'
    })

    await navigateTo('/login')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <SharedPasswordForm
    title="Restablecer contraseña"
    description="Crea una nueva contraseña para tu cuenta."
    submit-label="Restablecer contraseña"
    :loading="isLoading"
    @submit="handleSubmit"
  />
</template>