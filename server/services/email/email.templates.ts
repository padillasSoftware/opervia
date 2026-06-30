// server/services/email/email.templates.ts

type Button = {
  label: string;
  href: string;
};

type BaseTemplateParams = {
  title: string;
  preview?: string;
  content: string;
  button?: Button;
};

const brand = {
  name: "Maelmar",
  bg: "#0f172a",
  topbar: "#26254f",
  card: "#111827",
  cardSoft: "#26254f",
  border: "#263249",
  text: "#f8fafc",
  muted: "#94a3b8",
  purple: "#a78bfa",
  blue: "#3b82f6",
  green: "#22c55e",
};

export const baseEmailTemplate = ({
  title,
  preview,
  content,
  button,
}: BaseTemplateParams) => {
  return `
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:${brand.bg};font-family:Arial,Helvetica,sans-serif;">
    ${preview ? `<div style="display:none">${preview}</div>` : ""}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.bg};padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;">

            <tr>
              <td style="background:${brand.topbar};border:1px solid ${brand.border};border-radius:18px 18px 0 0;padding:18px 24px;">
                <table width="100%">
                  <tr>
                    <td>
                      <div style="display:inline-block;width:34px;height:34px;border-radius:10px;background:${brand.purple};color:#0f172a;font-weight:800;font-size:20px;text-align:center;line-height:34px;">
                        O
                      </div>
                      <span style="color:${brand.text};font-size:20px;font-weight:800;margin-left:10px;vertical-align:middle;">
                        Maelmar
                      </span>
                    </td>
                    <td align="right" style="color:${brand.muted};font-size:13px;">
                      Maelmar Demo Center
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="background:${brand.card};border-left:1px solid ${brand.border};border-right:1px solid ${brand.border};border-bottom:1px solid ${brand.border};border-radius:0 0 18px 18px;padding:34px 32px;">
                <h1 style="margin:0 0 14px;color:${brand.text};font-size:28px;line-height:1.25;">
                  ${title}
                </h1>

                <div style="color:${brand.muted};font-size:15px;line-height:1.7;">
                  ${content}
                </div>

                ${
                  button
                    ? `
                    <div style="margin-top:28px;">
                      <a href="${button.href}" style="display:inline-block;background:${brand.purple};color:#0f172a;padding:13px 22px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:800;">
                        ${button.label}
                      </a>
                    </div>
                  `
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top:18px;color:${brand.muted};font-size:12px;line-height:1.6;">
                Este correo fue enviado automáticamente por Maelmar.<br />
                No respondas a este mensaje.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const infoBox = (content: string) => `
  <div style="background:${brand.cardSoft};border:1px solid ${brand.border};border-radius:14px;padding:16px;margin:20px 0;color:${brand.muted};">
    ${content}
  </div>
`;

export const temporaryPasswordBox = (password: string) => `
  <div style="background:#0b1220;border:1px solid ${brand.border};border-radius:16px;padding:18px;margin:20px 0;text-align:center;">
    <div style="font-size:12px;color:${brand.muted};margin-bottom:8px;">
      Contraseña temporal
    </div>
    <div style="font-size:24px;color:${brand.text};letter-spacing:1px;font-weight:800;">
      ${password}
    </div>
  </div>
`;

export const detailsTable = (rows: { label: string; value: string }[]) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${brand.border}; border-radius:14px; overflow:hidden; margin:20px 0;">
    ${rows
      .map(
        (row) => `
          <tr>
            <td style="padding:12px 14px; background:#f9fafb; color:${brand.muted}; font-size:13px; width:38%;">
              ${row.label}
            </td>
            <td style="padding:12px 14px; color:${brand.text}; font-size:14px; font-weight:600;">
              ${row.value}
            </td>
          </tr>
        `
      )
      .join("")}
  </table>
`;

export const welcomeTemplate = (params: {
  name: string;
  loginUrl: string;
  temporaryPassword?: string;
}) => {
  return baseEmailTemplate({
    title: `Bienvenido a Maelmar, ${params.name}`,
    preview: "Tu usuario ha sido creado correctamente.",
    button: {
      label: "Iniciar sesión",
      href: params.loginUrl,
    },
    content: `
      <p style="margin:0 0 14px;">
        Tu cuenta ha sido creada correctamente. Ya puedes ingresar al sistema para gestionar tus actividades.
      </p>

      ${
        params.temporaryPassword
          ? temporaryPasswordBox(params.temporaryPassword)
          : ""
      }

      ${infoBox(`
        <strong style="color:${brand.text};">Recomendación:</strong>
        <span style="color:${brand.muted};"> cambia tu contraseña después de iniciar sesión por primera vez.</span>
      `)}
    `,
  });
};

export const resetPasswordTemplate = (params: {
  name: string;
  resetUrl: string;
}) => {
  return baseEmailTemplate({
    title: "Restablecer contraseña",
    preview: "Usa este enlace para recuperar el acceso a tu cuenta.",
    button: {
      label: "Restablecer contraseña",
      href: params.resetUrl,
    },
    content: `
      <p style="margin:0 0 14px;">
        Hola <strong>${params.name}</strong>, recibimos una solicitud para restablecer tu contraseña.
      </p>

      ${infoBox(`
        <span style="color:#374151;">
          Si tú no solicitaste este cambio, puedes ignorar este correo.
        </span>
      `)}
    `,
  });
};

export const appointmentCreatedTemplate = (params: {
  patientName: string;
  employeeName: string;
  appointmentDate: string;
  appointmentTime: string;
}) => {
  return baseEmailTemplate({
    title: "Cita agendada",
    preview: "Tu cita fue registrada correctamente en Maelmar.",
    content: `
      <p style="margin:0 0 14px;">
        Hola <strong>${params.patientName}</strong>, tu cita fue agendada correctamente.
      </p>

      ${detailsTable([
        { label: "Paciente", value: params.patientName },
        { label: "Especialista", value: params.employeeName },
        { label: "Fecha", value: params.appointmentDate },
        { label: "Hora", value: params.appointmentTime },
      ])}
    `,
  });
};


export const ptoApprovedTemplate = (params: {
  employeeName: string;
  startDate: string;
  endDate: string;
}) => {
  return baseEmailTemplate({
    title: "Solicitud de vacaciones aprobada",
    preview: "Tu solicitud fue aprobada.",
    content: `
      <p style="margin:0 0 14px;">
        Hola <strong>${params.employeeName}</strong>, tu solicitud de vacaciones fue aprobada.
      </p>

      ${detailsTable([
        { label: "Inicio", value: params.startDate },
        { label: "Fin", value: params.endDate },
        { label: "Estado", value: "Aprobada" },
      ])}
    `,
  });
};