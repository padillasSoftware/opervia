<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  middleware: ["role"],
  roles: ["SUPER_ADMIN", "MANAGER"],
});

const employeeToDeactivate = ref<Employee | null>(null);
const isDeactivateModalOpen = ref(false);
const isDeactivating = ref(false);

const UBadge = resolveComponent("UBadge");
// const UAvatar = resolveComponent('UAvatar');
const NuxtLink = resolveComponent("NuxtLink");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");

const toast = useToast();
const { employees, total, currentPage, perPage, pending } = await useEmployees();
const { updateEmployeeStatus } = await useEmployeeStatus();
const title = ref("");
const subtitle = ref("");
const color = ref<
  "error" | "success" | "primary" | "warning" | "neutral" | undefined
>(undefined);
const label = ref("");
const icon = ref("");
const confirmationModal = ref({
  title: "",
  description: "",
  confirmLabel: "",
  confirmColor: "error" as
    | "error"
    | "success"
    | "primary"
    | "warning"
    | "neutral",
  icon: "",
});

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
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: "end",
          },
          items: getRowItems(row.original),
          "aria-label": "Actions dropdown",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions dropdown",
          }),
      );
    },
  },
];

function getRowItems(employee: Employee) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      type: "separator",
    },
    {
      label: "Ver empleado",
      icon: "i-lucide-eye",
      to: `/dashboard/employees/employee/${employee.id}`,
    },
    {
      label:
        employee.status === "Activo"
          ? "Desactivar Empleado"
          : "Activar Empleado",
      icon:
        employee.status === "Activo"
          ? "i-lucide-user-x"
          : "i-lucide-user-check",
      color: employee.status === "Activo" ? "error" : "success",
      onSelect() {
        openDeactivateModal(employee);
      },
    },
  ];
}

const openDeactivateModal = (employee: Employee) => {
  employeeToDeactivate.value = employee;

  confirmationModal.value =
    employee.status === "Activo"
      ? {
          title: "¿Desactivar empleado?",
          description: `El empleado ${employee.name} perderá el acceso al sistema y dejará de aparecer como activo. Su historial permanecerá disponible y podrá reactivarse en cualquier momento.`,
          confirmLabel: "Desactivar empleado",
          confirmColor: "error",
          icon: "i-lucide-user-x",
        }
      : {
          title: "¿Activar empleado?",
          description: `El empleado ${employee.name} retomará el acceso al sistema y volverá a aparecer como activo.`,
          confirmLabel: "Activar empleado",
          confirmColor: "success",
          icon: "i-lucide-user-check",
        };
  title.value =
    employee.status === "Activo"
      ? "¿Desactivar empleado?"
      : "¿Activar empleado?";
  subtitle.value =
    employee.status === "Activo"
      ? `El empleado ${employee.name} perderá el acceso al sistema y dejará de aparecer como activo. Su historial permanecerá disponible.`
      : `El empleado ${employee.name} retomara el acceso al sistema y empezará de aparecer como activo.`;

  color.value = employee.status === "Activo" ? "error" : "success";
  label.value =
    employee.status === "Activo" ? "Desactivar Empleado" : "Activar Empleado";
  icon.value =
    employee.status === "Activo" ? "i-lucide-user-x" : "i-lucide-user-check";
  isDeactivateModalOpen.value = true;
};

const deactivateEmployeeData = async () => {
  isDeactivating.value = true;
  if (!employeeToDeactivate.value) return;

  const result = await updateEmployeeStatus(employeeToDeactivate.value!.id);

  if (result.statusCode !== HttpStatus.OK) {
    toast.add({
      title: "No se pudo desactivar el empleado",
      description: result.error,
      color: "error",
      icon: "i-lucide-circle-x",
    });

    return;
  }

  const isActive = employeeToDeactivate.value.status === "Activo";

  toast.add({
    title: isActive ? "Empleado desactivado" : "Empleado activado",
    description: isActive
      ? `${employeeToDeactivate.value.name} fue desactivado correctamente.`
      : `${employeeToDeactivate.value.name} fue activado correctamente.`,
    color: "success",
    icon: "i-lucide-circle-check",
  });

  isDeactivateModalOpen.value = false;
  isDeactivating.value = false;

  await refreshNuxtData();
};
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
        data-testid="add-employee-button"
      />
    </div>

    <ClientOnly>
      <SharedTable
        :data="employees"
        :columns="productColumns"
        :total="total"
        :page="currentPage"
        :page-size="perPage"
        :loading="pending"
        data-test-id="employees-table"
        input-data-test-id="employees-search-input"
      />
      <SharedConfirmationModal
        v-model="isDeactivateModalOpen"
        :title="confirmationModal.title"
        :description="confirmationModal.description"
        :confirm-label="confirmationModal.confirmLabel"
        :confirm-color="confirmationModal.confirmColor"
        :icon="confirmationModal.icon"
        :loading="isDeactivating"
        @confirm="deactivateEmployeeData"
      />
    </ClientOnly>
  </div>
</template>
