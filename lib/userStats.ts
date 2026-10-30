import { prisma } from './prisma';

export interface RegistrationCounts {
  totalRegistered: number;
  filteredCount: number;
  todayCount: number;
  yesterdayCount: number;
  weekCount: number;
  monthCount: number;
  yearCount: number;
  byRole: {
    BUYER: number;
    SELLER: number;
    AFFILIATE: number;
    ADMIN: number;
  };
  byStatus: {
    active: number;
    flagged: number;
    banned: number;
  };
  recentTrend: Array<{
    date: string; // YYYY-MM-DD
    displayDate: string; // e.g. "Oct 25"
    count: number;
    buyers: number;
    sellers: number;
    affiliates: number;
    admins: number;
  }>;
}

export interface RegistrationFilterOptions {
  startDate?: string | Date;
  endDate?: string | Date;
  period?: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'this_year' | 'all';
  role?: string;
  status?: string;
}

/**
 * Resolves standard date boundaries for filtering
 */
export function resolveDateBoundaries(options: {
  startDate?: string | Date;
  endDate?: string | Date;
  period?: string;
}): { start?: Date; end?: Date } {
  const now = new Date();

  if (options.period) {
    const period = options.period.toLowerCase();
    if (period === 'today') {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    if (period === 'yesterday') {
      const start = new Date(now);
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (period === 'last_7_days' || period === '7days' || period === 'week' || period === 'this_week') {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    if (period === 'last_30_days' || period === '30days' || period === 'month' || period === 'this_month') {
      const start = new Date(now);
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    if (period === 'this_year' || period === 'year') {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end: now };
    }
    if (period === 'all') {
      return {};
    }
  }

  let start: Date | undefined;
  let end: Date | undefined;

  if (options.startDate) {
    start = typeof options.startDate === 'string' ? new Date(options.startDate) : options.startDate;
    if (typeof options.startDate === 'string' && options.startDate.length === 10) {
      // YYYY-MM-DD
      start.setHours(0, 0, 0, 0);
    }
  }

  if (options.endDate) {
    end = typeof options.endDate === 'string' ? new Date(options.endDate) : options.endDate;
    if (typeof options.endDate === 'string' && options.endDate.length === 10) {
      // YYYY-MM-DD - make inclusive of the whole day
      end.setHours(23, 59, 59, 999);
    }
  }

  return { start, end };
}

/**
 * Calculates comprehensive user registration statistics and breakdowns
 */
export async function getUserRegistrationStats(
  options: RegistrationFilterOptions = {}
): Promise<RegistrationCounts> {
  const { start, end } = resolveDateBoundaries(options);
  const now = new Date();

  // Define relative benchmarks
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(now);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);

  const endOfYesterday = new Date(startOfYesterday);
  endOfYesterday.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Fetch all users with only lightweight index fields
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const totalRegistered = allUsers.length;

  let todayCount = 0;
  let yesterdayCount = 0;
  let weekCount = 0;
  let monthCount = 0;
  let yearCount = 0;

  const byRole = {
    BUYER: 0,
    SELLER: 0,
    AFFILIATE: 0,
    ADMIN: 0,
  };

  const byStatus = {
    active: 0,
    flagged: 0,
    banned: 0,
  };

  // 14-day trend map
  const trendDays = 14;
  const trendMap = new Map<
    string,
    { date: string; displayDate: string; count: number; buyers: number; sellers: number; affiliates: number; admins: number }
  >();

  for (let i = trendDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    trendMap.set(dateKey, {
      date: dateKey,
      displayDate,
      count: 0,
      buyers: 0,
      sellers: 0,
      affiliates: 0,
      admins: 0,
    });
  }

  let filteredCount = 0;

  for (const user of allUsers) {
    const createdAt = new Date(user.createdAt);
    const dateKey = createdAt.toISOString().split('T')[0];
    const roleKey = (user.role || 'BUYER').toUpperCase() as keyof typeof byRole;
    const statusKey = (user.status || 'active').toLowerCase() as keyof typeof byStatus;

    // Relative counts
    if (createdAt >= startOfToday) {
      todayCount++;
    }
    if (createdAt >= startOfYesterday && createdAt <= endOfYesterday) {
      yesterdayCount++;
    }
    if (createdAt >= sevenDaysAgo) {
      weekCount++;
    }
    if (createdAt >= thirtyDaysAgo) {
      monthCount++;
    }
    if (createdAt >= startOfYear) {
      yearCount++;
    }

    // Role breakdown (overall)
    if (byRole[roleKey] !== undefined) {
      byRole[roleKey]++;
    } else {
      byRole.BUYER++;
    }

    // Status breakdown (overall)
    if (byStatus[statusKey] !== undefined) {
      byStatus[statusKey]++;
    } else {
      byStatus.active++;
    }

    // Daily trend
    if (trendMap.has(dateKey)) {
      const entry = trendMap.get(dateKey)!;
      entry.count++;
      if (roleKey === 'BUYER') entry.buyers++;
      else if (roleKey === 'SELLER') entry.sellers++;
      else if (roleKey === 'AFFILIATE') entry.affiliates++;
      else if (roleKey === 'ADMIN') entry.admins++;
    }

    // Check if matches the specific filter criteria
    let matches = true;
    if (start && createdAt < start) matches = false;
    if (end && createdAt > end) matches = false;
    if (options.role && options.role !== 'ALL' && roleKey !== options.role.toUpperCase()) matches = false;
    if (options.status && options.status !== 'ALL' && statusKey !== options.status.toLowerCase()) matches = false;

    if (matches) {
      filteredCount++;
    }
  }

  return {
    totalRegistered,
    filteredCount,
    todayCount,
    yesterdayCount,
    weekCount,
    monthCount,
    yearCount,
    byRole,
    byStatus,
    recentTrend: Array.from(trendMap.values()),
  };
}

/**
 * Fast direct count of users matching registration criteria
 */
export async function countUsers(options: RegistrationFilterOptions = {}): Promise<number> {
  const { start, end } = resolveDateBoundaries(options);
  const where: any = {};

  if (start || end) {
    where.createdAt = {};
    if (start) where.createdAt.gte = start;
    if (end) where.createdAt.lte = end;
  }

  if (options.role && options.role !== 'ALL') {
    where.role = options.role.toUpperCase();
  }

  if (options.status && options.status !== 'ALL') {
    where.status = options.status.toLowerCase();
  }

  return await prisma.user.count({ where });
}

