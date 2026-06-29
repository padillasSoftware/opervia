
export const useEmployeeStatus = async () => {


  const updateEmployeeStatus = async (id: string) => {
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
    updateEmployeeStatus,
  };
};
