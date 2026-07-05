<script setup lang="ts">
import * as z from "zod";
import type { SelectItem } from "@nuxt/ui";

definePageMeta({
  middleware: ["role"],
  roles: ["SUPER_ADMIN", "MANAGER"],
});

const { createEmployee } = useCreateEmployee();

const router = useRouter();
const toast = useToast();
const { user } = useUserSession();

const emptyEmployee: EmployeeDto = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  position: undefined,
  salary: 0,
  hireDate: "",
  centerId: "",
  status: "",
  password: "",
};

const newProduct = ref<EmployeeDto>({ ...emptyEmployee });
const isSubmitting = ref(false);
const fieldErrors = ref<Record<string, string>>({});

const roles = ref<SelectItem[]>([
  {
    label: "Super Administrador",
    id: "SUPER_ADMIN",
  },
  {
    label: "Administrador",
    id: "MANAGER",
  },
  {
    label: "Empleado",
    id: "EMPLOYEE",
  },
]);

const positions = getPositionOptions();

const requiredString = (message: string) =>
  z.preprocess((value) => value ?? "", z.string().trim().nonempty(message));

const productSchema = z.object({
  firstName: requiredString("El nombre es requerido."),
  lastName: requiredString("El apellido es requerido."),
  role: requiredString("El rol es requerido."),
  position: requiredString("La posición es requerida."),
  salary: z.coerce.number().min(1, "El salario no puede ser menor a 1."),
  hireDate: requiredString("La fecha de contratación es requerida."),
  email: requiredString("El correo electronico es requerido.").pipe(
    z.email("El correo electronico no es válido."),
  ),
});

const hasSubmitted = ref(false);

const checkValidations = () => {
  const result = productSchema.safeParse(newProduct.value);

  if (!result.success) {
    if (hasSubmitted.value) {
      fieldErrors.value = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (typeof field === "string") {
          fieldErrors.value[field] = issue.message;
        }
      });
    }

    return false;
  }

  fieldErrors.value = {};
  return true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  hasSubmitted.value = true;

  if (!newProduct.value) return;

  const isFormValid = checkValidations();

  await nextTick();

  if (!isFormValid) {
    isSubmitting.value = false;
    return;
  }

  newProduct.value.centerId = user.value?.centerId ?? "";
  const result = await createEmployee(newProduct.value);

  if (result.statusCode === HttpStatus.OK) {
    toast.add({
      title: "Empleado creado correctamente.",
      description: `El empleado ${newProduct.value.firstName} ${newProduct.value.lastName} se creó correctamente.`,
    });

    router.replace(`/dashboard/employees/employee/${result.data}`);
  } else {
    toast.add({
      title: "Error al guardar el empleado",
      description:
        result.error ?? "Verifica la información e inténtalo nuevamente.",
      color: "error",
    });
  }

  isSubmitting.value = false;
};

const handleCancel = () => {
  navigateTo("/dashboard/employees");
};

watch(
  newProduct,
  () => {
    if (hasSubmitted.value) {
      checkValidations();
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-5">
    <div class="mb-8 text-center">
      <h1 class="text-5xl font-bold">Crear Empleado</h1>

      <p class="mt-2 text-lg text-muted">
        Completa el formulario para agregar a un nuevo empleado
      </p>
    </div>
    <div v-if="newProduct" class="space-y-6">
      <form
        id="employee-create-form"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-200"
                for="employee-email"
              >
                Correo Electronico
              </label>
              <input
                id="employee-email"
                v-model="newProduct.email"
                type="text"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
                ]"
                placeholder="ejemplo@text.com"
              >
              <p v-if="fieldErrors.email" class="text-sm text-red-600">
                {{ fieldErrors.email }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-2">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-200"
              for="employee-firstName"
            >
              Nombre(s)
            </label>
            <input
              id="employee-firstName"
              v-model="newProduct.firstName"
              type="text"
              :class="[
                'block w-full rounded-md bg-white px-3 py-2 shadow-2xl focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                fieldErrors.firstName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
              ]"
              placeholder="Nombre del empleado"
              autocomplete="off"
            >
            <p v-if="fieldErrors.firstName" class="text-sm text-red-600">
              {{ fieldErrors.firstName }}
            </p>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-200"
              for="employee-lastName"
            >
              Apellido(s)
            </label>
            <input
              id="employee-lastName"
              v-model="newProduct.lastName"
              type="text"
              :class="[
                'block w-full rounded-md bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                fieldErrors.lastName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
              ]"
              placeholder="Apellido del empleado"
              autocomplete="off"
            >
            <p v-if="fieldErrors.lastName" class="text-sm text-red-600">
              {{ fieldErrors.lastName }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-2">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-200"
              for="employee-role"
            >
              Rol
            </label>
            <!-- <select
              id="employee-role"
              v-model="newProduct.role"
              :class="[
                'block w-full rounded-md bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                fieldErrors.role
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
              ]"
            >
              <option disabled value="">Selecciona un Rol..</option>

              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.label }}
              </option>
            </select> -->

            <USelect
              id="employee-role"
              v-model="newProduct.role"
              value-key="id"
              :items="roles"
              class="w-48"
              placeholder="Selecciona un Rol.."
              :class="[
                'block w-full rounded-md bg-white px-3 py-2 shadow-2xl focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                fieldErrors.role
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
              ]"
            />
            <p v-if="fieldErrors.role" class="text-sm text-red-600">
              {{ fieldErrors.role }}
            </p>
          </div>

          <div class="space-y-2">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-200"
              for="employee-position"
            >
              Posicion
            </label>
            <USelect
              id="employee-position"
              v-model="newProduct.position"
              value-key="id"
              :items="positions"
              class="w-48"
              placeholder="Selecciona una Posición.."
              :class="[
                'block w-full rounded-md bg-white px-3 py-2 shadow-2xl focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                fieldErrors.position
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
              ]"
            />
            <p v-if="fieldErrors.position" class="text-sm text-red-600">
              {{ fieldErrors.position }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-200"
                for="employee-salary"
              >
                Salario (entero)
              </label>
              <input
                id="employee-salary"
                v-model.number="newProduct.salary"
                type="number"
                min="0"
                step="1"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                  fieldErrors.salary
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
                ]"
                placeholder="0"
              >
              <p v-if="fieldErrors.salary" class="text-sm text-red-600">
                {{ fieldErrors.salary }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-200"
                for="employee-hireDate"
              >
                Fecha de Contratación
              </label>
              <input
                id="employee-hireDate"
                v-model="newProduct.hireDate"
                type="date"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                  fieldErrors.hireDate
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
                ]"
              >
              <p v-if="fieldErrors.hireDate" class="text-sm text-red-600">
                {{ fieldErrors.hireDate }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <UButton
            id="employee-save-button"
            type="submit"
            color="primary"
            variant="solid"
            :disabled="isSubmitting"
            :class="isSubmitting ? 'cursor-progress' : 'cursor-pointer'"
            icon="i-lucide-save"
          >
            {{ isSubmitting ? "Guardando..." : "Guardar empleado" }}
          </UButton>
          <UButton
            id="employee-cancel-button"
            type="button"
            color="neutral"
            variant="outline"
            icon="i-lucide-x"
            class="cursor-pointer"
            @click="handleCancel"
          >
            Cancelar
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
