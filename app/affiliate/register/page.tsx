'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAffiliateStore, type Affiliate } from '@/store/affiliateStore';
import { useToastStore } from '@/store/toastStore';
import {
  Users, Copy, Check, ArrowRight, AtSign, MessageSquare,
  Gift, TrendingUp, Wallet, Share2, Zap, ShieldCheck,
  ChevronLeft, Sparkles
} from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yabaright.com';

function AffiliateRegisterContent() {
  const searchParams = useSearchParams();
  const { registerAffiliate, getAffiliateByEmail } = useAffiliateStore();
  const showToast = useToastStore((s) => s.showToast);

  const initialTier = (searchParams.get('tier') as 'Basic' | 'Bronze' | 'Pro') || 'Basic';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipTier: initialTier,
  });

  useEffect(() => {
    const tier = searchParams.get('tier') as 'Basic' | 'Bronze' | 'Pro';
    if (tier && ['Basic', 'Bronze', 'Pro'].includes(tier)) {
      setForm((prev) => ({ ...prev, membershipTier: tier }));
    }
  }, [searchParams]);

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailLogin, setEmailLogin] = useState('');
  const [loginView, setLoginView] = useState(false);

  const incomeHighlights = [
    { icon: Users, label: '1. Referral Bonus', desc: '₦1,800 – ₦3,000 per member joined' },
    { icon: TrendingUp, label: '2. Business Referral', desc: '6% – 12% commission on product sales' },
    { icon: Zap, label: '3. Pro Earning', desc: 'Downliner team commissions (Pro Members)' },
    { icon: Gift, label: '4. Membership Bonus', desc: '₦12K | ₦60K | ₦300K profit-sharing support' },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) return;
    const result = registerAffiliate({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      membershipTier: form.membershipTier,
    });
    setAffiliate(result);
    showToast(`Welcome to YABARIGHT Affiliates (${form.membershipTier} Member)! 🎉`, 'success');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getAffiliateByEmail(emailLogin.trim().toLowerCase());
    if (found) {
      setAffiliate(found);
      showToast('Welcome back! 👋', 'success');
    } else {
      showToast('No affiliate account found for that email.', 'error');
    }
  };

  const copyCode = () => {
    if (!affiliate) return;
    navigator.clipboard.writeText(affiliate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    if (!affiliate) return;
    navigator.clipboard.writeText(`${SITE_URL}/products?ref=${affiliate.code}`);
    showToast('Referral link copied!', 'success');
  };

  if (affiliate) {
    return (
      <div className="container-custom py-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Success header */}
          <div className="rounded-[2.5rem] bg-[#111111] p-8 text-center text-white sm:p-12 shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFD700]/20">
              <Users className="h-10 w-10 text-[#FFD700]" />
            </div>
            <h1 className="mt-4 text-2xl font-black sm:text-3xl">
              You&apos;re In, {affiliate.fullName.split(' ')[0]}! 🎉
            </h1>
            <p className="mt-1 text-xs font-bold text-[#FFD700] uppercase tracking-wider">
              {affiliate.membershipTier || 'Active'} Affiliate Account
            </p>
            <p className="mt-2 text-sm text-white/60">
              Start sharing products and your referral code to unlock all 4 income streams.
            </p>

            {/* Code */}
            <div className="mt-8 rounded-2xl bg-white/10 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                Your Unique Referral Code
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="font-mono text-4xl font-black tracking-widest text-[#FFD700]">
                  {affiliate.code}
                </span>
                <button
                  onClick={copyCode}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Referral Link */}
            <div className="mt-4 rounded-2xl bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                Your Referral Link
              </p>
              <p className="mt-2 break-all font-mono text-xs text-white/70">
                {SITE_URL}/products?ref={affiliate.code}
              </p>
              <button
                onClick={copyLink}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2 text-xs font-black uppercase tracking-wide text-black hover:bg-[#ffcc00] transition"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Link
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/affiliate/dashboard"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition w-full"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white py-3.5 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition w-full"
            >
              Browse Products to Share
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        
        {/* Back Link to Overview */}
        <div className="mb-6">
          <Link
            href="/affiliate"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Affiliate Program Overview</span>
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left: Program summary */}
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
              YABARIGHT AFFILIATE PROGRAM
            </span>
            <h1 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">
              Solve Your <br />
              <span className="text-[#c88d00]">Income Problem</span>
            </h1>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              At YabaRight, we are building a business around products people use every day — clothing, food, gadgets, and more. Promote products, refer customers, and build a significant monthly income.
            </p>

            {/* Income Streams */}
            <div className="mt-8 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-gray-900">
                4 Types of Income You Can Earn:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incomeHighlights.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="rounded-2xl border border-black/10 bg-white p-3.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD700]/20 text-[#c88d00]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-xs font-black text-gray-950">{label}</p>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder Quote */}
            <div className="mt-6 rounded-2xl bg-[#111111] p-5 text-white">
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &ldquo;If you are ready to work, sell, promote, and grow, YabaRight is ready to grow with you.&rdquo;
              </p>
              <p className="mt-3 text-xs font-bold text-[#FFD700]">
                — Michael King, Founder, YabaRight
              </p>
            </div>
          </div>

          {/* Right: Registration / Login Box */}
          <div>
            <div className="rounded-[2.5rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
              {/* Tab toggle */}
              <div className="mb-6 flex rounded-xl border border-gray-200 p-1 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setLoginView(false)}
                  className={`flex-1 rounded-lg py-2 text-xs font-black uppercase tracking-wide transition ${
                    !loginView ? 'bg-[#111111] text-[#FFD700]' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Register Account
                </button>
                <button
                  type="button"
                  onClick={() => setLoginView(true)}
                  className={`flex-1 rounded-lg py-2 text-xs font-black uppercase tracking-wide transition ${
                    loginView ? 'bg-[#111111] text-[#FFD700]' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Existing Member
                </button>
              </div>

              {!loginView ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-gray-900">Affiliate Member Registration</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">Enter your details to generate your unique referral code.</p>
                  </div>

                  {/* Membership Tier Picker */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">
                      Select Membership Account *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { tier: 'Basic' as const, price: '₦9,800' },
                        { tier: 'Bronze' as const, price: '₦15,500' },
                        { tier: 'Pro' as const, price: '₦25,000' },
                      ].map((item) => (
                        <button
                          key={item.tier}
                          type="button"
                          onClick={() => setForm({ ...form, membershipTier: item.tier })}
                          className={`rounded-xl border p-2.5 text-center transition ${
                            form.membershipTier === item.tier
                              ? 'border-[#c88d00] bg-amber-50/70 text-gray-950 font-black'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <span className="block text-xs font-bold">{item.tier}</span>
                          <span className="block text-[11px] font-mono text-[#c88d00]">{item.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0801 234 5678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 leading-normal">
                    By registering you agree to YabaRight&apos;s applicable terms. Commissions and bonuses are awarded based on real activity and company policies.
                  </p>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-md"
                  >
                    <span>Get My Referral Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <h2 className="text-base font-black text-gray-900">Access Your Dashboard</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">Enter your registered email address.</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="The email you registered with"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AffiliateRegisterPage() {
  return (
    <Suspense fallback={<div className="container-custom py-16 text-center text-xs text-gray-400">Loading affiliate registration...</div>}>
      <AffiliateRegisterContent />
    </Suspense>
  );
}
