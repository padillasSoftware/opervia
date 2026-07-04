export const useEmployees = async () => {
  const route = useRoute();

  const page = computed(() => {
    const pageParam = route.query.page as string;
    return Number.isNaN(Number(pageParam)) ? 1 : Number(pageParam);
  });

  const limit = computed(() => {
    const limitParam = route.query.limit as string;
    return Number.isNaN(Number(limitParam)) ? 10 : Number(limitParam);
  });

  const search = computed(() => {
    return ((route.query.search as string) || "").trim();
  });

  const { data, error, status, execute, pending, refresh } = await useFetch<ApiResponse<{
    employees: Employee[];
    pagination: Pagination;
  }>>(
    "/api/admin/employeesList",
    {
      query: {
        page,
        limit,
        search,
      },
      watch: [page, limit, search],
    },
  );

  return {
    data,
    employees: computed(() => data.value?.data.employees || []),
    totalPages: computed(() => data.value?.data.pagination.totalPages || 0),
    currentPage: computed(() => data.value?.data.pagination.currentPage || 1),
    total: computed(() => data.value?.data.pagination.total || 0),
    perPage: computed(() => data.value?.data.pagination.perPage || 10),
    search,
    error,
    status,
    execute,
    pending,
    refresh,
  };
};