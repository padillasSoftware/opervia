export const TestUsers = {
  admin: {
    email: requiredEnv("SUPERADMIN_EMAIL"),
    password: requiredEnv("SUPERADMIN_PASSWORD"),
  },
} as const;

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}