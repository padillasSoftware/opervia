<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

const UBadge = resolveComponent("UBadge");
// const UAvatar = resolveComponent('UAvatar');
const NuxtLink = resolveComponent("NuxtLink");

const { employees } = await useEmployees();

const productColumns: TableColumn<Employee>[] = [

  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const employeeName = row.getValue("name");
      const employeeId = row.original.id;
      return h(
        NuxtLink,
        {
          class: "text-blue-500 hover:text-blue-700 underline cursor-pointer",
          to: `/dashboard/employees/employee/${employeeId}`,
        },
        () => employeeName,
      );
    },
  },
  {
    accessorKey: "email",
    header: "Correo Electronico",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => getRoleName(row.getValue("role")),
  },
  {
    accessorKey: "position",
    header: "Puesto",
    cell: ({ row }) => getPositionName(row.getValue("position")),
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return h(
        UBadge,
        {
          color: status === "Activo" ? "success" : "neutral",
          variant: "outline",
        },
        () => status,
      );
    },
  },
];
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Action Button -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Empleados
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona y organiza tus empleados
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Agregar Empleado"
        color="primary"
        size="lg"
        :to="`/dashboard/employees/employee/new`"
      />
    </div>

    <ClientOnly>
      <SharedTable :data="employees" :columns="productColumns" />
    </ClientOnly>
  </div>
</template>
