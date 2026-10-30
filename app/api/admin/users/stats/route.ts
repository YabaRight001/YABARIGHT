import { NextRequest, NextResponse } from 'next/server';
import { getUserRegistrationStats } from '@/lib/userStats';

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

    const stats = await getUserRegistrationStats({
      startDate,
      endDate,
      period,
      role,
      status,
    });

    return NextResponse.json({
      success: true,
      stats,
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        period: period || 'all',
        role: role || 'ALL',
        status: status || 'ALL',
      },
    });
  } catch (error: any) {
    console.error('Error fetching registration statistics:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch registration statistics' },
      { status: 500 }
    );
  }
}

