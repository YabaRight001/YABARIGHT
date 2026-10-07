'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer } from '@/components/Toast';
import { useAdminStore } from '@/store/adminStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
  Store,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  LogOut,
  Shield,
  KeyRound,
  Lock,
  Gift,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { vendors, products, users } = useAdminStore();
  const { isAdminAuthenticated, adminUser, logoutAdmin } = useAdminAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If on login page, render standalone page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Handle client-side mount check
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FFD700]">
          <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-ping" />
          <span>Loading Admin Portal...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show unauthorized gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full rounded-[2rem] border border-[#FFD700]/30 bg-[#141414] p-8 text-center shadow-2xl">
          <div className="mx-auto inline-flex items-center justify-center p-3 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 mb-4">
            <Lock className="h-8 w-8 text-[#FFD700]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white mb-2">
            Admin Authentication Required
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Please log in with verified administrator credentials to access the YABARIGHT Admin Portal.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD700] px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#e6c200] active:scale-95 shadow-md shadow-[#FFD700]/15"
            >
              <KeyRound className="h-4 w-4" />
              <span>Go to Admin Login</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-5 py-3 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingVendorsCount = vendors.filter((v) => !v.isVerified).length;

  const adminNav = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Product Catalog',
      href: '/admin/products',
      icon: Package,
      badge: `${products.length}`,
    },
    {
      name: 'Gift Shop Pricing',
      href: '/admin/gift-shop',
      icon: Gift,
      badge: 'PM Rates',
      badgeColor: 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30',
    },
    {
      name: 'Vendor Verification',
      href: '/admin/vendors',
      icon: ShieldCheck,
      badge: pendingVendorsCount > 0 ? `${pendingVendorsCount} Pending` : 'Verified',
      badgeColor: pendingVendorsCount > 0 ? 'bg-amber-500 text-black font-black' : 'bg-emerald-500/20 text-emerald-400',
    },
    {
      name: 'User Moderation',
      href: '/admin/users',
      icon: Users,
      badge: `${users.length}`,
    },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex flex-col lg:flex-row">
      {/* ── Left Sidebar ── */}
      <aside className="w-full lg:w-72 bg-[#121212] border-b lg:border-b-0 lg:border-r border-[#FFD700]/15 flex flex-col justify-between p-4 lg:p-6 flex-shrink-0">
        <div>
          {/* Logo & Admin Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="YabaRight Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FFD700] block">
                  Admin Console
                </span>
                <span className="text-[10px] text-gray-400">YabaRight Management</span>
              </div>
            </Link>

            <span className="rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40 px-2 py-0.5 text-[9px] font-black uppercase text-[#FFD700]">
              PRO
            </span>
          </div>

          {/* Admin User Profile Pill */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl bg-[#1e1e1e] border border-[#FFD700]/30 flex items-center justify-center">
              {adminUser?.avatar ? (
                <img src={adminUser.avatar} alt="Admin Avatar" className="h-full w-full object-cover" />
              ) : (
                <Shield className="h-5 w-5 text-[#FFD700]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{adminUser?.name || 'Chief Admin'}</p>
              <p className="text-[10px] text-[#FFD700] font-semibold truncate">{adminUser?.email || 'admin@yabaright.ng'}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 mb-2">
              Core Management
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-3.5 py-3 text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#FFD700] text-black font-black shadow-md shadow-[#FFD700]/15'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-black text-[#FFD700]' : item.badgeColor || 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Platform Shortcut & Logout */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
          <Link
            href="/products"
            className="flex items-center justify-between rounded-2xl bg-white/5 hover:bg-white/10 px-4 py-3 text-xs font-bold text-gray-300 hover:text-white transition"
          >
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#FFD700]" />
              <span>Back to Storefront</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out of Portal</span>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main Content Body ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Strip */}
        <header className="h-16 bg-[#121212] border-b border-[#FFD700]/15 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Admin</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-bold capitalize">
              {pathname.replace('/admin', '').replace('/', '') || 'Dashboard Overview'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1c1c1c] border border-white/10 px-3 py-1.5 rounded-full text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-300 font-bold">System Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
