<script setup lang="ts" generic="T">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";

const table = useTemplateRef("table");

defineProps<{
  data: T[];
  columns: TableColumn<T>[];
}>();

const pagination = ref({
  pageIndex: 0,
  pageSize: 5,
});

const globalFilter = ref("");
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex px-4 py-3.5 border-b border-accented">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Buscar Empleado..." />
    </div>

    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:global-filter="globalFilter"
      :data="data"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      class="flex-1"
    />

    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        show-edges
        active-color="primary"
        active-variant="outline"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
