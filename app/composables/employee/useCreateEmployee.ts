export const useCreateEmployee = () => {
  const createEmployee = async (data: Partial<Employee>) => {
    try {
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
    createEmployee,
  };
};