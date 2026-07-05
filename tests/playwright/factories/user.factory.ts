// tests/playwright/factories/user.factory.ts
export type FirstLoginUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
  role: string;
  salary: number;
  hireDate: string;
  centerId: string;
};

export const UserFactory = {
  firstLoginUser(): FirstLoginUser {
    const id = crypto.randomUUID();

    return {
      email: `first-login.${id}@maelmar.test`,
      password: "TempPassword123!",
      firstName: "First",
      lastName: "Login",
      position: "THERAPISTH",
      role: "EMPLOYEE",
      salary: 1500,
      hireDate: '2020-07-04',
      centerId: process.env.QA_CENTER_ID!,
    };
  },

  validPassword() {
    return `Password${Date.now()}!`;
  },
};
