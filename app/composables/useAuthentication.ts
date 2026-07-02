import type { ApiError } from "~~/shared/types/error";

export const useAuthentication = () => {
  const { loggedIn, session, user, clear, fetch } = useUserSession();

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const result = await $fetch<LoginResponse>("/api/auth/signin", {
        method: "POST",
        body: { email, password },
      });

      await fetch();

     if( result.data?.user.lastLoginAt === null ) {
        await navigateTo('/first-login', {replace: true})
        return result;
     }
      await navigateTo('/dashboard', {replace: true})
      return result;
    } catch (error) {
      const err = error as { data?: ApiError };

      return {
        statusCode: err.data?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        data: err.data?.data,
        error: getErrorMessage(
          err.data?.data?.code as string
        ),
      };
    }
  };

  const logout = async () => {
    await clear();
    await navigateTo("/signin");
  };

const me = async () => {
      try {
      const result = await $fetch<AuthResponse>("/api/auth/me", {
        method: "GET"
      });

      await fetch();

      return result;
    } catch (error) {
      const err = error as { data?: ApiError };

      return {
        statusCode: err.data?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        data: err.data?.data,
        error: getErrorMessage(
          err.data?.data?.code as string
        ),
      };
    }
}

  return {
    loggedIn,
    session,
    user,
    isAuthenticated: loggedIn,
    fetch,
    login,
    logout,
    me
  };
};