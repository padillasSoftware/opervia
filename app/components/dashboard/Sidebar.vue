<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { user } = useUserSession();
const route = useRoute();

const allItems = computed<SidebarItem[]>(() => [
  {
    label: "Inicio",
    icon: "i-lucide-house",
    to: "/dashboard",
    active: route.path === "/dashboard",
  },
  {
    label: "Empleados",
    icon: "lucide:users",
    to: "/dashboard/employees",
    active: route.path.startsWith("/dashboard/employees"),
    roles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    label: "Pacientes",
    icon: "lucide:users",
    to: "/dashboard",
    active: route.path.startsWith("/dashboard/patients"),
    roles: ["SUPER_ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "Centros",
    icon: "lucide:building-2",
    to: "/dashboard/centers",
    active: route.path.startsWith("/dashboard/centers"),
    roles: ["SUPER_ADMIN"],
  },
]);

const sidebarItems = computed<NavigationMenuItem[]>(() => {
  const role = user.value?.role;

  return allItems.value.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;

    return item.roles.includes(role);
  });
});


const items: NavigationMenuItem[][] = [
  [
    {
      label: "Inicio",
      icon: "i-lucide-house",
      to: "/dashboard",
      active: route.path === "/dashboard",
    },
    {
      label: "Empleados",
      icon: "lucide:users",
      to: "/dashboard/employees",
      active: route.path.startsWith("/dashboard/employees"),
    },
    {
      label: "Pacientes",
      icon: "lucide:users",
    },
    {
      label: "Centros",
      icon: "lucide:building-2",
    },
    {
      label: "Reportes",
      icon: "lucide:bar-chart-3",
    },
    {
      label: "Calendario",
      icon: "lucide:calendar-days",
    },
    {
      label: "Expedientes",
      icon: "lucide:folder",
    },
  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-templates/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
  ],
];
</script>

<template>
  <UDashboardSidebar
    collapsible
    :default-size="22"
    :collapsed-size="0"
    :ui="{ footer: 'border-t border-default' }"
  >
    <template #header="{ collapsed }">
      <UIcon name="i-lucide-orbit" class="size-8 text-primary" />
      <label v-if="!collapsed">Maelmar</label>
    </template>

    <template #default="{ collapsed }">
      <!-- <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed"
      >
        <template v-if="!collapsed" #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div>
        </template>
      </UButton> -->

      <UNavigationMenu
        :collapsed="collapsed"
        :items="sidebarItems"
        orientation="vertical"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <template #footer="{ collapsed }">
      <UUser
        to="https://github.com/benjamincanac"
        target="_blank"
        :name="collapsed ? '' : user?.name"
        :description="collapsed ? '' : getRoleName(user?.role)"
        :avatar="{
          src: 'https://github.com/benjamincanac.png',
        }"
      />
      <!-- <UButton
        :avatar="{
          src: 'https://github.com/benjamincanac.png',
          loading: 'lazy' as const,
        }"
        :label="collapsed && !user?.name ? undefined : user?.name"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      /> -->
    </template>
  </UDashboardSidebar>
</template>
