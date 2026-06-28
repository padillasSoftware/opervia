export const useEmployees = async () => {
const route = useRoute();

  const page = computed(() => {
    const pageParam = route.query.page as string;
    return isNaN(+pageParam) ? 1 : +pageParam;
  });

  const limit = computed(() => {
    const limitParam = route.query.limit as string;
    return isNaN(+limitParam) ? 10 : +limitParam;
  });

  const offset = computed(() => {
    return (page.value - 1) * limit.value;
  });

  const { data, error, status, execute, pending } = await useFetch(
    '/api/admin/employeesList',
    {
        query: { limit, offset },
        watch: [page, limit]
    },
  );


  return {
    data,
    employees: computed(() => data.value?.data.employees || []),
    totalPages: computed(() => data.value?.data.pagination.totalPages || 0),
    currentPage: computed(() => data.value?.data.pagination.currentPage || 1),
    total: computed(() => data.value?.data.pagination.total || 0),
    perPage: computed(() => data.value?.data.pagination.perPage || 10),

    error,
    status,
    execute,
    pending,
  };
};