// auth.d.ts
declare module '#auth-utils' {
  // Define the structure of your user object
  interface User {
      id: string;
      email: string;
      role: string;
      centerId: string;
      centerName: string;
      employeeId?: string;
      name: string;
  }
// Define any additional data you want to store in the session
  interface UserSession {
    user: User;
    // Add other session-specific data here if needed
  }

}

export {};