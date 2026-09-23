'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

interface EmailVerificationProps {
  email: string;
  userName?: string;
  userRole?: string;
  onVerified: () => void;
  onCancel?: () => void;
}

export function EmailVerificationModal({
  email,
  userName = 'User',
  userRole = 'BUYER',
  onVerified,
  onCancel,
}: EmailVerificationProps) {
  const { verifyEmail, resendVerificationCode, verificationCode, isLoading, error, clearError } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [currentOtp, setCurrentOtp] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    clearError();
    // Retrieve OTP or generate demo OTP
    let otp = verificationCode;
    if (!otp && typeof window !== 'undefined') {
      otp = localStorage.getItem(`verify_otp_${email.toLowerCase()}`);
    }
    if (!otp) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof window !== 'undefined') {
        localStorage.setItem(`verify_otp_${email.toLowerCase()}`, otp);
      }
    }
    setCurrentOtp(otp);

    // Countdown timer
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, verificationCode, clearError]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleAutofill = () => {
    const codeToUse = currentOtp || '123456';
    setDigits(codeToUse.split(''));
    showToast(`Code ${codeToUse} auto-filled!`, 'info');
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const newOtp = await resendVerificationCode(email);
      setCurrentOtp(newOtp);
      setResendCooldown(30);
      showToast(`A new 6-digit code (${newOtp}) has been sent to ${email}`, 'success');
    } catch {
      showToast('Failed to resend code', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      showToast('Please enter the full 6-digit verification code.', 'error');
      return;
    }

    try {
      await verifyEmail(email, fullCode);
      showToast(`Email verified successfully! Welcome, ${userName}. 🎉`, 'success');
      onVerified();
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-black/10 bg-white p-6 sm:p-10 shadow-xl max-w-lg mx-auto relative animate-in fade-in zoom-in-95 duration-200">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFD700]/20 text-[#c88d00] mb-4">
          <Mail className="h-8 w-8 text-[#c88d00]" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#c88d00]">
          Account Activation
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-gray-950">
          Verify Your Email
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
          We&apos;ve sent a 6-digit verification code to: <br />
          <strong className="text-gray-900 font-bold">{email}</strong>
        </p>
      </div>

      {/* Demo Test Code Banner */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#c88d00] flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">
              Demo Code: <span className="font-mono text-sm font-black text-[#c88d00]">{currentOtp || '123456'}</span>
            </p>
            <p className="text-[10px] text-gray-500">For testing: use this code or 123456</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAutofill}
          className="rounded-xl bg-[#111111] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition"
        >
          Auto-fill
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* 6-Digit OTP Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="h-12 w-11 sm:h-14 sm:w-13 text-center rounded-2xl border border-gray-200 bg-[#fbf8f2] text-xl font-black text-gray-950 outline-none transition focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/30"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || digits.join('').length < 6}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-4 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <span>{isLoading ? 'Verifying...' : `Activate ${userRole} Account`}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Resend & Support */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-gray-500">
        <p>
          Didn&apos;t receive the email?{' '}
          <button
            type="button"
            disabled={resendCooldown > 0}
            onClick={handleResend}
            className="font-black text-[#c88d00] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code Now'}
          </button>
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>YabaRight Secure Email Authentication</span>
        </div>
      </div>
    </div>
  );
}
