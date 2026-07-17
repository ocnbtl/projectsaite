import "server-only";

import { Resend } from "resend";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  inquiry: z.enum([
    "Modeling",
    "Face Painting",
    "Content Creation",
    "Travel Collaborations",
    "Something else",
  ]),
  message: z.string().trim().min(20).max(5000),
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

let resendClient: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function deliverContactMessage(input: ContactInput) {
  const resend = getResend();
  if (!resend) return { configured: false as const };

  const to = process.env.CONTACT_TO_EMAIL ?? "contact@sageburress.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Sage Burress Website <website@sageburress.com>";
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New ${input.inquiry} inquiry from ${input.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#3a322b">
        <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6f7a5a">Sage Burress website inquiry</p>
        <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400">${escapeHtml(input.inquiry)}</h1>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <div style="margin-top:24px;padding:24px;background:#f6f1e7;border-left:3px solid #c08552">${safeMessage}</div>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return { configured: true as const, id: data?.id };
}
