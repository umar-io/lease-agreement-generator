import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/app/lib/db";
import { leases } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {cloudinary} from "@/app/cloudinary";
import { z } from "zod";


const env = (() => {
  const schema = z.object({
    RESEND_API_KEY: z.string(),
    RESEND_FROM: z.string().email().optional(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
  });
  const result = schema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment:", result.error.format());

    if (process.env.NODE_ENV !== "production") {
      throw new Error("Invalid env");
    }
  }
  return result.success ? result.data : ({} as any);
})();


const EmailRequestSchema = z.object({
  tenantEmail: z.string().email(),
  tenantName: z.string().min(1),
  landlordName: z.string().min(1),
  pdfUrl: z.string().url(),
  leaseId: z.string().optional(),
});
type EmailRequest = z.infer<typeof EmailRequestSchema>;


async function fetchPdf(url: string): Promise<Buffer> {
 
  if (url.startsWith("data:application/pdf;base64,")) {
    const base64 = url.split(";base64,")[1];
    if (!base64) throw new Error("Malformed base64 data‑URL");
    return Buffer.from(base64, "base64");
  }

 
  try {
    return await fetchAndBuffer(url);
  } catch (firstErr) {
   
    if (!url.includes("cloudinary.com")) throw firstErr;
   
    const signed = cloudinary.getSignedUrl(url);
    if (!signed) {
      console.warn(
        "Unable to parse Cloudinary URL – falling back to original error",
      );
      throw firstErr;
    }
    return await fetchAndBuffer(signed);
  }
}


async function fetchAndBuffer(
  url: string,
  maxBytes = 10 * 1024 * 1024,
): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000); // 12 s

  const res = await fetch(url, {
    signal: controller.signal,
    headers: { "User-Agent": "LeaseManager/1.0 (+https://leezign.dev)" },
    redirect: "follow",
  });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch PDF (${res.status} ${res.statusText}) from ${url}`,
    );
  }

  const arrayBuf = await res.arrayBuffer();
  if (arrayBuf.byteLength > maxBytes) {
    throw new Error(`PDF exceeds ${maxBytes / (1024 * 1024)} MiB size limit`);
  }
  return Buffer.from(arrayBuf);
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  
  let payload: EmailRequest;
  try {
    payload = EmailRequestSchema.parse(await req.json());
  } catch (e) {
    const err = e as z.ZodError;
    return NextResponse.json(
      { error: "Invalid request", details: err.format() },
      { status: 400 },
    );
  }

  const { tenantEmail, tenantName, landlordName, pdfUrl, leaseId } = payload;

 
  const resend = new Resend(env.RESEND_API_KEY);
  const from = env.RESEND_FROM ?? "Lease Manager <lease-generator@leezign.dev>";

  
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await fetchPdf(pdfUrl);
  } catch (err) {
    console.error("PDF fetch error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve PDF", details: (err as Error).message },
      { status: 500 },
    );
  }

 
  const safeTenant = tenantName
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "")
    .slice(0, 60);
  const attachmentFilename = `Lease_Agreement_${safeTenant}.pdf`;

 
  const emailHtml = buildEmailHtml({
    tenantName,
    landlordName,
    pdfUrl: cloudinary.isCloudinaryUrl(pdfUrl)
      ? cloudinary.getSignedUrl(pdfUrl)!
      : pdfUrl,
  });

  
  const { data, error } = await resend.emails.send({
    from,
    to: tenantEmail,
    subject: `Lease Agreement – ${landlordName}`,
    attachments: [
      {
        filename: attachmentFilename,
        content: pdfBuffer,
      },
    ],
    html: emailHtml,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: (error as any).message },
      { status: 500 },
    );
  }

 
  if (leaseId) {
    try {
      await db
        .update(leases)
        .set({ status: "sent", updatedAt: new Date() })
        .where(eq(leases.id, leaseId));
    } catch (e) {
      console.warn("Database update error (non‑blocking):", e);
    }
  }

  
  return NextResponse.json(
    {
      success: true,
      messageId: data?.id,
      message: `Lease agreement sent to ${tenantEmail}`,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

interface EmailHtmlOpts {
  tenantName: string;
  landlordName: string;
  pdfUrl: string;
}
function buildEmailHtml({
  tenantName,
  landlordName,
  pdfUrl,
}: EmailHtmlOpts): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Lease Agreement</title>
  </head>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,#000 0%,#333 100%);color:#fff;padding:30px;border-radius:10px 10px 0 0;text-align:center;">
      <h1 style="margin:0;font-size:28px;font-weight:700;">Lease Agreement</h1>
    </div>

    <div style="background:#f9f9f9;padding:30px;border-radius:0 0 10px 10px;">
      <p style="font-size:16px;margin-bottom:20px;">Hello <strong>${tenantName}</strong>,</p>

      <p style="font-size:16px;margin-bottom:20px;">
        ${landlordName} has sent you a lease agreement for your review and signature.
      </p>

      <div style="background:#fff;border-left:4px solid #000;padding:20px;margin:25px 0;border-radius:5px;">
        <p style="margin:0;font-size:14px;color:#666;"><strong>Next Steps:</strong></p>
        <ol style="margin:10px 0 0 0;padding-left:20px;font-size:14px;color:#666;">
          <li>Download and review the lease agreement</li>
          <li>Sign the document</li>
          <li>Return the signed copy to ${landlordName}</li>
        </ol>
      </div>

      <div style="text-align:center;margin:30px 0;">
        <a href="${pdfUrl}"
           style="display:inline-block;background:#000;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
          Download Lease Agreement
        </a>
      </div>

      <p style="font-size:14px;color:#666;margin-top:25px;">
        If you have any questions about this agreement, please contact ${landlordName} directly.
      </p>

      <hr style="border:none;border-top:1px solid #ddd;margin:25px 0;">

      <p style="font-size:12px;color:#999;text-align:center;margin:0;">
        This is an automated message from Lease Manager.<br>
        Please do not reply to this email.
      </p>
    </div>
  </body>
</html>`;
}
