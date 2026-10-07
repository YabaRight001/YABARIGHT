'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  CreditCard, 
  CheckCircle2, 
  Send,
  ArrowRight
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-[#FFD700]/30 bg-[#0b0b0b] text-white">
      {/* 4-Pillar Trust Strip */}
      <div className="border-b border-white/10 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/15 text-[#FFD700]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">Nationwide Delivery</p>
                <p className="text-[11px] text-gray-400">2-4 days across all 36 states</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/15 text-[#FFD700]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">Verified Thrift Items</p>
                <p className="text-[11px] text-gray-400">Handpicked & quality-checked</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/15 text-[#FFD700]">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">5-Star Condition Standard</p>
                <p className="text-[11px] text-gray-400">Honest ratings on every piece</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFD700]/15 text-[#FFD700]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">Secure Local Checkout</p>
                <p className="text-[11px] text-gray-400">Instant Nigerian payment gateway</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* Brand & VIP Drop Alert (5 cols) */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="YabaRight Logo"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-gray-400">
              The digital home of affordable fashion in Nigeria. We curate pre-owned gems, verified vintage picks, and fresh statement pieces that let you look rich while spending smart.
            </p>

            {/* VIP Drop Alert Newsletter */}
            <div className="mt-6 max-w-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                VIP Drop Alert
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Get first pick on thrift drops below ₦10,000 every Friday.
              </p>
              {subscribed ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-950/40 p-2.5 text-xs text-green-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>You&apos;re subscribed to VIP drop notifications!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-[#161616] px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#FFD700]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-4 py-2 text-xs font-black text-black transition hover:bg-[#ffcc00]"
                  >
                    <span>Join</span>
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
              Shop Catalog
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/products" className="transition hover:text-[#FFD700]">
                  All Marketplace Items
                </Link>
              </li>
              <li>
                <Link href="/products?category=Sneakers" className="transition hover:text-[#FFD700]">
                  Sneakers & Trainers
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gadgets" className="transition hover:text-[#FFD700]">
                  Gadgets & Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=Shirts" className="transition hover:text-[#FFD700]">
                  Shirts & Silk Ties
                </Link>
              </li>
              <li>
                <Link href="/products?category=Jeans" className="transition hover:text-[#FFD700]">
                  Jeans & Pant Trousers
                </Link>
              </li>
              <li>
                <Link href="/gift-shop" className="transition hover:text-[#FFD700] text-[#FFD700] font-semibold">
                  🎁 Gift Shop & Invoices (Jerseys, Mugs, Tees)
                </Link>
              </li>
              <li>
                <Link href="/#aso-ebi" className="transition hover:text-[#FFD700] text-[#FFD700] font-semibold">
                  👑 Aso Ebi Made Easy
                </Link>
              </li>
              <li>
                <Link href="/products?category=Trade" className="transition hover:text-[#FFD700]">
                  🔄 Trade & Thrift Swap
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Trust & Portals (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                Marketplace Trust
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/#why-yabaright" className="transition hover:text-[#FFD700]">
                    Condition Grading
                  </Link>
                </li>
                <li>
                  <Link href="/#why-yabaright" className="transition hover:text-[#FFD700]">
                    Sizing & Fit Advice
                  </Link>
                </li>
                <li>
                  <Link href="/#why-yabaright" className="transition hover:text-[#FFD700]">
                    Seller Verification
                  </Link>
                </li>
                <li>
                  <Link href="/#about-us" className="transition hover:text-[#FFD700]">
                    Our Story (Who We Are)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                Portals & Hub
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/register" className="font-bold text-[#FFD700] hover:underline">
                    Sell on YabaRight
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="font-bold text-[#FFD700] hover:underline">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="transition hover:text-[#FFD700]">
                    Buyer Account
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="transition hover:text-[#FFD700]">
                    Shopping Bag
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-300">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} YabaRight Marketplace Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Nigeria • Styled for Real Life</span>
            <span className="font-semibold text-gray-400">Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
