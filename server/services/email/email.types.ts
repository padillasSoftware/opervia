// server/services/email/email.types.ts

export type SendEmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export type WelcomeEmailPayload = {
  to: string;
  name: string;
  temporaryPassword?: string;
  loginUrl: string;
};

export type ResetPasswordEmailPayload = {
  to: string;
  name: string;
  resetUrl: string;
};

export type AppointmentEmailPayload = {
  to: string;
  patientName: string;
  employeeName: string;
  appointmentDate: string;
  appointmentTime: string;
};