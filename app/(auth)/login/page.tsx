'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData.email, formData.password);
      showToast('Welcome back! Logged in successfully.', 'success');
      router.push('/products');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
          Welcome Back
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-gray-950">
          Login to YabaRight
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Access your bag, saved thrift items, and track orders.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 text-xs">
        <div>
          <label htmlFor="email" className="mb-1.5 block font-bold text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 pl-10 text-xs text-gray-900 outline-none transition focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block font-bold text-gray-700">
              Password
            </label>
            <button type="button" className="text-[11px] font-bold text-[#c88d00] hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 pl-10 pr-10 text-xs text-gray-900 outline-none transition focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
      >
        <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-6 text-center text-xs text-gray-600">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="font-bold text-[#c88d00] hover:underline">
          Create one free
        </Link>
      </p>
    </form>
  );
}
