<template>
  <UDashboardGroup>
    <DashboardSidebar />

    <UDashboardPanel>
      <DashboardNavbar />

      <div class="flex-1 overflow-auto px-6 py-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>