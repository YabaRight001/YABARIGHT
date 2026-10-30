import { NextRequest, NextResponse } from 'next/server';
import { countUsers, resolveDateBoundaries } from '@/lib/userStats';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const period = (searchParams.get('period') as any) || undefined;
    const role = searchParams.get('role') || undefined;
    const status = searchParams.get('status') || undefined;

    const count = await countUsers({
      startDate,
      endDate,
      period,
      role,
      status,
    });

    const boundaries = resolveDateBoundaries({ startDate, endDate, period });

    return NextResponse.json({
      success: true,
      count,
      filters: {
        startDate: boundaries.start ? boundaries.start.toISOString() : null,
        endDate: boundaries.end ? boundaries.end.toISOString() : null,
        period: period || 'custom',
        role: role || 'ALL',
        status: status || 'ALL',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error counting users based on registration:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to count users' },
      { status: 500 }
    );
  }
}

