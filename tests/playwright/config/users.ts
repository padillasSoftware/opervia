export const TestUsers = {
  firstLoginUser: {
    email: requiredEnv("MANAGER_EMAIL"),
    password: requiredEnv("MANAGER_PASSWORD"),
    lastLoginAt: null,
  },
  activeUser: {
    email: requiredEnv("SUPERADMIN_EMAIL"),
    password: requiredEnv("SUPERADMIN_PASSWORD"),
    lastLoginAt: new Date()
  },
} as const;

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}