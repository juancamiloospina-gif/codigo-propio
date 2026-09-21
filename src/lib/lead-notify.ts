import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { calculateTco, prospectSchema, SAAS_TOOLS } from "@/lib/ip-vault";

// Este es el destino real de los leads: syncLead() (ip-vault-admin.ts) solo escribe
// en el localStorage del navegador del prospecto, así que /admin nunca ve un lead
// ajeno. Este server function es el que de verdad saca el dato de esa máquina.
const DEFAULT_LEAD_NOTIFY_TO = "juancamilo@cupperlab.com";

const leadNotifyInput = z.object({
  event: z.enum(["boveda_abierta", "cita_agendada"]),
  company: z.string().trim().min(1).max(80),
  domain: z.string().max(160),
  outboundKey: z.string().max(400),
  prospect: prospectSchema,
  selected: z.array(z.string()).max(SAAS_TOOLS.length),
  users: z.number().int().min(1).max(1000),
  years: z.number().int().min(1).max(10),
  appointment: z
    .object({
      startsAt: z.string().datetime(),
      timezone: z.string().min(1).max(100),
    })
    .nullable(),
});

export const notifyLead = createServerFn({ method: "POST" })
  .validator(leadNotifyInput)
  .handler(async ({ data }) => {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      // Sin API key de envío no hay forma de mandar el correo. Lo dejamos en el log
      // del servidor en vez de fallar en silencio, para que se note en producción.
      console.warn(
        `[ip-vault] RESEND_API_KEY no configurada. Lead sin enviar: ${data.company} (${data.prospect.email})`,
      );
      return { sent: false as const };
    }

    const tco = calculateTco(data);
    const subject =
      data.event === "cita_agendada"
        ? `Cita agendada — ${data.company}`
        : `Bóveda abierta — ${data.company}`;

    const lines = [
      data.event === "cita_agendada" ? "Se confirmó una cita." : "Se abrió una bóveda nueva.",
      "",
      `Empresa: ${data.company}`,
      `Dominio: ${data.domain || "sin dominio"}`,
      `Contacto: ${data.prospect.name} (${data.prospect.role})`,
      `Correo: ${data.prospect.email}`,
      `Teléfono: ${data.prospect.phone}`,
      `Usuarios: ${data.users}`,
      `Herramientas seleccionadas: ${data.selected.join(", ") || "ninguna"}`,
      `TCO SaaS a 5 años: ${Math.round(tco.saasFiveYear).toLocaleString("es-ES")} USD`,
      `Coste de desarrollo propio: ${Math.round(tco.development).toLocaleString("es-ES")} USD`,
      data.appointment
        ? `Cita: ${data.appointment.startsAt} (${data.appointment.timezone})`
        : "Sin cita agendada todavía.",
      `Clave de campaña: ${data.outboundKey || "sin outboundKey"}`,
    ];

    const from = process.env["LEAD_NOTIFY_FROM"] ?? "IP Vault <onboarding@resend.dev>";
    const to = process.env["LEAD_NOTIFY_TO"] ?? DEFAULT_LEAD_NOTIFY_TO;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text: lines.join("\n"),
        }),
      });
      if (!response.ok) {
        console.error(
          "[ip-vault] Resend respondió con error",
          response.status,
          await response.text(),
        );
        return { sent: false as const };
      }
      return { sent: true as const };
    } catch (error) {
      console.error("[ip-vault] Fallo al enviar el lead por correo", error);
      return { sent: false as const };
    }
  });
