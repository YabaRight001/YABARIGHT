import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function saveBufferToUploads(buffer: Buffer, filename: string): string | null {
  const dirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.platform === 'win32' ? path.join(process.cwd(), 'public', 'uploads') : '/tmp', 'uploads'),
  ];

  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, filename);
      fs.writeFileSync(filePath, buffer);
      return `/uploads/${filename}`;
    } catch (err) {
      console.warn(`Could not save to ${dir}, trying next:`, err);
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload with base64 data URL
    if (contentType.includes('application/json')) {
      const { image } = await req.json();
      if (!image) {
        return NextResponse.json({ success: false, message: 'Image data is required' }, { status: 400 });
      }

      // Check if it's already an external or local URL
      if (image.startsWith('http://') || image.startsWith('https://') || (image.startsWith('/') && !image.startsWith('data:'))) {
        return NextResponse.json({ success: true, url: image });
      }

      // Parse base64
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ success: true, url: image });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const ext = mimeType.split('/')[1] || 'jpg';
      const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
      const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${cleanExt}`;
      const buffer = Buffer.from(base64Data, 'base64');

      const savedUrl = saveBufferToUploads(buffer, filename);
      if (savedUrl) {
        return NextResponse.json({ success: true, url: savedUrl });
      }

      // Fallback only if disk write completely fails
      return NextResponse.json({ success: true, url: image });
    }

    // Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const rawExt = path.extname(file.name).toLowerCase() || '.jpg';
      const cleanExt = rawExt === '.jpeg' ? '.jpg' : rawExt;
      const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${cleanExt}`;

      const savedUrl = saveBufferToUploads(buffer, filename);
      if (savedUrl) {
        return NextResponse.json({ success: true, url: savedUrl });
      }

      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }

    return NextResponse.json({ success: false, message: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Upload failed' }, { status: 500 });
  }
}

