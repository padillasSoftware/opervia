<script setup lang="ts" generic="T">
import type { TableColumn } from "@nuxt/ui";

const props = defineProps<{
  data: T[];
  columns: TableColumn<T>[];
  total: number;
  page: number;
  pageSize: number;
  search?: string;
  dataTestId?: string;
  inputDataTestId?: string;
  loading: boolean; 
}>();

const route = useRoute();
const router = useRouter();

const globalFilter = ref(props.search ?? "");

watch(
  () => props.search,
  (value) => {
    globalFilter.value = value ?? "";
  },
);

const updateQuery = (query: Record<string, string | number | undefined>) => {
  router.push({
    query: {
      ...route.query,
      ...query,
    },
  });
};

const updatePage = (page: number) => {
  updateQuery({
    page,
    limit: props.pageSize,
  });
};

watch(globalFilter, (value) => {
  updateQuery({
    page: 1,
    limit: props.pageSize,
    search: value.trim() || undefined,
  });
});
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex px-4 py-3.5 border-b border-accented">
      <UInput
        v-model="globalFilter"
        class="max-w-sm"
        placeholder="Buscar..."
        :data-testid="inputDataTestId"
      />
    </div>

    <UTable
      :data="data"
      :columns="columns"
      :data-testid="dataTestId"
      :loading="loading"
      class="flex-1"
    />

    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
        :page="page"
        :items-per-page="pageSize"
        :total="total"
        show-edges
        active-color="primary"
        active-variant="outline"
        @update:page="updatePage"
      />
    </div>
  </div>
</template>