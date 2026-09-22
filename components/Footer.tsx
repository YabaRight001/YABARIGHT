'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  CheckCircle2, 
  Send 
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
      {/* Value Proposition Highlights */}
      <div className="border-b border-white/10 py-10">
        <div className="container-custom">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/15 text-[#FFD700]">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Nationwide Delivery</p>
                <p className="text-xs text-gray-400">Doorstep drop in 2-4 business days</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/15 text-[#FFD700]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Verified Thrift Items</p>
                <p className="text-xs text-gray-400">Quality-checked and graded fits</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/15 text-[#FFD700]">
                <RotateCcw className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">7-Day Easy Returns</p>
                <p className="text-xs text-gray-400">Hassle-free exchange guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFD700]/15 text-[#FFD700]">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Secure Local Checkout</p>
                <p className="text-xs text-gray-400">Paystack, Cards & Direct Transfer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container-custom py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="YabaRight Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              The digital home of affordable fashion in Nigeria. We curate pre-owned gems, verified vintage picks, and fresh statement pieces that let you look rich while spending smart.
            </p>

            {/* Newsletter Subscription */}
            <div className="mt-6 max-w-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
                Join our VIP Drop Alert
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Get first pick on thrift drops below ₦5,000 every Friday.
              </p>
              {subscribed ? (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-950/40 p-3 text-xs text-green-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>You&apos;re in! We&apos;ll notify you on the next drop.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-[#161616] px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#FFD700]"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-[#FFD700] px-4 py-2.5 text-xs font-black text-black transition hover:bg-[#ffcc00]"
                  >
                    <span>Join</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/products" className="transition hover:text-[#FFD700]">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=thrift" className="transition hover:text-[#FFD700]">
                  Thrift Grade A
                </Link>
              </li>
              <li>
                <Link href="/products?category=new" className="transition hover:text-[#FFD700]">
                  Brand New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?category=deals" className="transition hover:text-[#FFD700]">
                  Hot Deals Below ₦9k
                </Link>
              </li>
              <li>
                <Link href="/products?sort=trending" className="transition hover:text-[#FFD700]">
                  Trending Streetwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/products?category=shoes" className="transition hover:text-[#FFD700]">
                  Shoes & Sneakers
                </Link>
              </li>
              <li>
                <Link href="/products?category=bags" className="transition hover:text-[#FFD700]">
                  Bags & Clutches
                </Link>
              </li>
              <li>
                <Link href="/products?category=shirts" className="transition hover:text-[#FFD700]">
                  Office & Casual Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=suits" className="transition hover:text-[#FFD700]">
                  Suits & Blazers
                </Link>
              </li>
              <li>
                <Link href="/products?category=clothes" className="transition hover:text-[#FFD700]">
                  Denim & Pants
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Community Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700]">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/affiliate" className="text-[#FFD700] font-bold transition hover:underline">
                  💰 Affiliate Program
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-[#FFD700]">
                  Buyer Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-[#FFD700]">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition hover:text-[#FFD700]">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-[#FFD700]">
                  My Bag
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="transition hover:text-[#FFD700]">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} YABARIGHT Marketplace Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <span>Built for Nigeria • Styled for Real Life</span>
            <span className="font-semibold text-gray-400">Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
