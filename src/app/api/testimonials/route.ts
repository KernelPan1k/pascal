import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit } from "@/utils/rateLimit";

const submitSchema = z.object({
  author: z.string().min(1).max(100),
  role: z.string().max(100).optional(),
  content: z.string().min(10).max(1000),
  honeypot: z.string().max(0).optional(),
  captchaA: z.number().int().min(1).max(9),
  captchaB: z.number().int().min(1).max(9),
  captchaAnswer: z.string(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    // Public: only approved
    const testimonials = await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  }

  // Admin: all
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } = checkRateLimit(`testimonial:${ip}`, 3, 60 * 60 * 1000); // 3 per hour
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de soumissions. Veuillez réessayer plus tard." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot check
  if (parsed.data.honeypot) {
    return NextResponse.json({ success: true }); // Silent reject for bots
  }

  // Math captcha check
  const { author, role, content, captchaA, captchaB, captchaAnswer } = parsed.data;
  if (parseInt(captchaAnswer, 10) !== captchaA + captchaB) {
    return NextResponse.json({ error: "Réponse incorrecte à la question de vérification." }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      author: author.trim(),
      role: role?.trim() || null,
      content: content.trim(),
      status: "PENDING",
    },
  });

  return NextResponse.json(testimonial, { status: 201 });
}
