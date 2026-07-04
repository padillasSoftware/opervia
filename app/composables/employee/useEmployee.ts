import type { ApiResponse } from "~~/shared/types/auhtresponse";

export const useEmployee = async (id: string) => {
  const { data, error, status, execute, refresh, pending } = await useFetch(
    `/api/admin/employee/${id}`,
  );

  const updateEmployee = async (employee: Partial<Employee>) => {
    try {
      const { data: updatedId, statusCode } = await $fetch<ApiResponse<string>>(
        `/api/admin/employee/${id}`,
        {
          method: "PATCH",
          body: employee,
        },
      );

      // await refresh();

      return {
        statusCode,
        data: updatedId,
        error: "",
      };
    } catch (error) {
      const err = error as { data?: ApiError };
      const errMessage = getErrorMessage(err.data?.data?.code as string);

      return {
        statusCode: err.data?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        data: err.data?.data,
        error: errMessage,
      };
    }
  };

  const deactivateEmployee = async () => {
    try {
      const { data: updatedId, statusCode } = await $fetch<ApiResponse<string>>(
        `/api/admin/employee/${id}`,
        {
          method: "DELETE",
        },
      );

      await refresh();

      return {
        statusCode,
        data: updatedId,
        error: "",
      };
    } catch (error) {
      const err = error as { data?: ApiError };
      const errMessage = getErrorMessage(err.data?.data?.code as string);

      return {
        statusCode: err.data?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        data: err.data?.data,
        error: errMessage,
      };
    }
  };

  return {
    data,
    updateEmployee,
    deactivateEmployee,
    error,
    status,
    execute,
    pending,
    refresh,
  };
};
