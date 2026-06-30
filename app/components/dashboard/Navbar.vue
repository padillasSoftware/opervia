<script setup lang="ts">
const { logout } = useAuthentication();


const userMenuItems = [
  [
    {
      label: "Perfil",
      icon: "i-lucide-user",
      to: "#",
    },
    {
      label: "Preferencias",
      icon: "i-lucide-settings",
      to: "#",
    },
  ],
  [
    {
      label: "Cerrar sesión",
      icon: "i-lucide-log-out",
      class: "cursor-pointer",
      onSelect: () => {
        logout();
      },
    },
  ],
];
const isOpen = ref(false)
const searchTerm = ref("")

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearchDialog();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const { data: searchResults, status } = useFetch("/api/search/searchGlobal", {
  query: {
    q: searchTerm,
  },
  server: false,
  watch: [searchTerm],
})

const items = computed(() => {
  const results = searchResults.value

  if (!results) return []

  return [
    ...(results.actions || []),
    ...(results.employees || []),
    ...(results.patients || []),
    ...(results.appointments || []),
  ]
})

function openSearchDialog() {
  isOpen.value = true
}

function closeSearch() {
  isOpen.value = false
  searchTerm.value = ""
}



</script>

<template>
  <div class="border-b border-default bg-primary/10 sticky top-0 z-10">
    <div class="flex items-center justify-between px-6 py-4">
      <UDashboardSidebarCollapse color="primary" variant="ghost" />
      <UDashboardSidebarToggle />


      <!-- Right Side: Actions and User Menu -->
      <div class="flex items-center gap-sm-6 ms-auto">
        <ClientOnly>
          <UModal
            v-model:open="isOpen"
            :ui="{
              content:
                'max-w-2xl p-0 rounded-3xl overflow-hidden bg-white dark:bg-gray-950 shadow-2xl',
            }"
          >
            <UDashboardSearchButton
              :kbds="['meta', 'K']"
              @click="openSearchDialog"
            />

            <template #content>
              <div class="p-4">
                <div class="flex items-center gap-3 px-3 py-2">
                  <UIcon name="i-lucide-search" class="size-7 text-gray-400" />

                  <UInput
                    v-model="searchTerm"
                    autofocus
                    variant="none"
                    placeholder="Buscar en Maelmar..."
                    class="flex-1"
                    :ui="{
                      base: 'text-2xl bg-transparent border-0 ring-0 focus:ring-0',
                    }"
                  />
                </div>

                <div
                  v-if="searchTerm.trim().length >= 1"
                  class="mt-3 border-t border-gray-200 dark:border-gray-800 pt-3"
                >
                  <div
                    v-if="status === 'pending'"
                    class="px-4 py-6 text-gray-400"
                  >
                    Buscando...
                  </div>

                  <div v-else-if="items.length" class="space-y-1">
                    <NuxtLink
                      v-for="item in items"
                      :key="`${item.type}-${item.id}`"
                      :to="item.to"
                      class="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900"
                      @click="closeSearch"
                    >
                      <UIcon :name="item.icon" class="size-5 text-gray-400" />

                      <div class="min-w-0 flex-1">
                        <p class="truncate font-medium">
                          {{ item.label }}
                        </p>
                        <p class="truncate text-sm text-gray-500">
                          {{ item.suffix }}
                        </p>
                      </div>
                    </NuxtLink>
                  </div>

                  <div v-else class="px-4 py-6 text-gray-400">
                    Sin resultados
                  </div>
                </div>
              </div>
            </template>
          </UModal>
        </ClientOnly>
        <UColorModeButton />


        <!-- Divider -->
        <USeparator orientation="vertical" class="h-6" />

        <!-- User Dropdown Menu -->
        <UDropdownMenu
          :items="userMenuItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            :avatar="{
              src: 'https://github.com/benjamincanac.png',
              loading: 'lazy' as const,
              size: 'sm',
            }"
            color="neutral"
            variant="ghost"
            trailing-icon="i-lucide-chevron-down"
            class="cursor-pointer"
          />
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>
