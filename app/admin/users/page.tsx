'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useToastStore } from '@/store/toastStore';
import {
  Users,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Filter,
  RefreshCw,
  UserCheck,
  ShoppingBag,
  Store,
  Share2,
  Shield,
  X,
  BarChart3,
} from 'lucide-react';

type TimePeriod = 'all' | 'today' | 'last_7_days' | 'last_30_days' | 'custom';
type RoleFilter = 'ALL' | 'BUYER' | 'SELLER' | 'AFFILIATE' | 'ADMIN';
type StatusFilter = 'ALL' | 'active' | 'flagged';

export default function AdminUsersPage() {
  const { users, registrationStats, deleteUser, setUserStatus, fetchUsers } = useAdminStore();
  const showToast = useToastStore((s) => s.showToast);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [periodFilter, setPeriodFilter] = useState<TimePeriod>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Initial fetch
  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchUsers({
        period: periodFilter !== 'custom' ? periodFilter : undefined,
        startDate: periodFilter === 'custom' && customStartDate ? customStartDate : undefined,
        endDate: periodFilter === 'custom' && customEndDate ? customEndDate : undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when server filters change (or apply locally if preferred)
  const handleApplyFilters = async (
    newPeriod?: TimePeriod,
    newRole?: RoleFilter,
    newStatus?: StatusFilter
  ) => {
    const period = newPeriod !== undefined ? newPeriod : periodFilter;
    const role = newRole !== undefined ? newRole : roleFilter;
    const status = newStatus !== undefined ? newStatus : statusFilter;

    setLoading(true);
    try {
      await fetchUsers({
        period: period !== 'custom' ? period : undefined,
        startDate: period === 'custom' && customStartDate ? customStartDate : undefined,
        endDate: period === 'custom' && customEndDate ? customEndDate : undefined,
        role: role !== 'ALL' ? role : undefined,
        status: status !== 'ALL' ? status : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setPeriodFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    fetchUsers({ period: 'all' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      deleteUser(id);
      showToast(`User account "${name}" has been deleted.`, 'info');
    }
  };

  const handleToggleStatus = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'flagged' : 'active';
    setUserStatus(id, nextStatus);
    showToast(`User "${name}" status updated to ${nextStatus}.`, 'success');
  };

  // Date helpers for relative display
  const getRelativeRegistration = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `Today (${diffHours}h ago)`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Client-side search and quick filter computation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      // In-memory date check (in addition to backend filtering)
      let matchesDate = true;
      const userDate = new Date(u.createdAt || u.joinedAt);

      if (!isNaN(userDate.getTime())) {
        const now = new Date();
        if (periodFilter === 'today') {
          const startOfToday = new Date(now);
          startOfToday.setHours(0, 0, 0, 0);
          matchesDate = userDate >= startOfToday;
        } else if (periodFilter === 'last_7_days') {
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          sevenDaysAgo.setHours(0, 0, 0, 0);
          matchesDate = userDate >= sevenDaysAgo;
        } else if (periodFilter === 'last_30_days') {
          const thirtyDaysAgo = new Date(now);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          thirtyDaysAgo.setHours(0, 0, 0, 0);
          matchesDate = userDate >= thirtyDaysAgo;
        } else if (periodFilter === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            if (userDate < start) matchesDate = false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (userDate > end) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });
  }, [users, searchQuery, roleFilter, statusFilter, periodFilter, customStartDate, customEndDate]);

  // Compute stats fallback if registrationStats from backend is still loading
  const stats = useMemo(() => {
    if (registrationStats) {
      return registrationStats;
    }
    const now = new Date();
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

    let todayCount = 0;
    let yesterdayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    const byRole = { BUYER: 0, SELLER: 0, AFFILIATE: 0, ADMIN: 0 };
    const byStatus = { active: 0, flagged: 0, banned: 0 };

    users.forEach((u) => {
      const d = new Date(u.createdAt || u.joinedAt);
      if (!isNaN(d.getTime())) {
        if (d >= startOfToday) todayCount++;
        if (d >= startOfYesterday && d <= endOfYesterday) yesterdayCount++;
        if (d >= sevenDaysAgo) weekCount++;
        if (d >= thirtyDaysAgo) monthCount++;
      }
      const r = (u.role || 'BUYER') as keyof typeof byRole;
      if (byRole[r] !== undefined) byRole[r]++;
      const s = (u.status || 'active') as keyof typeof byStatus;
      if (byStatus[s] !== undefined) byStatus[s]++;
    });

    return {
      totalRegistered: users.length,
      filteredCount: filteredUsers.length,
      todayCount,
      yesterdayCount,
      weekCount,
      monthCount,
      yearCount: users.length,
      byRole,
      byStatus,
      recentTrend: [],
    };
  }, [users, registrationStats, filteredUsers.length]);

  const hasActiveFilters =
    searchQuery !== '' ||
    roleFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    periodFilter !== 'all' ||
    customStartDate !== '' ||
    customEndDate !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Users className="h-7 w-7 text-[#FFD700]" />
            User Registration Analytics & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time counts, registration timeframe analytics, and account moderation across all platform roles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-gray-200 transition active:scale-95 disabled:opacity-50"
            title="Refresh registration statistics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#FFD700]' : ''}`} />
            Refresh Counts
          </button>
        </div>
      </div>

      {/* KPI Cards: Counts Based on Registration */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div
          onClick={() => {
            setPeriodFilter('all');
            handleApplyFilters('all');
          }}
          className={`cursor-pointer rounded-3xl border p-5 transition hover:border-[#FFD700]/50 ${
            periodFilter === 'all'
              ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.15)]'
              : 'border-white/10 bg-[#141414]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Total Registered
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-white">{stats.totalRegistered}</p>
          <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            {stats.byStatus.active} Active accounts
          </p>
        </div>

        {/* Registered Today */}
        <div
          onClick={() => {
            setPeriodFilter('today');
            handleApplyFilters('today');
          }}
          className={`cursor-pointer rounded-3xl border p-5 transition hover:border-emerald-500/50 ${
            periodFilter === 'today'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              : 'border-white/10 bg-[#141414]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Registered Today
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-white">{stats.todayCount}</p>
          <p className="mt-1 text-[11px] text-gray-400">
            {stats.yesterdayCount} registered yesterday
          </p>
        </div>

        {/* Registered Past 7 Days */}
        <div
          onClick={() => {
            setPeriodFilter('last_7_days');
            handleApplyFilters('last_7_days');
          }}
          className={`cursor-pointer rounded-3xl border p-5 transition hover:border-[#FFD700]/50 ${
            periodFilter === 'last_7_days'
              ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.15)]'
              : 'border-white/10 bg-[#141414]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD700]">
              Past 7 Days
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#FFD700]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-white">{stats.weekCount}</p>
          <p className="mt-1 text-[11px] text-gray-400">New weekly signups</p>
        </div>

        {/* Registered Past 30 Days */}
        <div
          onClick={() => {
            setPeriodFilter('last_30_days');
            handleApplyFilters('last_30_days');
          }}
          className={`cursor-pointer rounded-3xl border p-5 transition hover:border-purple-500/50 ${
            periodFilter === 'last_30_days'
              ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
              : 'border-white/10 bg-[#141414]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Past 30 Days
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-white">{stats.monthCount}</p>
          <p className="mt-1 text-[11px] text-gray-400">Monthly registration growth</p>
        </div>
      </div>

      {/* Role Counts Breakdown Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-[#FFD700]" />
            Registration Breakdown by Role
          </span>
          <span className="text-xs text-gray-400">
            Total:{' '}
            <strong className="text-white">
              {stats.byRole.BUYER + stats.byRole.SELLER + stats.byRole.AFFILIATE + stats.byRole.ADMIN}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Buyers */}
          <button
            type="button"
            onClick={() => {
              const nextRole = roleFilter === 'BUYER' ? 'ALL' : 'BUYER';
              setRoleFilter(nextRole);
              handleApplyFilters(undefined, nextRole);
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
              roleFilter === 'BUYER'
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400">Buyers</p>
                <p className="text-base font-black text-white">{stats.byRole.BUYER}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {stats.totalRegistered > 0
                ? `${Math.round((stats.byRole.BUYER / stats.totalRegistered) * 100)}%`
                : '0%'}
            </span>
          </button>

          {/* Sellers */}
          <button
            type="button"
            onClick={() => {
              const nextRole = roleFilter === 'SELLER' ? 'ALL' : 'SELLER';
              setRoleFilter(nextRole);
              handleApplyFilters(undefined, nextRole);
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
              roleFilter === 'SELLER'
                ? 'border-amber-500 bg-amber-500/10 text-white'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400">Sellers</p>
                <p className="text-base font-black text-white">{stats.byRole.SELLER}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {stats.totalRegistered > 0
                ? `${Math.round((stats.byRole.SELLER / stats.totalRegistered) * 100)}%`
                : '0%'}
            </span>
          </button>

          {/* Affiliates */}
          <button
            type="button"
            onClick={() => {
              const nextRole = roleFilter === 'AFFILIATE' ? 'ALL' : 'AFFILIATE';
              setRoleFilter(nextRole);
              handleApplyFilters(undefined, nextRole);
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
              roleFilter === 'AFFILIATE'
                ? 'border-emerald-500 bg-emerald-500/10 text-white'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400">Affiliates</p>
                <p className="text-base font-black text-white">{stats.byRole.AFFILIATE}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {stats.totalRegistered > 0
                ? `${Math.round((stats.byRole.AFFILIATE / stats.totalRegistered) * 100)}%`
                : '0%'}
            </span>
          </button>

          {/* Admins */}
          <button
            type="button"
            onClick={() => {
              const nextRole = roleFilter === 'ADMIN' ? 'ALL' : 'ADMIN';
              setRoleFilter(nextRole);
              handleApplyFilters(undefined, nextRole);
            }}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
              roleFilter === 'ADMIN'
                ? 'border-purple-500 bg-purple-500/10 text-white'
                : 'border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400">Admins</p>
                <p className="text-base font-black text-white">{stats.byRole.ADMIN}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Staff
            </span>
          </button>
        </div>
      </div>

      {/* Recent 14-Day Registration Velocity Sparkline (if available) */}
      {stats.recentTrend && stats.recentTrend.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Daily Registration Momentum (Last 14 Days)
            </span>
            <span className="text-[11px] text-gray-500 font-mono">
              Peak Day: {Math.max(...stats.recentTrend.map((t) => t.count), 1)} signups
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
            {stats.recentTrend.map((day) => {
              const maxCount = Math.max(...stats.recentTrend.map((t) => t.count), 1);
              const heightPercent = day.count > 0 ? Math.max((day.count / maxCount) * 100, 15) : 8;

              return (
                <div key={day.date} className="flex flex-col items-center gap-1.5 group">
                  <div className="text-[10px] font-mono font-bold text-gray-400 group-hover:text-white transition">
                    {day.count}
                  </div>
                  <div className="h-16 w-full rounded-lg bg-white/5 flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-md transition-all duration-300 ${
                        day.count > 0
                          ? 'bg-gradient-to-t from-[#FFD700] to-amber-300 group-hover:brightness-125'
                          : 'bg-white/10'
                      }`}
                      title={`${day.date}: ${day.count} registration(s)`}
                    />
                  </div>
                  <span className="text-[9px] text-gray-500 truncate w-full text-center">
                    {day.displayDate.split(' ')[1] || day.displayDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, email, phone, or account ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-2.5 pl-10 text-xs text-white placeholder-gray-400 outline-none focus:border-[#FFD700]"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Timeframe Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { label: 'All Time', value: 'all' },
                { label: 'Today', value: 'today' },
                { label: '7 Days', value: 'last_7_days' },
                { label: '30 Days', value: 'last_30_days' },
                { label: 'Custom Range', value: 'custom' },
              ] as const
            ).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setPeriodFilter(t.value);
                  if (t.value !== 'custom') {
                    handleApplyFilters(t.value);
                  }
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  periodFilter === t.value
                    ? 'bg-[#FFD700] text-black font-black shadow-sm'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range Pickers (shown when 'custom' is active) */}
        {periodFilter === 'custom' && (
          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs text-white outline-none focus:border-[#FFD700]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs text-white outline-none focus:border-[#FFD700]"
              />
            </div>
            <button
              type="button"
              onClick={() => handleApplyFilters('custom')}
              className="rounded-xl bg-[#FFD700] px-4 py-1.5 text-xs font-black text-black hover:bg-amber-400 transition"
            >
              Filter by Range
            </button>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                  handleApplyFilters('all');
                }}
                className="text-xs text-gray-400 hover:text-white underline ml-2"
              >
                Clear Dates
              </button>
            )}
          </div>
        )}

        {/* Role & Status Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role:</span>
            {(['ALL', 'BUYER', 'SELLER', 'AFFILIATE', 'ADMIN'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRoleFilter(r);
                  handleApplyFilters(undefined, r);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  roleFilter === r
                    ? 'bg-white/20 text-white border border-white/30 font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r === 'ALL' ? 'All' : `${r.charAt(0)}${r.slice(1).toLowerCase()}s`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status:</span>
            {(['ALL', 'active', 'flagged'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  handleApplyFilters(undefined, undefined, s);
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  statusFilter === s
                    ? 'bg-white/20 text-white border border-white/30 font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Counter & Active Filters Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-gray-400">
            Showing <strong className="text-white text-sm">{filteredUsers.length}</strong> matching user
            {filteredUsers.length === 1 ? '' : 's'}
            {stats.totalRegistered !== filteredUsers.length && (
              <span className="text-gray-500 font-normal ml-1">
                (filtered from {stats.totalRegistered} total platform accounts)
              </span>
            )}
          </p>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            {periodFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD700]">
                <Calendar className="h-2.5 w-2.5" />
                {periodFilter === 'today'
                  ? 'Today'
                  : periodFilter === 'last_7_days'
                  ? 'Past 7 Days'
                  : periodFilter === 'last_30_days'
                  ? 'Past 30 Days'
                  : `${customStartDate || '...'} to ${customEndDate || '...'}`}
              </span>
            )}
            {roleFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
                {roleFilter}
              </span>
            )}
            {statusFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {statusFilter}
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-red-400 hover:text-red-300 font-bold ml-1 flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Reset all
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-sm">
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-base font-bold text-white">No users match your registration filters</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Try choosing a broader registration period, removing role filters, or clearing the search query.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-xl bg-[#FFD700] px-4 py-2 text-xs font-black text-black hover:bg-amber-400 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  <th className="pb-3">User Profile</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Registration Date</th>
                  <th className="pb-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const relativeDate = getRelativeRegistration(u.createdAt || u.joinedAt);
                  const isNewToday = relativeDate.includes('Today') || relativeDate === 'Just now';

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-[#FFD700]">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white">{u.name}</p>
                              {isNewToday && (
                                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5">
                                  NEW TODAY
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 font-mono">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            u.role === 'SELLER'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : u.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.role === 'AFFILIATE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 text-gray-300">
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-gray-400" /> {u.email}
                        </p>
                        <p className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                          <Phone className="h-3 w-3 text-gray-400" /> {u.phone}
                        </p>
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {u.status === 'active' ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Standard Active
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3" /> Flagged / Suspended
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5">
                        <div className="flex flex-col">
                          <span className="text-gray-300 font-medium font-mono text-[11px]">
                            {u.joinedAt}
                          </span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {relativeDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                            className={`rounded-xl px-3 py-1 text-[11px] font-bold transition ${
                              u.status === 'active'
                                ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {u.status === 'active' ? 'Flag Account' : 'Reactivate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.name)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500 hover:text-white transition"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
