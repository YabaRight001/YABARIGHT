import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Award,
  Gift,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const metadata = {
  title: 'Affiliate Program | YABARIGHT - Solve Your Income Problem',
  description: 'Join the YabaRight Affiliate Program. Earn referral bonuses, 6%-12% product sales commission, Pro earnings, and membership bonuses.',
};

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-[#fbf8f2] text-gray-900 pb-20">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden bg-[#0c0c0c] text-white py-16 sm:py-24 border-b border-[#FFD700]/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFD700]/15 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#FFD700] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Official YabaRight Affiliate Program
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            SOLVE YOUR <br className="hidden sm:inline" />
            <span className="text-[#FFD700] bg-gradient-to-r from-[#FFD700] via-[#ffe566] to-[#e8941f] bg-clip-text text-transparent">
              INCOME PROBLEM
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At YabaRight, we are building a business around products people use every day and cannot easily live without — <strong>clothing, food, gadgets, and more</strong>.
          </p>

          <p className="mt-3 text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our goal is simple: give our members the opportunity to earn by selling products, referring customers, and growing their business on the platform. With consistency, dedication, and the right strategy, members can build a significant monthly income.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/affiliate/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg shadow-[#FFD700]/20"
            >
              <span>Get Started & Register</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/affiliate/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white hover:bg-white/10 transition"
            >
              <span>Member Dashboard</span>
              <ChevronRight className="h-4 w-4 text-[#FFD700]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-custom max-w-5xl mx-auto px-4 mt-12 sm:mt-16 space-y-16">
        
        {/* Section 1: 4 Types of Income */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
              Multiple Revenue Streams
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 mt-1">
              4 TYPES OF INCOME
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Maximize your financial potential with diverse, rewarding earning models designed for consistent growth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: Referral Bonus */}
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Income Type 1
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-950 mt-4">
                1. REFERRAL BONUS
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Earn a referral bonus when someone joins YabaRight through your referral.
              </p>

              <div className="mt-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bonus Range</span>
                <span className="text-2xl font-black text-emerald-800">
                  ₦1,800 – ₦3,000 <span className="text-xs font-normal text-emerald-700">per person</span>
                </span>
                <p className="text-[11px] text-gray-500 mt-1">
                  Depending on the membership account they register with.
                </p>
              </div>
            </div>

            {/* Card 2: Business Referral Bonus */}
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-[#c88d00] bg-amber-50 px-3 py-1 rounded-full">
                  Income Type 2
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-[#c88d00]">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-950 mt-4">
                2. BUSINESS REFERRAL BONUS
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Earn commission on products sold through your referral links on WhatsApp and social media.
              </p>

              <div className="mt-5 rounded-2xl bg-amber-50/60 border border-amber-100 p-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Commission Rate</span>
                <span className="text-2xl font-black text-amber-800">
                  6% – 12% <span className="text-xs font-normal text-amber-700">per product sale</span>
                </span>
                <p className="text-[11px] text-gray-500 mt-1">
                  Your commission percentage depends on the type of membership you register for.
                </p>
              </div>
            </div>

            {/* Card 3: Pro Earning */}
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  Income Type 3
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-950 mt-4">
                3. PRO EARNING
              </h3>
              <div className="inline-block mt-2 rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-black text-purple-800 uppercase tracking-wider">
                Strictly for Pro Members
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                Pro Members can earn from the business activities and income generated by members placed under them (downliners), subject to the applicable YabaRight terms.
              </p>
            </div>

            {/* Card 4: Membership Bonus */}
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  Income Type 4
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Gift className="h-5 w-5" />
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-950 mt-4">
                4. MEMBERSHIP BONUS
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                The Membership Bonus is a special profit-sharing/support bonus from YabaRight for members who demonstrate seriousness, consistency, activity, and commitment toward growing their business on the platform.
              </p>

              <div className="mt-4 rounded-2xl bg-blue-50/60 border border-blue-100 p-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Bonus Tiers & Phases</span>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  <span className="rounded-xl bg-white px-3 py-1 text-sm font-black text-blue-900 border border-blue-200">
                    ₦12,000
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="rounded-xl bg-white px-3 py-1 text-sm font-black text-blue-900 border border-blue-200">
                    ₦60,000
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="rounded-xl bg-white px-3 py-1 text-sm font-black text-blue-900 border border-blue-200">
                    ₦300,000
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200/60 text-[11px] text-blue-900 font-medium space-y-1">
                  <p><strong>₦12,000 MEMBERSHIP BONUS:</strong> Qualifying account: Level 2 account.</p>
                  <p className="text-gray-500">
                    YabaRight may award these bonuses at its discretion to qualifying active members to support purchasing products and growing their business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Membership Options */}
        <section className="pt-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#c88d00]">
              Choose Your Tier
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 mt-1">
              MEMBERSHIP OPTIONS
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Select an account level that matches your ambition. Members may be able to operate multiple accounts subject to YabaRight&apos;s applicable terms and policies.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic Tier */}
            <div className="rounded-[2.5rem] border border-black/10 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Starter
                </span>
                <h3 className="text-xl font-black text-gray-950 mt-3">Basic Membership</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-950">₦9,800</span>
                  <span className="text-xs text-gray-400 font-bold">one-time</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ideal for beginners getting started with direct product referral and WhatsApp sales.
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Direct Referral Bonus Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>6% Product Sales Commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Personal Referral Code & Links</span>
                  </div>
                </div>
              </div>

              <Link
                href="/affiliate/register?tier=Basic"
                className="mt-8 block text-center rounded-full bg-gray-100 py-3 text-xs font-black uppercase tracking-wider text-gray-900 hover:bg-gray-200 transition"
              >
                Join as Basic
              </Link>
            </div>

            {/* Bronze Tier */}
            <div className="rounded-[2.5rem] border border-amber-300 bg-gradient-to-b from-amber-50/40 to-white p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-xl transition relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#111111] px-4 py-1 text-[10px] font-black uppercase tracking-widest text-[#FFD700] shadow-sm">
                Most Popular
              </span>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Intermediate
                </span>
                <h3 className="text-xl font-black text-gray-950 mt-3">Bronze Membership</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#c88d00]">₦15,500</span>
                  <span className="text-xs text-gray-400 font-bold">one-time</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Accelerated earnings with higher sales commissions and faster bonus level qualification.
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-gray-700 border-t border-amber-100 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Enhanced Referral Bonus Range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>8% - 10% Product Sales Commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Eligible for Level 2 Membership Bonus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Priority Support & Live Analytics</span>
                  </div>
                </div>
              </div>

              <Link
                href="/affiliate/register?tier=Bronze"
                className="mt-8 block text-center rounded-full bg-[#c88d00] py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#b07b00] transition shadow-md"
              >
                Join as Bronze
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="rounded-[2.5rem] border border-black/80 bg-[#111111] text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFD700] px-3 py-1 rounded-full">
                  Ultimate
                </span>
                <h3 className="text-xl font-black text-white mt-3">Pro Membership</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#FFD700]">₦25,000</span>
                  <span className="text-xs text-white/50 font-bold">one-time</span>
                </div>
                <p className="text-xs text-white/60 mt-2">
                  Unlocks all 4 income streams including exclusive Pro Downliner earnings and top-tier bonuses.
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    <span>Maximum ₦3,000 Referral Bonus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    <span>Full 12% Product Sales Commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    <span>Exclusive Pro Downliner Earnings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#FFD700] flex-shrink-0" />
                    <span>Access to ₦300K Profit-Sharing Tiers</span>
                  </div>
                </div>
              </div>

              <Link
                href="/affiliate/register?tier=Pro"
                className="mt-8 block text-center rounded-full bg-[#FFD700] py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition"
              >
                Join as Pro Member
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Work and Earn Policy & Transparency */}
        <section className="rounded-[2.5rem] border border-black/10 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#c88d00]">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tight">
                WORK AND EARN
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>YabaRight is designed around real product sales and business activity.</strong>
              </p>
              <p>
                You work, promote products, generate sales, refer customers, and earn according to the applicable commission structure.
              </p>
              <p className="bg-[#fbf8f2] rounded-2xl p-4 border border-black/5 text-gray-700">
                Any promotional or membership bonus is not a guaranteed entitlement. It is provided at the discretion of YabaRight and may depend on activity, eligibility, availability, and other company conditions.
              </p>
              <p>
                YabaRight will pay eligible direct earnings according to its applicable payment terms. Membership bonuses are discretionary and are not guaranteed returns on membership fees.
              </p>
              <p className="font-bold text-gray-900">
                Our goal is to help serious, active, and determined members build and grow their businesses.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Start Your Journey & Founder's Message */}
        <section className="rounded-[2.5rem] bg-[#111111] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD700]">
              Get In Touch & Take Action
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              START YOUR YABARIGHT JOURNEY TODAY
            </h2>
            
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              If you are ready to work, sell, promote, and grow, YabaRight is ready to grow with you.
            </p>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">With gratitude,</p>
                <p className="text-lg font-black text-[#FFD700] mt-0.5">Michael King</p>
                <p className="text-xs text-white/70">Founder, YabaRight</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/affiliate/register"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#ffcc00] transition shadow-md"
                >
                  <span>Register Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-white/10 transition"
                >
                  <span>Browse Products</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
