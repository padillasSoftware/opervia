import type { ApiResponse } from "~~/shared/types/auhtresponse";

export const useEmployee = async (id: string) => {
  const { data, error, status, execute, refresh, pending } = await useFetch(
    `/api/admin/employee/${id}`,
  );

  const createOrUpdate = async (data: Partial<Employee>) => {
    const isCreating = data.id === "";

    try {
      if (isCreating) {
        const { data: responseData, statusCode } = await $fetch<
          ApiResponse<{ id: string }>
        >("/api/admin/employee/", {
          method: "POST",
          body: data,
        });

        return {
          statusCode,
          data: responseData,
          error: "",
        };
      }
      const formData = new FormData();

      formData.append("data", JSON.stringify(data));
      const { data: updatedId, statusCode } = await $fetch(
        `/api/admin/employee/${id}`,
        {
          method: "PATCH",
          body: formData,
        },
      );

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
      const { data: updatedId, statusCode } = await $fetch(
        `/api/admin/employee/${id}`,
        {
          method: "DELETE",
        },
      );

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
    createOrUpdate,
    deactivateEmployee,
    error,
    status,
    execute,
    pending,
    refresh,
  };
};
