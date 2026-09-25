'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { CheckCircle2, AlertCircle, ArrowRight, Mail, Sparkles } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const token = searchParams.get('token');

  const { verifyEmail, user } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!email || (!code && !token)) {
      setStatus('error');
      setErrorMessage('Missing verification parameters. Please use the link sent to your email.');
      return;
    }

    async function handleAutoVerify() {
      try {
        await verifyEmail(email!, (code || token)!);
        setStatus('success');
        showToast('Email verified successfully! 🎉', 'success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Verification link is invalid or has expired.');
      }
    }

    handleAutoVerify();
  }, [email, code, token, verifyEmail, showToast]);

  return (
    <div className="container-custom py-12 sm:py-20">
      <div className="mx-auto max-w-md rounded-[2.5rem] border border-black/10 bg-white p-8 text-center shadow-xl sm:p-10">
        {status === 'verifying' && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-[#c88d00] animate-pulse">
              <Mail className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-black text-gray-950">Verifying Your Email...</h1>
            <p className="mt-2 text-xs text-gray-500">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-800">
              Verified
            </span>
            <h1 className="mt-3 text-2xl font-black text-gray-950">Email Verified! 🎉</h1>
            <p className="mt-2 text-xs text-gray-600">
              Your email <strong className="text-gray-900">{email}</strong> has been successfully verified. You can now log in and access your account.
            </p>

            <div className="mt-8 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="rounded-full border border-black/10 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Go to Marketplace
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
              <AlertCircle className="h-9 w-9" />
            </div>
            <h1 className="mt-4 text-2xl font-black text-gray-950">Verification Failed</h1>
            <p className="mt-2 text-xs text-red-600">{errorMessage}</p>

            <div className="mt-8 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition"
              >
                <span>Go to Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-black/10 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="container-custom py-20 text-center text-xs text-gray-400">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
