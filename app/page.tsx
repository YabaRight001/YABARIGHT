'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { sampleProducts } from '@/lib/mockProducts';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { ToastContainer } from '@/components/Toast';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  Ruler,
  CheckCircle2,
  Store,
  DollarSign
} from 'lucide-react';

const visualCategories = [
  {
    title: 'Suits & Tailored Blazers',
    caption: 'Executive 2-piece sets & sharp cuts',
    image: '/suit-blue-1.jpg',
    href: '/products?category=suits',
    count: '890+ fits',
    tag: 'Grade A Thrift'
  },
  {
    title: 'Corporate Shoes & Loafers',
    caption: 'Leather Oxfords, brogues & commute slip-ons',
    image: '/male-shoes-collection.jpg',
    href: '/products?category=shoes',
    count: '2,340+ pairs',
    tag: 'Verified Leather'
  },
  {
    title: 'Leather Bags & Totes',
    caption: 'Structured workbags & daily crossbody picks',
    image: '/bag-handbag.jpg',
    href: '/products?category=bags',
    count: '1,850+ items',
    tag: 'Trending'
  },
  {
    title: 'Cotton Shirts & Polos',
    caption: 'Breathable casual rolls & crisp office stripes',
    image: '/casual-shirts-colorful.jpg',
    href: '/products?category=shirts',
    count: '1,560+ shirts',
    tag: 'Under ₦10k'
  },
  {
    title: 'Denim Jeans & Trousers',
    caption: 'Straight cuts, vintage washes & streetwear',
    image: '/jeans-folded.jpg',
    href: '/products?category=clothing',
    count: '4,200+ pieces',
    tag: 'Daily Steals'
  },
  {
    title: "Women's Heels & Flats",
    caption: 'Classic black pumps & comfortable ballet flats',
    image: '/heels-black-pair.jpg',
    href: '/products?category=shoes',
    count: '1,120+ pairs',
    tag: 'Fresh Drop'
  },
];

export default function Home() {
  const categoryHeadingRef = useRef<HTMLDivElement>(null);
  const editorialSectionRef = useRef<HTMLDivElement>(null);

  // Progressive enhancement: Deliberate entrance animation for Category Discovery and Editorial Feature
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    // Check for GSAP availability with progressive fallback
    const initEntrance = () => {
      const gsap = (window as any).gsap;
      if (!gsap) return;

      try {
        // 1. Deliberate entrance for Category Discovery heading
        if (categoryHeadingRef.current) {
          gsap.fromTo(
            categoryHeadingRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: 0.1 }
          );
        }

        // 2. Deliberate entrance for Editorial Feature section using IntersectionObserver
        if (editorialSectionRef.current && 'IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting && editorialSectionRef.current) {
                  gsap.fromTo(
                    editorialSectionRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
                  );
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.15 }
          );
          observer.observe(editorialSectionRef.current);
        }
      } catch {
        // Graceful fallback: CSS layout is completely visible by default
      }
    };

    if ((window as any).gsap) {
      initEntrance();
    } else {
      const timer = setTimeout(initEntrance, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Curated Featured Drop products (8 items)
  const featuredDropProducts = sampleProducts.slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#111111]">
      <Navbar />

      <main className="flex-1 pb-16 lg:pb-0">
        
        {/* ================= 1. FASHION-EDITORIAL HERO CAROUSEL ================= */}
        <HeroCarousel />

        {/* Quick Discovery Navigation Strip */}
        <div className="border-y border-[#FFD700]/20 bg-[#0e0e0e] py-3">
          <div className="container-custom">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
              {[
                { name: 'All Marketplace', href: '/products' },
                { name: 'Suits Below ₦30k', href: '/products?category=suits&max_price=30000' },
                { name: 'Corporate Shoes ₦22.9k', href: '/products?category=shoes&max_price=23000' },
                { name: 'Office Shirts ₦9.9k', href: '/products?category=shirts&max_price=10000' },
                { name: 'Leather Bags', href: '/products?category=bags' },
                { name: 'Vintage Denim', href: '/products?category=clothing' },
                { name: '💰 Affiliate Program', href: '/affiliate' },
              ].map((pill) => (
                <Link
                  key={pill.name}
                  href={pill.href}
                  className="whitespace-nowrap rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-black"
                >
                  {pill.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 2. VISUAL CATEGORY DISCOVERY SECTION ================= */}
        <section id="categories" className="py-12 sm:py-16 lg:py-20">
          <div className="container-custom">
            
            {/* Section Header with deliberate entrance */}
            <div ref={categoryHeadingRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                  Visual Discovery
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                  Explore Curated Categories
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-xl">
                  Handpicked Lagos thrift grails, Grade A corporate attire, and daily wardrobe staples.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111] hover:text-[#c88d00] transition group self-start sm:self-auto"
              >
                <span>View Full Directory</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Visual Category Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {visualCategories.map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD700]/60 hover:shadow-xl"
                >
                  {/* Category Image with Gradient */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    {/* Top Tag Pill */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#FFD700] border border-white/10">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Bottom Title & Piece Count */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h3 className="text-xs sm:text-sm font-black text-white leading-snug drop-shadow-sm">
                        {cat.title}
                      </h3>
                      <p className="mt-0.5 text-[10px] font-bold text-[#FFD700]">
                        {cat.count}
                      </p>
                    </div>
                  </div>

                  {/* Micro caption */}
                  <div className="p-2.5 bg-white">
                    <p className="line-clamp-1 text-[11px] text-gray-500 font-medium">
                      {cat.caption}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 3. FEATURED DROP PRODUCT SECTION ================= */}
        <section id="featured-drop" className="border-t border-black/5 bg-white py-12 sm:py-16 lg:py-20">
          <div className="container-custom">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#a06f00] mb-2">
                  <Sparkles className="h-3 w-3 text-[#c88d00]" />
                  <span>Verified Fresh Inventory</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                  Featured Drop: Thrift Grade A & New Finds
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-xl">
                  Physically inspected items with clear condition grading and transparent pricing.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b0b0b] px-6 py-3 text-xs font-black uppercase tracking-wider text-[#FFD700] transition hover:bg-black hover:scale-105 active:scale-95 shadow-md self-start sm:self-auto"
              >
                <span>Shop All Drops</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Product Cards Grid (4 cols on desktop, 2 cols on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {featuredDropProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Bottom Section Link */}
            <div className="mt-10 sm:mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border-2 border-black/10 bg-[#fffaf0] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-[#111111] transition hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-black shadow-sm"
              >
                <span>Browse All 5,000+ Verified Fits</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================= 4. EDITORIAL COLLECTION FEATURE ================= */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#f5f0e8]/60 border-t border-black/5">
          <div className="container-custom">
            <div 
              ref={editorialSectionRef}
              className="overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 bg-[#0e0e0e] text-white shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                
                {/* Large Editorial Fashion Image (7 cols) */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] w-full overflow-hidden bg-black">
                  <img
                    src="/banner-suit-tie.jpg"
                    alt="The Executive & Vintage Edit"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0e0e0e]" />
                  
                  {/* Floating Collection Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-[#FFD700] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg">
                      Editorial Curated Drop
                    </span>
                  </div>
                </div>

                {/* Editorial Collection Copy & Action (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFD700]">
                    The Style Standard
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    The Executive & Vintage Edit
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Designed for Nigerian professionals and sharp dressers who value poise over hype. Featuring tailored two-piece blazers, Italian-cut cotton shirts, and verified leather Oxfords that let you make an entrance without emptying your savings.
                  </p>

                  {/* Curated Highlights */}
                  <div className="mt-5 space-y-2 text-xs text-gray-300 font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                      <span>Verified Grade A Thrift & Brand New sets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                      <span>Full suit, shirt & tie combos under ₦30,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#FFD700]" />
                      <span>Exact measurements listed for accurate fit</span>
                    </div>
                  </div>

                  {/* Primary & Secondary Actions */}
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/products?category=suits&max_price=30000"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD700] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Shop The Executive Edit</span>
                    </Link>

                    <Link
                      href="/products?category=suits"
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-bold text-white transition hover:border-[#FFD700] hover:text-[#FFD700]"
                    >
                      <span>Explore Suits & Blazers</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. "WHY YABARIGHT" TRUST SECTION ================= */}
        <section id="why-yabaright" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-black/5">
          <div className="container-custom">
            
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c88d00]">
                Marketplace Trust Standard
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">
                Why Shop YabaRight?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Online thrift shopping shouldn&apos;t feel like a gamble. We built three core standards into every transaction so you shop with 100% peace of mind.
              </p>
            </div>

            {/* 3 Core Trust Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Pillar 1: Product Condition Grading */}
              <div className="flex flex-col rounded-2xl border border-black/10 bg-[#fffaf0] p-6 sm:p-8 shadow-sm transition hover:border-[#FFD700]/50 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#a06f00] mb-5">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111]">
                  Clear Condition Grading
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  No misleading photos or hidden defects. We strictly evaluate and label every piece: <strong className="text-black">Brand New</strong>, <strong className="text-black">Thrift Grade A (Mint / Like New)</strong>, or <strong className="text-black">Thrift Grade B</strong>. Flaws, collar conditions, and fabric weights are explicitly noted.
                </p>
                <div className="mt-4 pt-4 border-t border-black/5 text-[11px] font-black uppercase tracking-wider text-[#c88d00]">
                  5-Star Quality Standards
                </div>
              </div>

              {/* Pillar 2: Sizing & Fit Guidance */}
              <div className="flex flex-col rounded-2xl border border-black/10 bg-[#fffaf0] p-6 sm:p-8 shadow-sm transition hover:border-[#FFD700]/50 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#a06f00] mb-5">
                  <Ruler className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111]">
                  Sizing & Fit Guidance
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Vintage and thrift sizing varies across American, UK, and European cuts. We take physical measurements of chest, waist, shoulder width, and inseam in inches and centimeters, comparing them with standard Nigerian body fits so your order fits right the first time.
                </p>
                <div className="mt-4 pt-4 border-t border-black/5 text-[11px] font-black uppercase tracking-wider text-[#c88d00]">
                  Accurate Measurements Guaranteed
                </div>
              </div>

              {/* Pillar 3: Seller Trust & Verification */}
              <div className="flex flex-col rounded-2xl border border-black/10 bg-[#fffaf0] p-6 sm:p-8 shadow-sm transition hover:border-[#FFD700]/50 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#a06f00] mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-[#111111]">
                  Vetted Sellers & Buyer Escrow
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Every merchant undergoes phone and identity verification before listing. Payments are secured in automated escrow: your money is only released to the seller after the package is delivered and inspected.
                </p>
                <div className="mt-4 pt-4 border-t border-black/5 text-[11px] font-black uppercase tracking-wider text-[#c88d00]">
                  100% Protected Local Checkout
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= 6. ABOUT US (WHO WE ARE!) SECTION ================= */}
        <section id="about-us" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#fffaf0] via-[#fbf5e6] to-[#fffaf0] border-t border-black/5">
          <div className="container-custom max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FFD700]/30 bg-[#0e0e0e] p-6 sm:p-10 md:p-14 text-white shadow-2xl">
              
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#FFD700]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#e8941f]/10 blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#FFD700] mb-4">
                  <span>Our Heart & Mission</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                  YABARIGHT <span className="text-[#FFD700]">WHO WE ARE!</span>
                </h2>

                <div className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed text-gray-300 font-medium">
                  <div className="rounded-xl border-l-4 border-[#FFD700] bg-white/5 p-4 text-gray-200">
                    <p className="text-sm sm:text-base font-bold text-[#FFD700]">
                      “Do I look good and take care of myself, or do I pay my children’s school fees?”
                    </p>
                  </div>

                  <p>
                    A time when a man begins sacrificing his youth, his confidence, his appearance, and the little things that once made him feel alive — all because he has a family to provide for.
                  </p>

                  <p className="text-white font-bold">
                    A man shouldn’t have to lose himself just to take care of the people he loves. The moment you stop looking good and having that confidence, something inside you begins to fade.
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[#FFD700]">
                    That’s the emotion behind YabaRight. Look good. Earn more. Live better. ❤️
                  </p>

                  <p>
                    Through our marketplace and affiliate program, you can dress in Grade A fashion without spending a fortune, while earning commissions from products people buy every day.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#ffcc00] hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <span>Shop Affordable Fits</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/affiliate"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-white/20 hover:text-[#FFD700]"
                  >
                    <DollarSign className="h-4 w-4 text-[#FFD700]" />
                    <span>Join Affiliate & Earn</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 7. PROMINENT SELLER CTA BANNER ================= */}
        <section className="py-12 sm:py-16">
          <div className="container-custom">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFD700] via-[#ffcc00] to-[#e8941f] p-8 sm:p-12 shadow-xl border border-black/10">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center md:text-left">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-black/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black mb-3">
                    <Store className="h-3.5 w-3.5" />
                    <span>Vendor Hub</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
                    Turn Your Closet into Daily Income
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-black/85 leading-relaxed">
                    Have quality thrift pieces, vintage jackets, corporate footwear, or boutique stock? Join thousands of verified Nigerian vendors selling on YabaRight with nationwide delivery support.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-xs font-black uppercase tracking-wider text-[#FFD700] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-xl"
                  >
                    <span>Start Selling Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-black/20 bg-black/10 px-6 py-3.5 text-xs font-bold text-black transition hover:bg-black/20"
                  >
                    <span>Seller Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ================= 8. SIMPLIFIED FOOTER ================= */}
      <Footer />
      <BottomNav />
      <ToastContainer />
    </div>
  );
}
