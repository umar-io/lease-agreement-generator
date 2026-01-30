import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { uploadPdfToCloudinary } from '@/app/cloudinary';
import { insertLease, updateLeasePdfUrl } from '@/app/lib/db';

// --- Interfaces ---
interface LeaseData {
    profileId: string;
    landlordName: string;
    tenantName: string;
    landlordEmail: string;
    tenantEmail: string;
    streetAddress: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
    startDate: string;
    endDate: string;
    monthlyRent: string;
    securityDeposit: string;
    petsAllowed: boolean;
    smokingPolicy: string;
    additionalNotes: string;
}

interface ValidationError {
    field: string;
    message: string;
}

interface APIError extends Error {
    status?: number;
    code?: string;
}

// --- Main API Handler ---
export async function POST(req: NextRequest) {
    let leaseId = null;

    try {
        console.log('Starting lease generation process...');
        const leaseData: LeaseData = await req.json();
        const profileId = leaseData.profileId;

        if (!profileId) {
            return NextResponse.json({ success: false, error: 'User Profile ID is missing.' }, { status: 401 });
        }

        // 1. Validation
        const validationErrors = validateLeaseData(leaseData);
        if (validationErrors.length > 0) {
            return NextResponse.json({ success: false, error: 'Validation failed', validationErrors }, { status: 400 });
        }

        // 2. Initial Database Insert (Atomic ID generation)
        console.log('Inserting initial lease record...');
        leaseId = await insertLease({
            // profileId,
            ...leaseData,
            monthlyRent: parseFloat(leaseData.monthlyRent),
            securityDeposit: parseFloat(leaseData.securityDeposit),
        });

        // 3. AI Content Generation (Groq)
        console.log('Generating legal text via AI...');
        const agreementText = await generateLeaseWithAI(leaseData);

        // 4. Generate PDF Document
        console.log('Rendering PDF bytes...');
        const pdfBytes = await generatePDF(agreementText, leaseData);

        // 5. Upload to Cloudinary
        console.log('Uploading to Cloudinary...');
        const fileName = `lease_${leaseId}_${Date.now()}`;
        const uploadResult = await uploadPdfToCloudinary(Buffer.from(pdfBytes), fileName);
        
        const cloudinaryUrl = uploadResult.url;
        const publicId = uploadResult.publicId;

        // 6. Final Database Update (Save the URLs)
        console.log('Updating lease record with Cloudinary URLs...');
        await updateLeasePdfUrl(profileId, leaseId, cloudinaryUrl, publicId);

        // 7. Base64 for instant preview in UI
        const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
        const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;

        return NextResponse.json({
            success: true,
            leaseId,
            pdfUrl: cloudinaryUrl,
            pdfDataUrl,
            message: 'Lease generated and stored successfully.'
        });

    } catch (error) {
        console.error('Workflow Error:', error);
        const apiError = error as APIError;
        return NextResponse.json({
            success: false,
            error: apiError.message || 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error),
            leaseId: leaseId || undefined
        }, { status: apiError.status || 500 });
    }
}

// --- AI Generation Logic ---
async function generateLeaseWithAI(data: LeaseData): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

    const prompt = `Generate a formal Residential Lease Agreement for the state of ${data.state}.
    LANDLORD: ${data.landlordName}
    TENANT: ${data.tenantName}
    PROPERTY: ${data.streetAddress}, ${data.unit ? 'Unit '+data.unit+',' : ''} ${data.city}, ${data.state} ${data.zip}
    TERM: ${data.startDate} to ${data.endDate}
    RENT: $${data.monthlyRent} per month
    DEPOSIT: $${data.securityDeposit}
    PETS: ${data.petsAllowed ? 'Allowed' : 'Not Allowed'}
    SMOKING: ${data.smokingPolicy}
    ADDITIONAL TERMS: ${data.additionalNotes || 'None'}
    
    Format with clear numeric sections (e.g., 1. LEASE TERM, 2. RENT). Use professional legal language.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a legal document generator.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3 // Lower temperature for more consistent legal formatting
        })
    });

    if (!response.ok) throw new Error(`Groq API failed: ${response.statusText}`);
    const result = await response.json();
    return result.choices[0].message.content;
}

// --- PDF Creation Logic ---
async function generatePDF(agreementText: string, data: LeaseData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    const margin = 50;
    const maxWidth = width - (margin * 2);
    let y = height - margin;

    const addNewPage = () => {
        page = pdfDoc.addPage([612, 792]);
        y = height - margin;
    };

    // Text Wrap & Draw Helper
    const drawParagraph = (text: string, size: number, font: any, lineHeight: number) => {
        const cleanText = text.replace(/[^\x20-\x7E]/g, '').trim();
        const words = cleanText.split(' ');
        let line = '';

        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, size);

            if (testWidth > maxWidth) {
                page.drawText(line.trim(), { x: margin, y, size, font });
                y -= lineHeight;
                line = word + ' ';
                if (y < margin + 40) addNewPage();
            } else {
                line = testLine;
            }
        }
        page.drawText(line.trim(), { x: margin, y, size, font });
        y -= lineHeight;
    };

    // Header
    page.drawText('RESIDENTIAL LEASE AGREEMENT', {
        x: (width - boldFont.widthOfTextAtSize('RESIDENTIAL LEASE AGREEMENT', 16)) / 2,
        y, size: 16, font: boldFont
    });
    y -= 40;

    // Content Processing
    const sections = agreementText.split('\n');
    for (const line of sections) {
        if (!line.trim()) {
            y -= 10;
            continue;
        }
        const isHeading = /^\d+\.|^[A-Z\s]+:/.test(line);
        drawParagraph(line, isHeading ? 11 : 10, isHeading ? boldFont : regularFont, 14);
        if (y < margin) addNewPage();
    }

    // Signature Block
    y -= 50;
    if (y < 150) addNewPage();
    
    page.drawText('__________________________', { x: margin, y, size: 12 });
    page.drawText('__________________________', { x: width / 2 + 20, y, size: 12 });
    y -= 15;
    page.drawText(`Landlord: ${data.landlordName}`, { x: margin, y, size: 10, font: regularFont });
    page.drawText(`Tenant: ${data.tenantName}`, { x: width / 2 + 20, y, size: 10, font: regularFont });

    return await pdfDoc.save();
}

// --- Validation Logic ---
function validateLeaseData(data: LeaseData): ValidationError[] {
    const errors: ValidationError[] = [];
    const required = ['landlordName', 'tenantName', 'landlordEmail', 'tenantEmail', 'streetAddress', 'city', 'state', 'zip', 'startDate', 'endDate', 'monthlyRent'];
    
    required.forEach(field => {
        if (!data[field as keyof LeaseData]) {
            errors.push({ field, message: `${field} is required` });
        }
    });

    return errors;
}