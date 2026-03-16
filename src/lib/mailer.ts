import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTestimonialNotification(data: {
  author: string;
  role?: string | null;
  content: string;
}) {
  const adminEmail = process.env.NOTIFY_EMAIL;
  if (!adminEmail || !process.env.SMTP_HOST) return;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminEmail,
    subject: `Nouveau témoignage de ${data.author}`,
    text: [
      `Auteur : ${data.author}`,
      data.role ? `Titre : ${data.role}` : null,
      ``,
      data.content,
      ``,
      `→ À modérer : ${process.env.NEXTAUTH_URL}/panneau/temoignages`,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  });
}
