'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate admin');
      }

      // Save to store
      loginAdmin(data.user, data.token);

      // Redirect to admin portal
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Official Admin Login
  const handleQuickDemoLogin = async () => {
    setEmail('yabatightofficial@gmail.com');
    setPassword('admin1234');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'yabatightofficial@gmail.com', password: 'admin1234' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');

      loginAdmin(data.user, data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#c88d00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-black border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/10 mb-4">
            <Shield className="h-8 w-8 text-[#FFD700]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            Admin <span className="text-[#FFD700]">Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Secure Management & Platform Oversight
          </p>
        </div>

        {/* 1-Click Quick Login Box */}
        <div className="mb-6 rounded-2xl border border-[#FFD700]/40 bg-[#161616] p-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#FFD700] mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Admin Access</span>
          </div>
          <p className="text-[11px] text-gray-300 mb-3">
            Click below to instantly log in as <span className="text-[#FFD700] font-bold">the admin</span>.
          </p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#c88d00] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 shadow-md"
          >
            <KeyRound className="h-4 w-4" />
            <span>{loading ? 'Authenticating...' : '⚡ 1-Click Admin Login'}</span>
          </button>
        </div>

        {/* Login Form Card */}
        <div className="rounded-[2rem] border border-white/10 bg-[#141414] p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-gray-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD700]" />
            <span>End-to-End Encrypted Admin Session</span>
          </div>
        </div>

        {/* Back to Marketplace */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-[#FFD700] transition"
          >
            ← Return to YABARIGHT Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
