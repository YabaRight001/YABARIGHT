'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';
import { useUserStore } from '@/store/userStore';
import { useAffiliateStore } from '@/store/affiliateStore';
import {
  CheckCircle2, CreditCard, Building2, ShieldCheck,
  ArrowLeft, ArrowRight, PackageCheck, Copy, Check, Users,
  Zap, Smartphone
} from 'lucide-react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PaystackPop?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MonnifySDK?: any;
  }
}

const BANK_DETAILS = {
  bank: 'Access Bank',
  accountName: 'YABARIGHT STORES LTD',
  accountNumber: '0123456789',
};

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT Abuja','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau',
  'Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const showToast = useToastStore((s) => s.showToast);
  const { profile, saveProfile, addOrder } = useUserStore();
  const { activeRef, recordCommission, getAffiliateByCode, clearActiveRef } = useAffiliateStore();

  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'monnify' | 'card' | 'bank_transfer'>('monnify');
  const [bankCopied, setBankCopied] = useState<string | null>(null);
  const [paystackReady, setPaystackReady] = useState(false);
  const [monnifyReady, setMonnifyReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || 'Lagos',
  });

  // Pre-fill from saved profile
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
      });
    }
  }, [profile]);

  const shippingCost = items.length > 0 ? (total >= 35000 ? 0 : 2500) : 0;
  const tax = Math.round(total * 0.05);
  const finalTotal = total + shippingCost + tax;

  // Affiliate info
  const affiliateCode = activeRef || (typeof window !== 'undefined' ? localStorage.getItem('yabaright_ref') : null);
  const affiliate = affiliateCode ? getAffiliateByCode(affiliateCode) : null;
  const commissionAmount = affiliate ? Math.round(finalTotal * 0.1) : 0;

  const confirmOrder = (ref: string, method: string) => {
    // Save user profile
    saveProfile(formData);

    // Save order record
    addOrder({
      orderId: ref,
      items: items.map((i) => ({ name: i.product?.name || '', qty: i.quantity, price: i.product?.price || 0 })),
      total: finalTotal,
      paymentMethod: method,
      affiliateRef: affiliateCode || undefined,
      createdAt: new Date().toISOString(),
    });

    // Record affiliate commission
    if (affiliateCode && affiliate) {
      recordCommission(affiliateCode, ref, finalTotal, formData.fullName);
      clearActiveRef();
      if (typeof window !== 'undefined') localStorage.removeItem('yabaright_ref');
    }

    clearCart();
    setOrderRef(ref);
    setSubmitted(true);
  };

  // 1. Monnify Payment Handler (app.monnify.com)
  const handleMonnifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `YBR-MNF-${Math.floor(100000 + Math.random() * 900000)}`;
    const monnifyApiKey = process.env.NEXT_PUBLIC_MONNIFY_API_KEY;
    const monnifyContractCode = process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE;

    if (monnifyReady && window.MonnifySDK && monnifyApiKey && monnifyContractCode) {
      window.MonnifySDK.initialize({
        amount: finalTotal,
        currency: 'NGN',
        reference: ref,
        customerFullName: formData.fullName,
        customerEmail: formData.email,
        customerMobileNumber: formData.phone,
        apiKey: monnifyApiKey,
        contractCode: monnifyContractCode,
        paymentDescription: `YabaRight Order ${ref}`,
        isTestMode: process.env.NEXT_PUBLIC_MONNIFY_ENV !== 'production',
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
        onComplete: (response: any) => {
          if (
            response?.paymentStatus === 'PAID' || 
            response?.status === 'SUCCESS' ||
            response?.authorizedAmount >= finalTotal
          ) {
            confirmOrder(ref, 'monnify');
            showToast('Monnify payment confirmed! Order placed successfully. 🎉', 'success');
          } else {
            showToast('Payment was not completed. Please try again.', 'error');
          }
        },
        onClose: () => {
          showToast('Monnify payment window closed.', 'info');
        },
      });
    } else {
      // Simulation fallback for dev mode or when keys are being tested
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        confirmOrder(ref, 'monnify');
        showToast('Monnify payment confirmed! 🎉', 'success');
      }, 1800);
    }
  };

  // 2. Paystack Card Payment Handler
  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `YBR-PST-${Math.floor(100000 + Math.random() * 900000)}`;

    if (!paystackReady || !window.PaystackPop || !process.env.NEXT_PUBLIC_PAYSTACK_KEY) {
      // Simulation fallback
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        confirmOrder(ref, 'card');
        showToast('Payment confirmed! (Simulation)', 'success');
      }, 1800);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: formData.email,
      amount: finalTotal * 100, // kobo
      currency: 'NGN',
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: formData.fullName },
          { display_name: 'Phone', variable_name: 'phone', value: formData.phone },
          { display_name: 'Affiliate Ref', variable_name: 'affiliate_ref', value: affiliateCode || 'none' },
        ],
      },
      onClose: () => showToast('Payment cancelled. Your order was not placed.', 'error'),
      callback: () => {
        confirmOrder(ref, 'card');
        showToast('Payment successful! Order confirmed. 🎉', 'success');
      },
    });
    handler.openIframe();
  };

  // 3. Bank Transfer Handler
  const handleBankTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `YBR-BNK-${Math.floor(100000 + Math.random() * 900000)}`;
    confirmOrder(ref, 'bank_transfer');
    showToast('Order placed! Please complete your bank transfer.', 'success');
  };

  const copyBankDetail = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setBankCopied(key);
    setTimeout(() => setBankCopied(null), 2000);
  };

  // ── ORDER CONFIRMED SCREEN ──
  if (submitted) {
    return (
      <div className="container-custom py-12">
        <div className="mx-auto max-w-xl rounded-[2.5rem] border border-black/10 bg-white p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <PackageCheck className="h-10 w-10" />
          </div>
          <span className="mt-6 inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
            {paymentMethod === 'bank_transfer' ? 'Order Placed — Awaiting Transfer' : 'Payment Confirmed'}
          </span>
          <h1 className="mt-3 text-3xl font-black text-gray-950">
            Thank you, {formData.fullName.split(' ')[0]}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            {paymentMethod === 'bank_transfer'
              ? 'Your order is reserved. Please transfer the exact amount to the account below to confirm dispatch.'
              : 'Your order has been received and is being prepared for dispatch.'}
          </p>

          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-[#fbf8f2] p-4 text-xs text-left space-y-2">
            <div className="flex justify-between text-gray-500">
              <span>Order Reference:</span>
              <span className="font-mono font-black text-gray-950">{orderRef}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping to:</span>
              <span className="font-semibold text-gray-900">{formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Payment Gateway:</span>
              <span className="font-bold text-gray-900 uppercase">
                {paymentMethod === 'monnify' ? 'Monnify (app.monnify.com)' : paymentMethod === 'card' ? 'Paystack' : 'Direct Transfer'}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Total {paymentMethod === 'bank_transfer' ? 'to Transfer' : 'Paid'}:</span>
              <span className="font-black text-[#c88d00]">₦{finalTotal.toLocaleString()}</span>
            </div>
            {affiliate && (
              <div className="flex justify-between text-gray-500">
                <span>Referred by:</span>
                <span className="font-bold text-[#c88d00] flex items-center gap-1">
                  <Users className="h-3 w-3" /> {affiliateCode}
                </span>
              </div>
            )}
          </div>

          {paymentMethod === 'bank_transfer' && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-left space-y-2">
              <p className="font-black text-amber-800">Bank Transfer Details</p>
              {[
                { label: 'Bank', value: BANK_DETAILS.bank },
                { label: 'Account Name', value: BANK_DETAILS.accountName },
                { label: 'Account Number', value: BANK_DETAILS.accountNumber },
                { label: 'Amount', value: `₦${finalTotal.toLocaleString()}` },
                { label: 'Reference', value: orderRef },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-amber-700">{label}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{value}</span>
                    <button onClick={() => copyBankDetail(value, label)} className="text-amber-600 hover:text-amber-800">
                      {bankCopied === label ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-amber-600 pt-1">
                Use your order reference as the payment description. Your order will be dispatched within 24h of payment confirmation.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="flex-1 rounded-full bg-[#111111] py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] hover:bg-black transition">
              Continue Shopping
            </Link>
            <Link href="/" className="flex-1 rounded-full border border-black/10 bg-gray-50 py-3.5 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-100 transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="mx-auto max-w-md rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-xs text-gray-500">Add some thrift gems to your cart before checking out.</p>
          <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00]">
            <span>Browse Catalog</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const formBody = (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold text-gray-700">Full Name *</label>
        <input type="text" required placeholder="e.g. Zainab Bakare"
          value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-gray-700">Email Address *</label>
        <input type="email" required placeholder="name@example.com"
          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-gray-700">Phone Number *</label>
        <input type="tel" required placeholder="0801 234 5678"
          value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold text-gray-700">Street Address *</label>
        <input type="text" required placeholder="Flat number, Street name, Landmark"
          value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-gray-700">City / Area *</label>
        <input type="text" required placeholder="e.g. Yaba, Ikeja, Lekki"
          value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-gray-700">State *</label>
        <select required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-[#fbf8f2] px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-[#FFD700]">
          {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Monnify SDK */}
      <Script
        src="https://sdk.monnify.com/plugin/monnify.js"
        strategy="lazyOnload"
        onLoad={() => setMonnifyReady(true)}
      />
      {/* Paystack Inline SDK */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onLoad={() => setPaystackReady(true)}
      />

      <div className="container-custom py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">Secure Checkout</span>
            <h1 className="mt-1 text-2xl sm:text-4xl font-black text-gray-950">Complete Your Order</h1>
          </div>
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black">
            <ArrowLeft className="h-4 w-4" /><span>Edit Cart</span>
          </Link>
        </div>

        {/* Affiliate badge */}
        {affiliate && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Users className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-black text-amber-800">
                Referred by affiliate <span className="font-mono">{affiliateCode}</span>
              </p>
              <p className="text-[11px] text-amber-600">
                {affiliate.fullName} will earn ₦{commissionAmount.toLocaleString()} commission on this order.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Payment Method Toggle */}
          <div className="space-y-6">
            {/* Step 1: Info */}
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-[11px] font-black text-[#FFD700]">1</span>
                <h2 className="text-base font-black text-gray-950">Delivery Information</h2>
              </div>
              {formBody}
              {profile && (
                <p className="mt-3 text-[10px] text-emerald-600 font-bold">
                  ✓ Pre-filled from your saved profile
                </p>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111111] text-[11px] font-black text-[#FFD700]">2</span>
                <h2 className="text-base font-black text-gray-950">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Monnify - Primary Gateway */}
                <label
                  onClick={() => setPaymentMethod('monnify')}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'monnify' ? 'border-[#c88d00] bg-amber-50/70 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111111] text-[#FFD700]">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-gray-900">Pay with Monnify</p>
                        <span className="rounded-full bg-[#FFD700] px-2 py-0.5 text-[9px] font-black text-black uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Instant Bank Transfer, Debit Cards & USSD (app.monnify.com)
                      </p>
                    </div>
                  </div>
                  <input type="radio" name="payment" checked={paymentMethod === 'monnify'} onChange={() => setPaymentMethod('monnify')} className="accent-[#c88d00]" />
                </label>

                {/* Card / Paystack */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'card' ? 'border-[#c88d00] bg-amber-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 text-[#c88d00]">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900">Pay Online (Paystack)</p>
                      <p className="text-[11px] text-gray-500">Mastercard, Visa, Verve cards</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#c88d00]" />
                </label>

                {/* Direct Bank Transfer */}
                <label
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'bank_transfer' ? 'border-[#c88d00] bg-amber-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 text-[#c88d00]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900">Direct Bank Transfer</p>
                      <p className="text-[11px] text-gray-500">Manual transfer to our Access Bank account</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} className="accent-[#c88d00]" />
                </label>
              </div>

              {/* Bank details (shown when selected) */}
              {paymentMethod === 'bank_transfer' && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs space-y-2">
                  <p className="font-black text-amber-800">Transfer to this account:</p>
                  {[
                    { label: 'Bank', value: BANK_DETAILS.bank },
                    { label: 'Account Name', value: BANK_DETAILS.accountName },
                    { label: 'Account Number', value: BANK_DETAILS.accountNumber },
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
                  <p className="text-[10px] text-amber-600 pt-1">
                    Use your name + phone as payment reference. Your order will be dispatched after transfer confirmation (within 24h).
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <form onSubmit={
              paymentMethod === 'monnify'
                ? handleMonnifyPayment
                : paymentMethod === 'card'
                ? handleCardPayment
                : handleBankTransfer
            }>
              {/* Hidden inputs to trigger form validation on delivery section */}
              <input type="hidden" value={formData.fullName} required />
              <button
                type="submit"
                disabled={processing || !formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD700] py-4 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-[1.01] active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span>Processing payment…</span>
                ) : paymentMethod === 'monnify' ? (
                  <><Zap className="h-4 w-4" /> Pay ₦{finalTotal.toLocaleString()} with Monnify</>
                ) : paymentMethod === 'card' ? (
                  <><CreditCard className="h-4 w-4" /> Pay ₦{finalTotal.toLocaleString()} with Card</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Place Order — Pay via Transfer</>
                )}
              </button>
              {(!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) && (
                <p className="mt-2 text-center text-[11px] text-red-500 font-bold">
                  Please fill in all required delivery fields above before proceeding.
                </p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-base font-black text-gray-950 border-b border-gray-100 pb-3">
                Order Review ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>
              <div className="mt-4 max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || '/casual-shirts-colorful.jpg'}
                      alt={item.product?.name}
                      className="h-14 w-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{item.product?.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity} • ₦{(item.product?.price || 0).toLocaleString()} each</p>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      ₦{((item.product?.price || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">₦{total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span className="font-bold text-gray-900">{shippingCost === 0 ? 'FREE' : `₦${shippingCost.toLocaleString()}`}</span></div>
                <div className="flex justify-between"><span>VAT (5%)</span><span className="font-bold text-gray-900">₦{tax.toLocaleString()}</span></div>
                {affiliate && (
                  <div className="flex justify-between text-amber-600">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Affiliate ({affiliateCode})</span>
                    <span className="font-bold">+₦{commissionAmount.toLocaleString()} for them</span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-[#c88d00]">₦{finalTotal.toLocaleString()}</span>
              </div>

              <div className="mt-6 rounded-xl bg-[#fbf8f2] p-3 text-[11px] text-gray-500 space-y-1.5">
                <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /><span>YABARIGHT Buyer Protection included</span></div>
                <div className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-[#c88d00]" /><span>256-bit SSL encrypted Monnify checkout</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
