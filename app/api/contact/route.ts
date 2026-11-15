import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactPayload {
  services?: unknown;
  budget?: unknown;
  timeline?: unknown;
  description?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  website?: unknown; // honeypot
  elapsedMs?: unknown; // client-side time-trap
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const DEDUP_WINDOW_MS = 30 * 1000; // 30 seconds
const MIN_ELAPSED_MS = 1500; // 1.5 seconds

const ipRequests = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();
let cachedResend: { apiKey: string; client: Resend } | null = null;

function getResendClient(apiKey: string): Resend {
  if (!cachedResend || cachedResend.apiKey !== apiKey) {
    cachedResend = { apiKey, client: new Resend(apiKey) };
  }
  return cachedResend.client;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  if (ipRequests.size > 500) {
    for (const [key, timestamps] of ipRequests.entries()) {
      const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (fresh.length === 0) ipRequests.delete(key);
      else ipRequests.set(key, fresh);
    }
  }

  const existing = ipRequests.get(ip) ?? [];
  const recent = existing.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequests.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipRequests.set(ip, recent);
  return false;
}

function isDuplicateSubmission(key: string, now: number): boolean {
  if (recentSubmissions.size > 200) {
    for (const [entryKey, ts] of recentSubmissions.entries()) {
      if (now - ts >= DEDUP_WINDOW_MS) {
        recentSubmissions.delete(entryKey);
      }
    }
  }

  const lastTs = recentSubmissions.get(key);
  if (lastTs && now - lastTs < DEDUP_WINDOW_MS) {
    return true;
  }

  recentSubmissions.set(key, now);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asTrimmedString(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 12);
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  // 1. Honeypot & time-trap: silently accept bot submissions without sending mail
  const honeypot = asTrimmedString(body.website, 200);
  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (
    typeof body.elapsedMs === "number" &&
    Number.isFinite(body.elapsedMs) &&
    body.elapsedMs < MIN_ELAPSED_MS
  ) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = asTrimmedString(body.name, 120);
  const email = asTrimmedString(body.email, 160);
  const description = asTrimmedString(body.description, 4000);
  const budget = asTrimmedString(body.budget, 80);
  const timeline = asTrimmedString(body.timeline, 80);
  const phone = asTrimmedString(body.phone, 60);
  const company = asTrimmedString(body.company, 160);
  const services = asStringArray(body.services);

  if (name.length < 2 || !email || !description) {
    return NextResponse.json(
      { error: "Name, email, and project overview are required." },
      { status: 400 },
    );
  }

  if (description.length < 10) {
    return NextResponse.json(
      { error: "Please provide at least 10 characters in the project overview." },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const now = Date.now();
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp, now)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a few minutes and try again.",
        code: "RATE_LIMITED",
      },
      { status: 429 },
    );
  }

  const dedupKey = `${email.toLowerCase()}::${description.slice(0, 200)}`;
  if (isDuplicateSubmission(dedupKey, now)) {
    return NextResponse.json({ ok: true, deduplicated: true }, { status: 200 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    recentSubmissions.delete(dedupKey);
    return NextResponse.json(
      {
        error: "Email service is not configured yet (missing RESEND_API_KEY).",
        code: "MISSING_API_KEY",
      },
      { status: 503 },
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "hello.iamsebbi@gmail.com";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const servicesList = services.length > 0 ? services.join(", ") : "Not specified";

  const html = `
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #111; line-height: 1.6; max-width: 640px;">
      <h2 style="text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #ddd; padding-bottom: 8px;">
        New Project Inquiry — iamsebbi
      </h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
      <p><strong>Company / URL:</strong> ${escapeHtml(company || "—")}</p>
      <p><strong>Services:</strong> ${escapeHtml(servicesList)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(timeline || "Not specified")}</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
      <p><strong>Project Overview:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(description)}</p>
    </div>
  `;

  const text = [
    "New Project Inquiry — iamsebbi",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    `Company / URL: ${company || "—"}`,
    `Services: ${servicesList}`,
    `Budget: ${budget || "Not specified"}`,
    `Timeline: ${timeline || "Not specified"}`,
    "",
    "Project Overview:",
    description,
  ].join("\n");

  try {
    const resend = getResendClient(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `New Inquiry from ${name}${company ? ` (${company})` : ""}`,
      html,
      text,
    });

    if (error) {
      recentSubmissions.delete(dedupKey);
      return NextResponse.json(
        { error: error.message || "Failed to send message via Resend." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id }, { status: 200 });
  } catch {
    recentSubmissions.delete(dedupKey);
    return NextResponse.json(
      { error: "Unexpected error while sending message." },
      { status: 500 },
    );
  }
}
