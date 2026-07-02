<!-- components/shared/ConfirmationModal.vue -->
<script setup lang="ts">
const open = defineModel<boolean>({ default: false });

defineProps<{
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
  confirmColor?: "primary" | "error" | "warning" | "success" | "neutral";
  loading?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

//Prueba de commit en el require-tests action
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <div class="p-6 space-y-6">
        <div class="flex items-start gap-4">
          <UIcon
            :name="icon ?? 'i-lucide-triangle-alert'"
            :class="[
              'size-10',
              {
                'text-error': confirmColor === 'error',
                'text-success': confirmColor === 'success',
                'text-warning': confirmColor === 'warning',
                'text-primary': confirmColor === 'primary',
                'text-neutral': confirmColor === 'neutral',
              },
            ]"
          />

          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>

            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ description }}
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="soft"
            :label="cancelLabel ?? 'Cancelar'"
            :disabled="loading"
            @click="() => { open = false }"
          />

          <UButton
            :color="confirmColor ?? 'error'"
            :loading="loading"
            :label="confirmLabel ?? 'Confirmar'"
            @click="emit('confirm')"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
