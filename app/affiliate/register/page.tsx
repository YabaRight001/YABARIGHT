'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAffiliateStore, type Affiliate } from '@/store/affiliateStore';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import {
  Users, Copy, Check, ArrowRight, TrendingUp,
  Zap, ShieldCheck, ChevronLeft, Sparkles, CreditCard,
  Building2, CheckCircle2, Award, DollarSign
} from 'lucide-react';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://yabaright.ng';

const TIER_PRICING: Record<'Basic' | 'Bronze' | 'Pro', { name: string; price: number; commission: string; referralBonus: string; bonusTier: string }> = {
  Basic: {
    name: 'Basic Membership',
    price: 9800,
    commission: '6% Product Commission',
    referralBonus: '₦1,800 Direct Referral',
    bonusTier: 'Standard Activity Pool',
  },
  Bronze: {
    name: 'Bronze Membership',
    price: 15500,
    commission: '8% - 10% Product Commission',
    referralBonus: '₦2,400 Direct Referral',
    bonusTier: 'Level 2 Bonus Eligible',
  },
  Pro: {
    name: 'Pro Membership',
    price: 25000,
    commission: '12% Product Commission',
    referralBonus: '₦3,000 Direct Referral',
    bonusTier: 'Pro Downliner & ₦300K Pool',
  },
};

const BANK_DETAILS = {
  bank: 'Access Bank',
  accountName: 'YABARIGHT STORES LTD',
  accountNumber: '0123456789',
};

function AffiliateRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerAffiliate, getAffiliateByEmail } = useAffiliateStore();
  const addUser = useAdminStore((s) => s.addUser);
  const { register: authRegister } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);

  const initialTier = (searchParams.get('tier') as 'Basic' | 'Bronze' | 'Pro') || 'Basic';

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [membershipTier, setMembershipTier] = useState<'Basic' | 'Bronze' | 'Pro'>(initialTier);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    socialHandle: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'monnify' | 'card' | 'bank_transfer'>('monnify');
  const [monnifyReady, setMonnifyReady] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [bankCopied, setBankCopied] = useState<string | null>(null);

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailLogin, setEmailLogin] = useState('');
  const [loginView, setLoginView] = useState(false);

  useEffect(() => {
    const tier = searchParams.get('tier') as 'Basic' | 'Bronze' | 'Pro';
    if (tier && ['Basic', 'Bronze', 'Pro'].includes(tier)) {
      setMembershipTier(tier);
    }
  }, [searchParams]);

  const selectedTierInfo = TIER_PRICING[membershipTier];

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setStep('payment');
  };

  const finalizeMembership = (paymentRef: string, method: string) => {
    const createdAffiliate = registerAffiliate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      socialHandle: formData.socialHandle,
      membershipTier,
      membershipFee: selectedTierInfo.price,
      isPaid: true,
      paymentRef,
    });

    // Also register into auth and admin store
    try {
      addUser({
        id: createdAffiliate.id,
        name: createdAffiliate.fullName,
        email: createdAffiliate.email,
        phone: createdAffiliate.phone,
        role: 'AFFILIATE',
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        ordersCount: 0,
      });

      authRegister(
        formData.fullName,
        formData.email,
        formData.password || 'affiliate123',
        'AFFILIATE'
      ).catch(() => {});
    } catch {}

    setAffiliate(createdAffiliate);
    setStep('success');
    showToast(`Membership Activated! Welcome to YabaRight Affiliates. 🎉`, 'success');
  };

  const handleMonnifyPayment = () => {
    const ref = `YBR-AFF-${Math.floor(100000 + Math.random() * 900000)}`;
    const apiKey = process.env.NEXT_PUBLIC_MONNIFY_API_KEY;
    const contractCode = process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE;

    if (monnifyReady && window.MonnifySDK && apiKey && contractCode) {
      window.MonnifySDK.initialize({
        amount: selectedTierInfo.price,
        currency: 'NGN',
        reference: ref,
        customerFullName: formData.fullName,
        customerEmail: formData.email,
        customerMobileNumber: formData.phone,
        apiKey: apiKey,
        contractCode: contractCode,
        paymentDescription: `YabaRight ${selectedTierInfo.name} Fee`,
        isTestMode: process.env.NEXT_PUBLIC_MONNIFY_ENV !== 'production',
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
        onComplete: (response: any) => {
          if (
            response?.paymentStatus === 'PAID' ||
            response?.status === 'SUCCESS' ||
            response?.authorizedAmount >= selectedTierInfo.price
          ) {
            finalizeMembership(ref, 'monnify');
          } else {
            showToast('Payment was not completed. Please try again.', 'error');
          }
        },
        onClose: () => {
          showToast('Payment window closed.', 'info');
        },
      });
    } else {
      // Simulation fallback for dev/testing
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        finalizeMembership(ref, 'monnify');
      }, 1800);
    }
  };

  const handleCardPayment = () => {
    const ref = `YBR-AFF-PST-${Math.floor(100000 + Math.random() * 900000)}`;

    if (!paystackReady || !window.PaystackPop || !process.env.NEXT_PUBLIC_PAYSTACK_KEY) {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        finalizeMembership(ref, 'card');
      }, 1800);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: formData.email,
      amount: selectedTierInfo.price * 100,
      currency: 'NGN',
      ref,
      callback: () => {
        finalizeMembership(ref, 'card');
      },
      onClose: () => showToast('Payment was cancelled.', 'error'),
    });
    handler.openIframe();
  };

  const handleBankTransfer = () => {
    const ref = `YBR-AFF-BNK-${Math.floor(100000 + Math.random() * 900000)}`;
    finalizeMembership(ref, 'bank_transfer');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getAffiliateByEmail(emailLogin.trim().toLowerCase());
    if (found) {
      setAffiliate(found);
      setStep('success');
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

  const copyBankDetail = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setBankCopied(key);
    setTimeout(() => setBankCopied(null), 2000);
  };

  // ── STEP 3: SUCCESS & REFERRAL LINK ──
  if (step === 'success' && affiliate) {
    return (
      <div className="container-custom py-10 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2.5rem] bg-[#0c0c0c] p-8 text-center text-white sm:p-12 shadow-2xl border border-[#FFD700]/30 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FFD700]/10 blur-3xl" />

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFD700]/20">
              <Award className="h-10 w-10 text-[#FFD700]" />
            </div>

            <span className="mt-6 inline-block rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-1 text-xs font-black uppercase tracking-wider text-emerald-400">
              ✓ Membership Active & Paid
            </span>

            <h1 className="mt-4 text-3xl font-black sm:text-4xl text-white">
              You&apos;re Officially in, {affiliate.fullName.split(' ')[0]}! 🎉
            </h1>

            <p className="mt-1 text-xs font-black text-[#FFD700] uppercase tracking-wider">
              {affiliate.membershipTier} Member Level
            </p>

            <p className="mt-3 text-sm text-gray-300 max-w-md mx-auto">
              Your unique referral links and code are activated. Start sharing and earning from product commissions, referrals, and team bonuses.
            </p>

            {/* Code Display */}
            <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#FFD700]">
                Your Official Referral Code
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-white">
                  {affiliate.code}
                </span>
                <button
                  onClick={copyCode}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-[#FFD700] hover:text-black transition"
                  title="Copy code"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Link Display */}
            <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-5 text-left">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Shareable Customer Catalog Link:
              </p>
              <p className="mt-1.5 break-all font-mono text-xs text-white/80 bg-black/40 p-2.5 rounded-xl border border-white/10">
                {SITE_URL}/products?ref={affiliate.code}
              </p>
              <button
                onClick={copyLink}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-5 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Referral Link</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/affiliate/dashboard"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#111111] py-4 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition w-full shadow-lg"
            >
              <span>Go to Affiliate Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-black/10 bg-white py-4 text-xs font-black uppercase tracking-wider text-gray-800 hover:bg-gray-50 transition w-full"
            >
              <span>Browse Products to Share</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://sdk.monnify.com/plugin/monnify.js" strategy="lazyOnload" onLoad={() => setMonnifyReady(true)} />
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" onLoad={() => setPaystackReady(true)} />

      <div className="container-custom py-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          
          <div className="mb-6">
            <Link
              href="/affiliate"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Affiliate Program Overview</span>
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
            {/* Left Column: Plan Benefits */}
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
                Official Membership Registration
              </span>
              <h1 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">
                Activate Your <br />
                <span className="text-[#c88d00]">{selectedTierInfo.name}</span>
              </h1>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Join our community of earning affiliates. Sell products people need every day, refer members, and build recurring weekly income.
              </p>

              {/* Selected Tier Highlights */}
              <div className="mt-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">One-Time Fee</span>
                    <p className="text-3xl font-black text-gray-950">₦{selectedTierInfo.price.toLocaleString()}</p>
                  </div>
                  <span className="rounded-full bg-[#FFD700] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black">
                    {membershipTier} Plan
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Product Sales:</strong> {selectedTierInfo.commission}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Direct Referrals:</strong> {selectedTierInfo.referralBonus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Bonus Qualifiers:</strong> {selectedTierInfo.bonusTier}</span>
                  </div>
                </div>
              </div>

              {/* Founder Quote */}
              <div className="mt-6 rounded-2xl bg-[#111111] p-5 text-white">
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  &ldquo;At YabaRight, you can look good, live better, and create an extra source of income.&rdquo;
                </p>
                <p className="mt-2 text-xs font-bold text-[#FFD700]">
                  — Michael King, Founder, YabaRight
                </p>
              </div>
            </div>

            {/* Right Column: Steps Form */}
            <div>
              <div className="rounded-[2.5rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
                
                {/* Tab toggle (Register vs Existing) */}
                <div className="mb-6 flex rounded-xl border border-gray-200 p-1 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => { setLoginView(false); setStep('info'); }}
                    className={`flex-1 rounded-lg py-2 text-xs font-black uppercase tracking-wide transition ${
                      !loginView ? 'bg-[#111111] text-[#FFD700]' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Register & Pay
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

                {loginView ? (
                  /* Existing Member Login */
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <h2 className="text-base font-black text-gray-900">Access Affiliate Dashboard</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">Enter your registered affiliate email address.</p>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={emailLogin}
                        onChange={(e) => setEmailLogin(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-3 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition"
                    >
                      <span>Open Member Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : step === 'info' ? (
                  /* Step 1: Member Info & Tier Choice */
                  <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                      <h2 className="text-base font-black text-gray-900">Step 1: Account Details</h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">Choose your tier and enter contact details.</p>
                    </div>

                    {/* Tier Switcher */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">Membership Tier *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Basic', 'Bronze', 'Pro'] as const).map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setMembershipTier(tier)}
                            className={`rounded-xl border p-2.5 text-center transition ${
                              membershipTier === tier
                                ? 'border-[#111111] bg-[#111111] text-[#FFD700] font-black shadow-xs'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-xs font-bold">{tier}</span>
                            <span className="block text-[11px] font-mono">₦{TIER_PRICING[tier].price.toLocaleString()}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Zainab Bakare"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0801 234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-gray-700">Social Media Handle (Optional)</label>
                      <input
                        type="text"
                        placeholder="@instagram or TikTok handle"
                        value={formData.socialHandle}
                        onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD700] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-md"
                    >
                      <span>Proceed to Payment (₦{selectedTierInfo.price.toLocaleString()})</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  /* Step 2: Payment Step */
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h2 className="text-base font-black text-gray-900">Step 2: Complete Membership Payment</h2>
                        <p className="text-[11px] text-gray-500">Select payment method to activate account.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep('info')}
                        className="text-xs font-bold text-[#c88d00] hover:underline"
                      >
                        Edit Details
                      </button>
                    </div>

                    {/* Price Summary */}
                    <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase">{selectedTierInfo.name}</span>
                        <p className="text-xl font-black text-gray-950">₦{selectedTierInfo.price.toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-black text-[#c88d00] bg-white px-3 py-1 rounded-full border border-amber-200">
                        One-Time
                      </span>
                    </div>

                    {/* Payment Gateways */}
                    <div className="space-y-2.5">
                      {/* Monnify */}
                      <label
                        onClick={() => setPaymentMethod('monnify')}
                        className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                          paymentMethod === 'monnify' ? 'border-[#c88d00] bg-amber-50/70' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111] text-[#FFD700]">
                            <Zap className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-black text-gray-900">Pay with Monnify</p>
                              <span className="rounded-full bg-[#FFD700] px-1.5 py-0.2 text-[8px] font-black text-black">Recommended</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Instant Bank Transfer & Cards</p>
                          </div>
                        </div>
                        <input type="radio" name="pay_affiliate" checked={paymentMethod === 'monnify'} onChange={() => setPaymentMethod('monnify')} className="accent-[#c88d00]" />
                      </label>

                      {/* Paystack */}
                      <label
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                          paymentMethod === 'card' ? 'border-[#c88d00] bg-amber-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-black/5 text-[#c88d00]">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900">Pay Online (Paystack)</p>
                            <p className="text-[10px] text-gray-500">Mastercard, Visa, Verve</p>
                          </div>
                        </div>
                        <input type="radio" name="pay_affiliate" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#c88d00]" />
                      </label>

                      {/* Direct Bank Transfer */}
                      <label
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                          paymentMethod === 'bank_transfer' ? 'border-[#c88d00] bg-amber-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-black/5 text-[#c88d00]">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900">Direct Bank Transfer</p>
                            <p className="text-[10px] text-gray-500">Manual transfer to Access Bank</p>
                          </div>
                        </div>
                        <input type="radio" name="pay_affiliate" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} className="accent-[#c88d00]" />
                      </label>
                    </div>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs space-y-2">
                        <p className="font-black text-amber-800">Transfer Fee to:</p>
                        {[
                          { label: 'Bank', value: BANK_DETAILS.bank },
                          { label: 'Account Name', value: BANK_DETAILS.accountName },
                          { label: 'Account Number', value: BANK_DETAILS.accountNumber },
                          { label: 'Amount', value: `₦${selectedTierInfo.price.toLocaleString()}` },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-amber-700">{label}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{value}</span>
                              <button type="button" onClick={() => copyBankDetail(value, label)} className="text-amber-600 hover:text-amber-800">
                                {bankCopied === label ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={
                        paymentMethod === 'monnify'
                          ? handleMonnifyPayment
                          : paymentMethod === 'card'
                          ? handleCardPayment
                          : handleBankTransfer
                      }
                      disabled={processing}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-4 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition shadow-lg disabled:opacity-60"
                    >
                      {processing ? (
                        <span>Processing payment…</span>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                          <span>Pay ₦{selectedTierInfo.price.toLocaleString()} & Activate Account</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AffiliateRegisterPage() {
  return (
    <Suspense fallback={<div className="container-custom py-16 text-center text-xs text-gray-400">Loading affiliate registration...</div>}>
      <AffiliateRegisterContent />
    </Suspense>
  );
}
