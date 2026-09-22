'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useToastStore } from '@/store/toastStore';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShoppingBag, Store, Shield } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { loginAdmin } = useAdminAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [role, setRole] = useState<'BUYER' | 'SELLER' | 'ADMIN'>('BUYER');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      const upper = roleParam.toUpperCase();
      if (upper === 'SELLER') setRole('SELLER');
      else if (upper === 'ADMIN') setRole('ADMIN');
      else setRole('BUYER');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 4) {
      setValidationError('Password must be at least 4 characters');
      return;
    }

    try {
      const registeredUser = await register(
        formData.name,
        formData.email,
        formData.password,
        role
      );

      // If registered as admin, also authenticate into admin store
      if (role === 'ADMIN') {
        loginAdmin(
          {
            id: registeredUser.id,
            name: registeredUser.name,
            email: registeredUser.email,
            role: 'ADMIN',
            avatar: registeredUser.avatar || '',
            loginTime: new Date().toISOString(),
          },
          `adm_tok_${Date.now()}`
        );
      }

      showToast(`Welcome to YabaRight, ${formData.name}! Account created. 🎉`, 'success');

      // Direct to respective destination
      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'SELLER') {
        router.push('/dashboard');
      } else {
        router.push('/products');
      }
    } catch (err: any) {
      // Error is set in store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
          Get Started
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-gray-950">
          Create Your Account
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Join YabaRight as a buyer, seller, or staff administrator.
        </p>
      </div>

      {(error || validationError) && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
          {error || validationError}
        </div>
      )}

      {/* Account Role Selector */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-bold text-gray-700">
          Account Type:
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setRole('BUYER')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl border py-2.5 px-2 text-[11px] sm:text-xs font-black uppercase tracking-wider transition ${
              role === 'BUYER'
                ? 'border-[#111111] bg-[#111111] text-[#FFD700] shadow-sm'
                : 'border-gray-200 bg-[#fbf8f2] text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buyer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('SELLER')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl border py-2.5 px-2 text-[11px] sm:text-xs font-black uppercase tracking-wider transition ${
              role === 'SELLER'
                ? 'border-[#111111] bg-[#111111] text-[#FFD700] shadow-sm'
                : 'border-gray-200 bg-[#fbf8f2] text-gray-700 hover:border-gray-300'
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Seller</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl border py-2.5 px-2 text-[11px] sm:text-xs font-black uppercase tracking-wider transition ${
              role === 'ADMIN'
                ? 'border-[#111111] bg-[#111111] text-[#FFD700] shadow-sm'
                : 'border-gray-200 bg-[#fbf8f2] text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-bold text-gray-700">
            {role === 'SELLER' ? 'Store / Brand Name' : role === 'ADMIN' ? 'Admin Full Name' : 'Full Name'}
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={role === 'SELLER' ? 'e.g. Lagos Vintage Thrift' : 'e.g. John Doe'}
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 pl-10 text-xs text-gray-900 outline-none transition focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20"
            />
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

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
          <label htmlFor="password" className="mb-1.5 block font-bold text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create strong password"
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

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block font-bold text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 pl-10 text-xs text-gray-900 outline-none transition focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
      >
        <span>{isLoading ? 'Creating Account...' : `Register as ${role}`}</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-6 text-center text-xs text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#c88d00] hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="rounded-[2rem] bg-white p-8 text-center text-xs font-bold text-gray-500">
        Loading signup form...
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
