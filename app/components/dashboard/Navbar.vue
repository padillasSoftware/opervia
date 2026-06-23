<script setup lang="ts">
const { logout } = useAuthentication();

const breadcrumbItems = [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
  },
  {
    label: "Inicio",
    icon: "i-lucide-house",
  },
];
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
</script>

<template>
  <div class="border-b border-default bg-primary/10 sticky top-0 z-10">
    <div class="flex items-center justify-between px-6 py-4">

              <UDashboardSidebarCollapse
        color="primary"
        variant="ghost"
      />
        <!-- Left Side: Breadcrumb or Title -->
      <div class="flex-1">
        <UBreadcrumb
          :items="breadcrumbItems"
          :ui="{ list: 'text-sm font-medium' }"
        />
      </div>

      <!-- Right Side: Actions and User Menu -->
      <div class="flex items-center gap-4 ms-auto">

      <UColorModeButton />

        <!-- Notification Bell -->
        <UButton
          icon="i-lucide-bell"
          color="neutral"
          variant="ghost"
          square
          class="h-8 w-8"
        />

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
                size: 'sm'
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
