// app/api/generate-agreement/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { leases } from "@/drizzle/schema";
// @ts-ignore
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      profileId,
      landlordName,
      tenantName,
      landlordEmail,
      tenantEmail,
      streetAddress,
      unit,
      city,
      state,
      zip,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      petsAllowed,
      smokingPolicy,
      additionalNotes,
      templateId,
    } = body;

    // Validate required fields
    if (
      !profileId ||
      !landlordName ||
      !tenantName ||
      !landlordEmail ||
      !tenantEmail ||
      !streetAddress ||
      !city ||
      !state ||
      !zip ||
      !startDate ||
      !endDate ||
      !monthlyRent ||
      !securityDeposit ||
      !templateId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("Starting lease generation...");

    // Step 1: Generate AI content for the lease
    let aiContent: string;
    try {
      aiContent = await generateLeaseContent({
        landlordName,
        tenantName,
        streetAddress,
        unit,
        city,
        state,
        zip,
        startDate,
        endDate,
        monthlyRent,
        securityDeposit,
        petsAllowed,
        smokingPolicy,
        additionalNotes,
        templateId,
      });
      console.log("AI content generated successfully");
    } catch (aiError: any) {
      console.error("AI generation failed:", aiError);
      // Use fallback template if AI fails
      aiContent = generateFallbackLease({
        landlordName,
        tenantName,
        streetAddress,
        unit,
        city,
        state,
        zip,
        startDate,
        endDate,
        monthlyRent,
        securityDeposit,
        petsAllowed,
        smokingPolicy,
        additionalNotes,
      });
      console.log("Using fallback template");
    }

    // Step 2: Generate PDF from AI content
    let pdfUrl: string;
    let cloudinaryPublicId: string;

    try {
      const pdfResult = await generatePDF(aiContent, {
        landlordName,
        tenantName,
        streetAddress,
        city,
        state,
      });
      pdfUrl = pdfResult.pdfUrl;
      cloudinaryPublicId = pdfResult.cloudinaryPublicId;
      console.log("PDF generated and uploaded successfully");
    } catch (pdfError: any) {
      console.error("PDF generation failed:", pdfError);
      return NextResponse.json(
        {
          error: "Failed to generate PDF",
          details: pdfError.message,
        },
        { status: 500 },
      );
    }

    // Step 3: Insert into database using Drizzle ORM
    try {
      const [newLease] = await db
        .insert(leases)
        .values({
          profileId,
          landlordName,
          landlordEmail,
          tenantName,
          tenantEmail,
          streetAddress,
          unit: unit || null,
          city,
          state,
          zip,
          templateType: templateId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          monthlyRent: monthlyRent.toString(),
          securityDeposit: securityDeposit.toString(),
          petsAllowed: petsAllowed || false,
          smokingPolicy,
          additionalNotes: additionalNotes || null,
          aiGeneratedContent: aiContent,
          pdfUrl,
          cloudinaryPublicId,
          status: "draft",
        })
        .returning();

      console.log("Lease saved to database successfully");

      return NextResponse.json({
        success: true,
        pdfUrl,
        leaseId: newLease.id,
        aiContent,
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          error: "Failed to save lease to database",
          details: dbError.message,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error generating agreement:", error);
    return NextResponse.json(
      {
        error: "Failed to generate agreement",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Helper function to generate lease content using AI
async function generateLeaseContent(data: any): Promise<string> {
  const {
    landlordName,
    tenantName,
    streetAddress,
    unit,
    city,
    state,
    zip,
    startDate,
    endDate,
    monthlyRent,
    securityDeposit,
    petsAllowed,
    smokingPolicy,
    additionalNotes,
    templateId,
  } = data;

  const fullAddress = unit
    ? `${streetAddress}, Unit ${unit}, ${city}, ${state} ${zip}`
    : `${streetAddress}, ${city}, ${state} ${zip}`;

  const templateNames: Record<string, string> = {
    standard: "Standard Residential",
    "short-term": "Short-Term Rental",
    commercial: "Commercial",
  };

  const templateName = templateNames[templateId] || "Standard Residential";

  const prompt = `Generate a comprehensive and legally sound ${templateName} lease agreement with the following details:

PROPERTY INFORMATION:
- Address: ${fullAddress}

PARTIES:
- Landlord: ${landlordName}
- Tenant: ${tenantName}

LEASE TERMS:
- Start Date: ${new Date(startDate).toLocaleDateString()}
- End Date: ${new Date(endDate).toLocaleDateString()}
- Monthly Rent: $${parseFloat(monthlyRent).toLocaleString()}
- Security Deposit: $${parseFloat(securityDeposit).toLocaleString()}

POLICIES:
- Pets: ${petsAllowed ? "Allowed" : "Not Allowed"}
- Smoking: ${smokingPolicy}

${additionalNotes ? `ADDITIONAL PROVISIONS:\n${additionalNotes}` : ""}

Please generate a complete, professional lease agreement that includes all standard clauses. Format with clear sections and numbering.`;

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.warn("ANTHROPIC_API_KEY not configured, using fallback template");
    throw new Error("AI API not configured");
  }

  const api_key = process.env.GROQ_API_KEY;

  try {
    console.log("Calling Anthropic API...");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a legal document generator." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3, // Lower temperature for more consistent legal formatting
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error response:", errorText);
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    console.log(result);

    if (
      !result.choices ||
      !result.choices[0] ||
      !result.choices[0].message ||
      !result.choices[0].message.content
    ) {
      console.error("Invalid AI response format:", result);
      throw new Error("Invalid response format from AI");
    }

    return result.choices[0].message.content;
  } catch (error: any) {
    console.error("Error generating AI content:", error);
    throw error;
  }
}

// Fallback lease template if AI generation fails
function generateFallbackLease(data: any): string {
  const {
    landlordName,
    tenantName,
    streetAddress,
    unit,
    city,
    state,
    zip,
    startDate,
    endDate,
    monthlyRent,
    securityDeposit,
    petsAllowed,
    smokingPolicy,
    additionalNotes,
  } = data;

  const fullAddress = unit
    ? `${streetAddress}, Unit ${unit}, ${city}, ${state} ${zip}`
    : `${streetAddress}, ${city}, ${state} ${zip}`;

  return `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Agreement") is entered into on ${new Date().toLocaleDateString()} between:

LANDLORD: ${landlordName}
TENANT: ${tenantName}

1. PROPERTY
The Landlord agrees to lease to the Tenant the residential property located at:
${fullAddress}
(the "Property")

2. TERM
The lease term shall begin on ${new Date(startDate).toLocaleDateString()} and end on ${new Date(endDate).toLocaleDateString()}.

3. RENT
The Tenant agrees to pay monthly rent of $${parseFloat(monthlyRent).toLocaleString()}, due on the first day of each month.

4. SECURITY DEPOSIT
The Tenant shall pay a security deposit of $${parseFloat(securityDeposit).toLocaleString()}, which will be held by the Landlord and returned at the end of the lease term, subject to deductions for damages beyond normal wear and tear.

5. UTILITIES
The Tenant shall be responsible for all utilities and services, unless otherwise specified in writing.

6. MAINTENANCE AND REPAIRS
The Tenant agrees to maintain the Property in good condition and promptly notify the Landlord of any necessary repairs.

7. PETS
${petsAllowed ? "Pets are allowed on the Property with prior written consent from the Landlord." : "No pets are allowed on the Property without prior written consent from the Landlord."}

8. SMOKING POLICY
${smokingPolicy}

9. USE OF PROPERTY
The Property shall be used exclusively as a private residence for the Tenant and their immediate family.

10. ENTRY AND INSPECTION
The Landlord may enter the Property with 24 hours notice for inspection, repairs, or to show the Property to prospective tenants or buyers.

11. TERMINATION
Either party may terminate this Agreement with 30 days written notice, subject to all terms and conditions herein.

12. DEFAULT
Failure to pay rent when due or violation of any terms of this Agreement constitutes default and may result in eviction proceedings.

${additionalNotes ? `13. ADDITIONAL PROVISIONS\n${additionalNotes}` : ""}

This Agreement represents the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

By signing below, both parties acknowledge they have read, understood, and agree to all terms of this Lease Agreement.`;
}

// Helper function to generate PDF and upload to Cloudinary
async function generatePDF(
  content: string,
  metadata: {
    landlordName: string;
    tenantName: string;
    streetAddress: string;
    city: string;
    state: string;
  },
): Promise<{
  pdfUrl: string;
  cloudinaryPublicId: string;
}> {
  try {
    // Validate Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary credentials not configured");
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Creating PDF document...");

    // Create PDF document
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 50, bottom: 50, left: 72, right: 72 },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    // Add header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("RESIDENTIAL LEASE AGREEMENT", { align: "center" });

    doc.moveDown();

    // Add property info
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Property: ${metadata.streetAddress}, ${metadata.city}, ${metadata.state}`,
        {
          align: "center",
        },
      );

    doc.moveDown(2);

    // Add main content - handle line breaks properly
    const lines = content.split("\n");
    doc.fontSize(11).font("Helvetica");

    for (const line of lines) {
      if (line.trim()) {
        // Check if adding this line will overflow the page
        const textHeight = doc.heightOfString(line);
        if (doc.y + textHeight > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
        }

        doc.text(line, {
          align: "left",
          lineGap: 3,
        });
      } else {
        doc.moveDown(0.5);
      }
    }

    // Add signature section on new page
    doc.addPage();
    doc.fontSize(14).font("Helvetica-Bold").text("SIGNATURES", {
      align: "center",
    });

    doc.moveDown(2);

    // Landlord signature
    doc.fontSize(11).font("Helvetica");
    doc.text("LANDLORD:", { underline: true });
    doc.moveDown(0.5);
    doc.text(
      "Signature: _________________________________   Date: ______________",
    );
    doc.moveDown(0.5);
    doc.text(`Print Name: ${metadata.landlordName}`);

    doc.moveDown(3);

    // Tenant signature
    doc.text("TENANT:", { underline: true });
    doc.moveDown(0.5);
    doc.text(
      "Signature: _________________________________   Date: ______________",
    );
    doc.moveDown(0.5);
    doc.text(`Print Name: ${metadata.tenantName}`);

    doc.end();

    console.log("PDF created, waiting for buffer...");

    // Wait for PDF generation to complete
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    console.log("PDF buffer ready, uploading to Cloudinary...");

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "lease-agreements",
          format: "pdf",
          public_id: `lease_${Date.now()}_${metadata.tenantName.replace(/\s+/g, "_")}`,
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful");
            resolve(result);
          }
        },
      );

      uploadStream.end(pdfBuffer);
    });

    return {
      pdfUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
    };
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
