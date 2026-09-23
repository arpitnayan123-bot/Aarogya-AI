// POST /api/labs/parse — Parse an uploaded lab report PDF
import { NextRequest, NextResponse } from 'next/server';
import { parseLabReportPDF } from '@/lib/lab-parser/lab-parser';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? '';

    let pdfBuffer: Buffer;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') ?? formData.get('pdf');
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { success: false, error: 'PDF file is required (field "file" or "pdf")' },
          { status: 400 },
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else if (contentType.includes('application/pdf')) {
      const arrayBuffer = await req.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            'Unsupported content type. Send PDF as multipart/form-data or application/pdf.',
        },
        { status: 415 },
      );
    }

    if (pdfBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Empty PDF buffer received' },
        { status: 400 },
      );
    }

    const result = await parseLabReportPDF(pdfBuffer);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Lab parse API error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to parse lab report';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
