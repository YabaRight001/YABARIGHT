import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload with base64 data URL
    if (contentType.includes('application/json')) {
      const { image, name } = await req.json();
      if (!image) {
        return NextResponse.json({ success: false, message: 'Image data is required' }, { status: 400 });
      }

      // Check if it's already an external or local URL
      if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
        return NextResponse.json({ success: true, url: image });
      }

      // Parse base64
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        // Return raw image as fallback URL
        return NextResponse.json({ success: true, url: image });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const ext = mimeType.split('/')[1] || 'jpg';
      const cleanExt = ext === 'jpeg' ? 'jpg' : ext;
      const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${cleanExt}`;

      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
      } catch (fsErr) {
        // In read-only serverless environment where writing to /public isn't supported,
        // return the data URI directly so it renders
        return NextResponse.json({ success: true, url: image });
      }
    }

    // Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpg';
      const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;

      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
      } catch (fsErr) {
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
        return NextResponse.json({ success: true, url: dataUrl });
      }
    }

    return NextResponse.json({ success: false, message: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Upload failed' }, { status: 500 });
  }
}
