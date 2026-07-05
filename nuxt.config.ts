// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  css: ["@/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit", "zod"],
    },
  },
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24, // 1 day
      cookie: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpSecure: process.env.SMTP_SECURE,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromName: process.env.SMTP_FROM_NAME,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    appUrl: process.env.APP_URL,

    public: {},
  },
});
