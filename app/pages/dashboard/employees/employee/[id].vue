<script setup lang="ts">
import * as z from "zod";
import type { SelectItem } from "@nuxt/ui";


definePageMeta({
  middleware: ["role"],
  roles: ["SUPER_ADMIN", "MANAGER"],
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { user } = useUserSession();

const rawId = route.params.id as string;
const {
  data: product,
  error,
  pending,
  createOrUpdate,
} = await useEmployee(rawId);

if (error.value) {
  console.log(error.value);
}

const isCreating = computed(() => rawId === "new");
const newProduct = ref<EmployeeDto | null>({ ...product.value } as EmployeeDto);
const isSubmitting = ref(false);
const fieldErrors = ref<Record<string, string>>({});
const pageTitle = computed(() =>
  isCreating.value ? "Crear Empleado" : "Editar Empleado",
);
const subtitle = computed(() =>
  isCreating.value
    ? "Completa el formulario para agregar a un nuevo empleado"
    : "Actualiza la información del empleado seleccionado",
);

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

const productSchema = z.object({
  firstName: z.string().nonempty("El nombre es requerido."),
  lastName: z.string().nonempty("El apellido es requerido."),
  role: z.string().nonempty("El rol es requerido."),
  position: z.string().nonempty("La posición es requerida."),
  salary: z.coerce.number().min(1, "El salario no puede ser menor a 1."),
  hireDate: z.string().nonempty("La fecha de contratación es requerida."),
  email: z.email("El correo electronico es requerido."),
});

const checkValidations = () => {
  fieldErrors.value = {};

  const result = productSchema.safeParse(newProduct.value);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];

      if (typeof field === "string") {
        fieldErrors.value[field] = issue.message;
      }
    });

    return false;
  }

  // Si quieres, aquí puedes sobreescribir newProduct con los valores parseados
  // newProduct.value = result.data;

  return true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  if (!newProduct.value) return;

  const isFormValid = checkValidations();

  if (!isFormValid) {
    isSubmitting.value = false;
    return;
  }

  newProduct.value.centerId = user.value?.centerId ?? "";
  const result = await createOrUpdate(newProduct.value);

  if (result.statusCode === HttpStatus.OK) {
    toast.add({
      title:
        newProduct.value?.id === ""
          ? "Empleado creado correctamente."
          : "Empleado actualizado correctamente.",
      description: `El empleado ${newProduct.value.firstName} ${newProduct.value.lastName} se actualizó correctamente.`,
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

watch(newProduct, checkValidations, { deep: true });
</script>
<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div
      v-if="pending"
      class="rounded-lg border border-gray-200 bg-white p-6 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-primary/10 dark:text-gray-300"
    >
      Cargando Empleado...
    </div>

    <div
      v-else-if="!isCreating && !newProduct"
      class="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
    >
      No encontramos el empleado solicitado.
    </div>
    <div class="mb-8 text-center">
  <h1 class="text-5xl font-bold">
    {{ pageTitle }}
  </h1>

  <p class="mt-2 text-lg text-muted">
    {{ subtitle }}
  </p>
</div>
    <!-- <UPageSection
  :title="pageTitle"
  :description="subtitle"
  orientation="vertical"
  :ui="{
    root: 'py-0',
    container: 'py-0'
  }"
> -->
      <div v-if="newProduct" class="space-y-6">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <div class="space-y-2">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-200"
                  for="employee-salary"
                >
                  Correo Electronico
                </label>
                <input
                  id="employee-salary"
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
                for="employee-fisrtName"
              >
                Nombre(s)
              </label>
              <input
                id="employee-fisrtName"
                v-model="newProduct.firstName"
                type="text"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-2 shadow-2xl focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                  fieldErrors.firstName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
                ]"
                placeholder="ejemplo-producto"
                autocomplete="off"
              >
              <p v-if="fieldErrors.firstName" class="text-sm text-red-600">
                {{ fieldErrors.firstName }}
              </p>
            </div>

            <div class="space-y-2">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-200"
                for="product-name"
              >
                Nombre
              </label>
              <input
                id="product-name"
                v-model="newProduct.lastName"
                type="text"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                  fieldErrors.lastName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700',
                ]"
                placeholder="Nombre del producto"
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
              <USelect
                id="employee-role"
                v-model="newProduct.role"
                value-key="id"
                :items="roles"
                class="w-48"
                placeholder="Selecciona un Rol.."
                :class="[
                  'block w-full rounded-md bg-white px-3 py-2 shadow-2xl focus:outline-none dark:bg-primary/10 dark:text-gray-100',
                  fieldErrors.firstName
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
                  for="employee-hiredDate"
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

        <!-- <section
        v-if="!isCreating && product"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-primary/10"
      >
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Metadatos
        </h2>
        <dl class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="space-y-1">
            <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Creado
            </dt>
            <dd class="text-gray-900 dark:text-gray-100">
              {{ longDateTimeFormat(new Date(product?.)) }}
            </dd>
          </div>
          <div class="space-y-1">
            <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Actualizado
            </dt>
            <dd class="text-gray-900 dark:text-gray-100">
              {{ longDateTimeFormat(new Date(product?.updatedAt)) }}
            </dd>
          </div>
        </dl>
      </section> -->
      </div>
    <!-- </UPageSection> -->
  </div>
</template>
