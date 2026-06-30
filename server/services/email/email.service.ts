// server/services/email/email.service.ts

import nodemailer from "nodemailer";
import {
  appointmentCreatedTemplate,
  resetPasswordTemplate,
  welcomeTemplate,
} from "./email.templates";
import type {
  AppointmentEmailPayload,
  ResetPasswordEmailPayload,
  SendEmailPayload,
  WelcomeEmailPayload,
} from "./email.types";

const getTransporter = () => {
  const config = useRuntimeConfig();

  console.log({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpSecure === "true",
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: config.smtpSecure === "true",
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });
};

export const emailService = {
  async send(payload: SendEmailPayload) {
    const config = useRuntimeConfig();
    const transporter = getTransporter();

    const fromName = config.smtpFromName;
    const fromEmail = config.smtpFromEmail;

    return await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(payload.to) ? payload.to.join(",") : payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
  },

  async sendWelcomeEmail(payload: WelcomeEmailPayload) {
    return await this.send({
      to: payload.to,
      subject: "Bienvenido a Maelmar",
      html: welcomeTemplate({
        name: payload.name,
        loginUrl: payload.loginUrl,
        temporaryPassword: payload.temporaryPassword,
      }),
    });
  },

  async sendResetPasswordEmail(payload: ResetPasswordEmailPayload) {
    return await this.send({
      to: payload.to,
      subject: "Restablece tu contraseña",
      html: resetPasswordTemplate({
        name: payload.name,
        resetUrl: payload.resetUrl,
      }),
    });
  },

  async sendAppointmentCreatedEmail(payload: AppointmentEmailPayload) {
    return await this.send({
      to: payload.to,
      subject: "Tu cita fue agendada",
      html: appointmentCreatedTemplate({
        patientName: payload.patientName,
        employeeName: payload.employeeName,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
      }),
    });
  },
};