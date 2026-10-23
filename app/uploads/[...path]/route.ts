import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const rawSegments = params.path || [];
    const filename = rawSegments.join('/');

    const candidateDirs = [
      path.resolve(process.cwd(), 'public', 'uploads'),
      path.resolve(process.platform === 'win32' ? path.join(process.cwd(), 'public', 'uploads') : '/tmp', 'uploads'),
    ];

    let targetPath = '';
    let stat: fs.Stats | null = null;

    for (const dir of candidateDirs) {
      const resolved = path.resolve(dir, filename);
      if (resolved.startsWith(dir) && fs.existsSync(resolved)) {
        const s = fs.statSync(resolved);
        if (s.isFile()) {
          targetPath = resolved;
          stat = s;
          break;
        }
      }
    }

    if (!targetPath || !stat) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(targetPath);
    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving upload:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
